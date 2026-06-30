import { useState, useCallback } from 'react';
import { SUITORS, StyleType, toneOf } from './data';

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
  helpUsed: boolean; // помощь по кнопке доступна раз в неделю
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
  helpUsed: false,
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
    if (won) return { ...s, ending: { suitor: won.id, type: 'win' } };
    if (s.food <= 0) return { ...s, ending: { suitor: '', type: 'lose' } };
    return s;
  };

  const raiseLove = (s: GameState, suitorId: string, base: number): GameState => {
    const su = SUITORS.find((x) => x.id === suitorId)!;
    const bonus = su.likedStyle === s.style ? 2 : 0;
    const next = Math.min(100, s.love[suitorId] + base + bonus);
    return { ...s, love: { ...s.love, [suitorId]: next } };
  };

  const spendAction = (s: GameState): GameState => ({ ...s, actions: s.actions - 1 });

  // случайное событие от парня в начале нового дня
  const maybeSuitorEvent = (s: GameState): GameState => {
    if (Math.random() > 0.45) return s; // ~45% шанс
    const fans = SUITORS.filter((su) => s.love[su.id] >= 20);
    if (fans.length === 0) return s;
    const su = fans[Math.floor(Math.random() * fans.length)];
    const roll = Math.random();
    let ns = s;
    if (roll < 0.34) {
      // подарок: деньги
      ns = { ...ns, money: ns.money + 40 };
      ns = raiseLove(ns, su.id, 2);
      ns = pushLog(ns, `🎁 ${su.name} зашёл сам и оставил тебе 40 монет: «${su.gifts[1]}»`);
    } else if (roll < 0.67) {
      // подарок: еда
      ns = { ...ns, food: ns.food + 2 };
      ns = raiseLove(ns, su.id, 2);
      ns = pushLog(ns, `🎁 ${su.name} принёс тебе припасов (+2 еды): «${su.gifts[2]}»`);
    } else {
      // парень идёт навстречу — просто тёплый жест и +любовь
      ns = raiseLove(ns, su.id, 3);
      ns = pushLog(ns, `💜 ${su.name} сам пришёл повидать тебя. Похоже, он всё чаще думает о тебе (+любовь).`);
    }
    return ns;
  };

  const endDay = (s: GameState): GameState => {
    let ns = { ...s, day: s.day + 1, actions: 3, food: s.food - 1 };
    ns = pushLog(ns, `День ${s.day} завершён. Ты немного поела. Наступает день ${ns.day}.`);

    // расчётный день — каждый понедельник (каждый 7-й день)
    if (ns.day % 7 === 1 && ns.day > 1) {
      ns = { ...ns, helpUsed: false };
      if (ns.money >= RENT) {
        ns = { ...ns, money: ns.money - RENT };
        ns = pushLog(ns, `🏠 Понедельник. Аренда ${RENT} монет оплачена. Денег осталось: ${ns.money}.`);
      } else {
        const helper = SUITORS.find((su) => ns.love[su.id] >= 50);
        if (helper) {
          // деньги НЕ уходят в минус: парень покрывает всю аренду
          ns = { ...ns, money: 0 };
          ns = raiseLove(ns, helper.id, 2);
          ns = pushLog(ns, `🏠 Денег не хватило! ${helper.name} оплатил аренду за тебя. «Взамен — лишь твоё внимание», — улыбается он (+любовь).`);
        } else {
          // никто не любит ≥50% — в долг, все теряют 10%, деньги обнуляются (не в минус)
          ns = {
            ...ns,
            money: 0,
            debt: ns.debt + RENT,
            love: {
              storyteller: Math.max(0, ns.love.storyteller - 10),
              demon: Math.max(0, ns.love.demon - 10),
              harlequin: Math.max(0, ns.love.harlequin - 10),
            },
          };
          ns = pushLog(ns, `🏠 Аренду нечем платить! Парни нехотя дали в долг ${RENT} монет и разочарованы (−10% любви у всех). Долг ${ns.debt} нужно вернуть.`);
        }
      }
    }

    ns = maybeSuitorEvent(ns);
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

  // === Действия (тратят действие) ===
  const talk = (suitorId: string, line: string) =>
    act((s) => {
      let ns = raiseLove(s, suitorId, 3);
      ns = pushLog(ns, line);
      return ns;
    });

  const invite = (suitorId: string, line: string) =>
    act((s) => {
      let ns = raiseLove(s, suitorId, 4);
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

  // === Помощь: попросить денег у парня (не тратит действие, раз в неделю) ===
  const askForHelp = () =>
    setState((s) => {
      if (s.ending) return s;
      if (s.helpUsed) return pushLog(s, 'Ты уже просила о помощи на этой неделе. Неудобно частить!');
      const helper = SUITORS.find((su) => s.love[su.id] >= 50);
      if (helper) {
        let ns = { ...s, money: s.money + 60, helpUsed: true };
        ns = raiseLove(ns, helper.id, 2);
        ns = pushLog(ns, `🙏 Ты попросила помощи. ${helper.name} тут же дал тебе 60 монет: «Только попроси — всё для тебя» (+любовь).`);
        return ns;
      }
      // никто не любит ≥50% — дают в долг и слегка обижаются
      let ns = { ...s, money: s.money + 40, debt: s.debt + 40, helpUsed: true };
      ns = {
        ...ns,
        love: {
          storyteller: Math.max(0, ns.love.storyteller - 5),
          demon: Math.max(0, ns.love.demon - 5),
          harlequin: Math.max(0, ns.love.harlequin - 5),
        },
      };
      ns = pushLog(ns, '🙏 Ты попросила денег. Парни холодно дали 40 монет в долг (−5% любви у всех). Долг придётся вернуть.');
      return ns;
    });

  const payDebt = () =>
    setState((s) => {
      if (s.ending) return s;
      if (s.debt <= 0) return pushLog(s, 'Долгов нет — ты свободна, ведьма!');
      const pay = Math.min(s.money, s.debt);
      if (pay <= 0) return pushLog(s, 'Нет монет, чтобы погасить долг.');
      let ns = { ...s, money: s.money - pay, debt: s.debt - pay };
      ns = pushLog(ns, `Ты вернула ${pay} монет долга. Осталось долга: ${ns.debt}.`);
      return ns;
    });

  // === Покупки без траты действия ===
  const buyDecor = (item: { id: string; name: string; price: number; suitor: string }) =>
    setState((s) => {
      if (s.ending) return s;
      if (s.decor.includes(item.id)) return pushLog(s, 'Этот предмет уже украшает твой дом.');
      if (s.money < item.price) return pushLog(s, 'Не хватает монет на декор!');
      let ns = { ...s, money: s.money - item.price, decor: [...s.decor, item.id] };
      ns = raiseLove(ns, item.suitor, 4);
      ns = pushLog(ns, `Ты обустроила дом: «${item.name}». Сердце поклонника дрогнуло (+любовь).`);
      return ns;
    });

  const buyGift = (item: { name: string; price: number; suitor: string }) =>
    setState((s) => {
      if (s.ending) return s;
      if (s.money < item.price) return pushLog(s, 'Не хватает монет на подарок!');
      const su = SUITORS.find((x) => x.id === item.suitor)!;
      let ns = { ...s, money: s.money - item.price, inventory: [...s.inventory, item.name] };
      ns = raiseLove(ns, item.suitor, 5);
      const tone = toneOf(s.love[item.suitor]);
      const react =
        tone === 'cold'
          ? `${su.name} сдержанно принимает подарок: «Ну… спасибо, ведьма».`
          : tone === 'warm'
          ? `${su.name} рад: «А ты внимательная. Приятно».`
          : tone === 'shy'
          ? `${su.name} смущённо прячет взгляд: «Ты… зря потратилась на меня…»`
          : `${su.name} тает: «Для меня? Ты не представляешь, как это важно».`;
      ns = pushLog(ns, `🎁 Ты подарила «${item.name}». ${react} (+5% любви).`);
      return ns;
    });

  const reset = () => setState(initialState(style));

  return {
    state,
    talk,
    invite,
    brewPotion,
    sellPotion,
    buyFood,
    buyDecor,
    buyGift,
    askForHelp,
    payDebt,
    reset,
  };
}
