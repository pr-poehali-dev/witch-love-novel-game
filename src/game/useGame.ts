import { useState, useCallback } from 'react';
import { SUITORS, StyleType } from './data';

export interface GameState {
  day: number;
  actions: number;
  money: number;
  food: number;
  debt: number;
  style: StyleType;
  love: Record<string, number>;
  potions: number;
  inventory: string[];
  decor: string[];
  log: string[];
  ending: null | { suitor: string; type: 'win' | 'lose' };
}

const RENT = 60;

export const initialState = (style: StyleType): GameState => ({
  day: 1,
  actions: 3,
  money: 120,
  food: 3,
  debt: 0,
  style,
  love: { storyteller: 10, demon: 10, harlequin: 10 },
  potions: 0,
  inventory: [],
  decor: [],
  log: ['Ты переехала в новый город. Здесь за колдовство не жгут — здесь за него платят. Начни новую жизнь, ведьма.'],
  ending: null,
});

export function useGame(style: StyleType) {
  const [state, setState] = useState<GameState>(() => initialState(style));

  const pushLog = (s: GameState, msg: string): GameState => ({
    ...s,
    log: [msg, ...s.log].slice(0, 30),
  });

  const checkEnding = (s: GameState): GameState => {
    const won = SUITORS.find((su) => s.love[su.id] >= 100);
    if (won) {
      return { ...s, ending: { suitor: won.id, type: 'win' } };
    }
    if (s.food <= 0) {
      return { ...s, ending: { suitor: '', type: 'lose' } };
    }
    return s;
  };

  // повышение любви с учётом стиля
  const raiseLove = (s: GameState, suitorId: string, base: number): GameState => {
    const su = SUITORS.find((x) => x.id === suitorId)!;
    const bonus = su.likedStyle === s.style ? 2 : 0;
    const next = Math.min(100, s.love[suitorId] + base + bonus);
    return { ...s, love: { ...s.love, [suitorId]: next } };
  };

  const spendAction = (s: GameState): GameState => ({ ...s, actions: s.actions - 1 });

  const endDay = (s: GameState): GameState => {
    let ns = { ...s, day: s.day + 1, actions: 3, food: s.food - 1 };
    ns = pushLog(ns, `День ${s.day} завершён. Ты съела немного припасов. Наступает день ${ns.day}.`);

    // расчётный день — каждый 7-й (понедельник)
    if (ns.day % 7 === 1 && ns.day > 1) {
      if (ns.money >= RENT) {
        ns = { ...ns, money: ns.money - RENT };
        ns = pushLog(ns, `Понедельник. Аренда ${RENT} монет оплачена.`);
      } else {
        const helper = SUITORS.find((su) => ns.love[su.id] >= 50);
        if (helper) {
          ns = { ...ns, money: ns.money - RENT };
          ns = raiseLove(ns, helper.id, 0);
          ns = pushLog(ns, `Денег не хватило! ${helper.name} выручает тебя и оплачивает аренду. «Взамен — лишь твоё внимание», — улыбается он.`);
        } else {
          // никто не любит >50% — берут в долг и теряют 10%
          ns = {
            ...ns,
            debt: ns.debt + RENT,
            love: {
              storyteller: Math.max(0, ns.love.storyteller - 10),
              demon: Math.max(0, ns.love.demon - 10),
              harlequin: Math.max(0, ns.love.harlequin - 10),
            },
          };
          ns = pushLog(ns, `Аренду нечем платить! Парни дают в долг ${RENT} монет, но разочарованы (−10% любви у каждого). Долг придётся вернуть.`);
        }
      }
    }

    ns = checkEnding(ns);
    return ns;
  };

  const act = useCallback((fn: (s: GameState) => GameState) => {
    setState((s) => {
      if (s.ending || s.actions <= 0) return s;
      let ns = fn(s);
      ns = spendAction(ns);
      if (ns.actions <= 0) ns = endDay(ns);
      return ns;
    });
  }, []);

  // === Действия ===
  const talk = (suitorId: string, line: string) =>
    act((s) => {
      let ns = raiseLove(s, suitorId, 3);
      ns = pushLog(ns, line);
      return ns;
    });

  const brewPotion = (potion: { name: string; cost: number }) =>
    act((s) => {
      if (s.money < potion.cost) return pushLog(s, 'Не хватает монет на ингредиенты!');
      let ns = { ...s, money: s.money - potion.cost, potions: s.potions + 1 };
      ns = pushLog(ns, `Ты сварила «${potion.name}». В котле булькает магия!`);
      return ns;
    });

  const sellPotion = (price: number) =>
    act((s) => {
      if (s.potions <= 0) return pushLog(s, 'Нечего продавать — котёл пуст.');
      let ns = { ...s, potions: s.potions - 1, money: s.money + price };
      ns = pushLog(ns, `Зелье продано за ${price} монет. Горожане в восторге!`);
      return ns;
    });

  const buyFood = () =>
    act((s) => {
      if (s.money < 20) return pushLog(s, 'Не хватает монет на еду!');
      return pushLog({ ...s, money: s.money - 20, food: s.food + 2 }, 'Ты закупила припасов. Голод отступает.');
    });

  // покупки без траты действия
  const buyDecor = (item: { id: string; name: string; price: number; suitor: string }) =>
    setState((s) => {
      if (s.ending) return s;
      if (s.decor.includes(item.id)) return pushLog(s, 'Этот предмет уже украшает твой дом.');
      if (s.money < item.price) return pushLog(s, 'Не хватает монет на декор!');
      let ns = { ...s, money: s.money - item.price, decor: [...s.decor, item.id] };
      ns = raiseLove(ns, item.suitor, 4);
      ns = pushLog(ns, `Ты обустроила дом: «${item.name}». Сердце одного из поклонников дрогнуло (+любовь).`);
      return ns;
    });

  const buyGift = (item: { name: string; price: number; suitor: string }) =>
    setState((s) => {
      if (s.ending) return s;
      if (s.money < item.price) return pushLog(s, 'Не хватает монет на подарок!');
      let ns = { ...s, money: s.money - item.price, inventory: [...s.inventory, item.name] };
      ns = raiseLove(ns, item.suitor, 5);
      ns = pushLog(ns, `Ты подарила «${item.name}». Поклонник тронут до глубины души (+5% любви).`);
      return ns;
    });

  const reset = () => setState(initialState(style));

  return { state, talk, brewPotion, sellPotion, buyFood, buyDecor, buyGift, reset };
}
