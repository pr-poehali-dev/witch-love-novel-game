import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SUITORS, STYLES, POTIONS, DECOR, GIFTS, StyleType, Suitor } from './data';
import { useGame } from './useGame';
import Scene from './Scene';
import StatusBar from './StatusBar';
import LoveMeter from './LoveMeter';

type Screen = 'menu' | 'style' | 'play';
type Panel = 'home' | 'meet' | 'shop' | 'decor' | 'chars' | 'inv';

const SAVE_KEY = 'witch_save_v1';

export default function Game() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [style, setStyle] = useState<StyleType>('mystic');
  return screen === 'play' ? (
    <Play style={style} onExit={() => setScreen('menu')} />
  ) : (
    <Menu
      screen={screen}
      setScreen={setScreen}
      style={style}
      setStyle={setStyle}
    />
  );
}

/* ───────────────── MENU + STYLE SELECT ───────────────── */
function Menu({
  screen,
  setScreen,
  style,
  setStyle,
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
  style: StyleType;
  setStyle: (s: StyleType) => void;
}) {
  const hasSave = !!localStorage.getItem(SAVE_KEY);

  if (screen === 'style') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center animate-fade-in">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-glow mb-2">Твой облик</h2>
          <p className="text-muted-foreground mb-8">
            От твоего стиля зависит, чьё сердце забьётся чаще. Каждому поклоннику мил свой образ.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {STYLES.map((s) => {
              const su = SUITORS.find((x) => x.likedStyle === s.id)!;
              const active = style === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`group rounded-2xl border p-6 text-left transition-all ${
                    active
                      ? 'border-primary bg-card shadow-xl scale-[1.02]'
                      : 'border-border bg-card/50 hover:bg-card hover:scale-[1.01]'
                  }`}
                  style={active ? { boxShadow: `0 0 30px ${su.glow}` } : {}}
                >
                  <Icon name={s.icon} size={28} style={{ color: su.accent }} />
                  <h3 className="font-display text-2xl font-bold mt-3">{s.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                  <p className="text-xs mt-3" style={{ color: su.accent }}>
                    Нравится: {su.name} ({su.role})
                  </p>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 justify-center mt-8">
            <Button variant="ghost" onClick={() => setScreen('menu')}>
              <Icon name="ChevronLeft" size={18} /> Назад
            </Button>
            <Button size="lg" onClick={() => setScreen('play')} className="px-8">
              Начать историю <Icon name="Sparkles" size={18} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 animate-glow-pulse" />
      <div className="relative animate-fade-in">
        <p className="tracking-[0.4em] text-xs text-primary uppercase mb-4">Отоме · Готическая новелла</p>
        <h1 className="font-display text-6xl sm:text-8xl font-bold text-glow leading-none">
          Ведьмин
          <br />
          Приют
        </h1>
        <p className="max-w-md mx-auto text-muted-foreground mt-6">
          В городе, где не сжигают за магию, юная ведьма ищет дом, монеты и… любовь. Сказочник, демон
          и арлекин уже не сводят с тебя глаз.
        </p>
        <div className="flex flex-col items-center gap-3 mt-10">
          <Button size="lg" className="px-12 text-lg" onClick={() => setScreen('style')}>
            <Icon name="Play" size={20} /> Новая игра
          </Button>
          <Button
            variant="outline"
            size="lg"
            disabled={!hasSave}
            onClick={() => {
              const saved = localStorage.getItem(SAVE_KEY);
              if (saved) {
                const st = JSON.parse(saved).style as StyleType;
                setStyle(st);
                setScreen('play');
              }
            }}
          >
            <Icon name="Bookmark" size={18} /> Продолжить
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── GAMEPLAY ───────────────── */
function Play({ style, onExit }: { style: StyleType; onExit: () => void }) {
  const game = useGame(style);
  const { state } = game;
  const [panel, setPanel] = useState<Panel>('home');
  const [activeSuitor, setActiveSuitor] = useState<Suitor>(SUITORS[0]);
  const [dialogIdx, setDialogIdx] = useState(0);
  const [sceneText, setSceneText] = useState(state.log[0]);

  const save = () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  };

  const meet = (su: Suitor) => {
    setActiveSuitor(su);
    setPanel('meet');
    setSceneText(su.intro);
    setDialogIdx(0);
  };

  const handleTalk = () => {
    const line = activeSuitor.dialogues[dialogIdx % activeSuitor.dialogues.length];
    game.talk(activeSuitor.id, line);
    setSceneText(line);
    setDialogIdx((i) => i + 1);
  };

  // ENDING
  if (state.ending) {
    const won = SUITORS.find((s) => s.id === state.ending!.suitor);
    return <Ending win={state.ending.type === 'win'} suitor={won} onExit={onExit} onReset={game.reset} />;
  }

  const sceneSuitor = panel === 'meet' ? activeSuitor : null;
  const location = panel === 'meet' ? 'town' : 'home';

  return (
    <div className="min-h-screen p-3 sm:p-5 max-w-5xl mx-auto">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <StatusBar state={state} />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={save}>
            <Icon name="Save" size={16} /> Сохранить
          </Button>
          <Button variant="ghost" size="sm" onClick={onExit}>
            <Icon name="Home" size={16} />
          </Button>
        </div>
      </div>

      {/* SCENE */}
      <Scene suitor={sceneSuitor} text={sceneText} location={location} />

      {/* NAV TABS */}
      <div className="flex flex-wrap gap-2 mt-4 mb-3">
        {(
          [
            ['home', 'Дом', 'House'],
            ['meet', 'Встречи', 'Heart'],
            ['shop', 'Зелья', 'FlaskConical'],
            ['decor', 'Декор', 'LampDesk'],
            ['chars', 'Сердца', 'Users'],
            ['inv', 'Сумка', 'Backpack'],
          ] as [Panel, string, string][]
        ).map(([id, label, icon]) => (
          <button
            key={id}
            onClick={() => {
              setPanel(id);
              if (id === 'home') setSceneText('Твой уютный ведьмин дом. Котёл булькает, свечи горят. Что будем делать?');
            }}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all border ${
              panel === id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card/60 border-border hover:bg-card'
            }`}
          >
            <Icon name={icon} size={16} /> {label}
          </button>
        ))}
      </div>

      {/* PANEL CONTENT */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-4 sm:p-5 animate-scale-in">
        {panel === 'home' && <HomePanel game={game} />}
        {panel === 'meet' && (
          <MeetPanel suitors={SUITORS} active={activeSuitor} onSelect={meet} onTalk={handleTalk} love={state.love} />
        )}
        {panel === 'shop' && <ShopPanel game={game} />}
        {panel === 'decor' && <DecorPanel game={game} />}
        {panel === 'chars' && <CharsPanel love={state.love} style={state.style} />}
        {panel === 'inv' && <InvPanel game={game} />}
      </div>

      {/* LOG */}
      <details className="mt-3 rounded-xl border border-border bg-card/40 px-4 py-2">
        <summary className="cursor-pointer text-sm text-muted-foreground select-none">Дневник событий</summary>
        <div className="mt-2 space-y-1 max-h-40 overflow-y-auto text-sm text-foreground/80">
          {state.log.map((l, i) => (
            <p key={i} className={i === 0 ? 'text-primary' : ''}>
              · {l}
            </p>
          ))}
        </div>
      </details>
    </div>
  );
}

/* ───────────────── PANELS ───────────────── */
function ActionCard({
  icon,
  title,
  sub,
  onClick,
  disabled,
  accent,
}: {
  icon: string;
  title: string;
  sub: string;
  onClick: () => void;
  disabled?: boolean;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group flex items-center gap-3 rounded-xl border border-border bg-secondary/40 hover:bg-secondary p-3 text-left transition-all disabled:opacity-40 hover:scale-[1.01]"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card"
        style={{ color: accent ?? 'hsl(var(--primary))' }}
      >
        <Icon name={icon} size={20} />
      </span>
      <span>
        <span className="block font-semibold text-sm">{title}</span>
        <span className="block text-xs text-muted-foreground">{sub}</span>
      </span>
    </button>
  );
}

type GameApi = ReturnType<typeof useGame>;

function HomePanel({ game }: { game: GameApi }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <ActionCard icon="Apple" title="Купить еду (+2)" sub="−20 монет · трата действия" onClick={game.buyFood} />
      <ActionCard
        icon="FlaskConical"
        title="К зельеварению"
        sub="Свари и продай зелья за монеты"
        onClick={() => {}}
        disabled
      />
      <p className="sm:col-span-2 text-xs text-muted-foreground">
        💡 У тебя 3 действия в день. Разговоры, зелья и еда тратят действие. Декор и подарки — нет.
        Каждый понедельник нужно платить аренду 60 монет.
      </p>
    </div>
  );
}

function MeetPanel({
  suitors,
  active,
  onSelect,
  onTalk,
  love,
}: {
  suitors: Suitor[];
  active: Suitor;
  onSelect: (s: Suitor) => void;
  onTalk: () => void;
  love: Record<string, number>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {suitors.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`rounded-xl border p-2 transition-all ${
              active.id === s.id ? 'border-primary scale-[1.02]' : 'border-border opacity-80 hover:opacity-100'
            }`}
            style={active.id === s.id ? { boxShadow: `0 0 18px ${s.glow}` } : {}}
          >
            <img src={s.portrait} alt={s.name} className="w-full h-20 object-cover rounded-lg" />
            <p className="text-xs font-semibold mt-1" style={{ color: s.accent }}>
              {s.name}
            </p>
            <p className="text-[10px] text-muted-foreground">{love[s.id]}%</p>
          </button>
        ))}
      </div>
      <Button onClick={onTalk} className="w-full" style={{ background: active.accent, color: '#1a1020' }}>
        <Icon name="MessageCircleHeart" size={18} /> Поговорить с {active.name} (+3% любви)
      </Button>
    </div>
  );
}

function ShopPanel({ game }: { game: GameApi }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon name="FlaskConical" size={16} className="text-primary" />
        Готовых зелий в котле: <b className="text-foreground">{game.state.potions}</b>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {POTIONS.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-secondary/40 p-3">
            <Icon name={p.icon} size={22} className="text-primary" />
            <p className="font-semibold text-sm mt-2">{p.name}</p>
            <p className="text-xs text-muted-foreground">Сварить: {p.cost} · Продать: {p.price}</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => game.brewPotion(p)}>
                Сварить
              </Button>
              <Button size="sm" className="flex-1" onClick={() => game.sellPotion(p.price)}>
                Продать
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DecorPanel({ game }: { game: GameApi }) {
  const cats = [
    ['table', 'Столы'],
    ['sofa', 'Диваны'],
    ['painting', 'Картины'],
    ['flowers', 'Цветы'],
  ] as const;
  return (
    <div className="space-y-4">
      {cats.map(([cat, label]) => (
        <div key={cat}>
          <h4 className="font-display text-lg font-bold mb-2">{label}</h4>
          <div className="grid sm:grid-cols-3 gap-2">
            {DECOR.filter((d) => d.category === cat).map((d) => {
              const su = SUITORS.find((s) => s.id === d.suitor)!;
              const owned = game.state.decor.includes(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => game.buyDecor(d)}
                  disabled={owned}
                  className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 hover:bg-secondary p-2 text-left transition-all disabled:opacity-50"
                >
                  <Icon name={d.icon} size={18} style={{ color: su.accent }} />
                  <span className="flex-1">
                    <span className="block text-xs font-medium">{d.name}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {owned ? 'Куплено' : `${d.price} монет`}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function CharsPanel({ love, style }: { love: Record<string, number>; style: StyleType }) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {SUITORS.map((s) => (
        <div key={s.id} className="rounded-xl border border-border overflow-hidden bg-secondary/30">
          <img src={s.portrait} alt={s.name} className="w-full h-32 object-cover" />
          <div className="p-3">
            <h4 className="font-display text-xl font-bold" style={{ color: s.accent }}>
              {s.name}
            </h4>
            <p className="text-xs text-muted-foreground mb-2">{s.role}</p>
            <LoveMeter suitor={s} value={love[s.id]} />
            <p className="text-[11px] mt-2 text-muted-foreground">
              Любит образ: <b style={{ color: s.accent }}>{s.styleLabel}</b>
              {s.likedStyle === style && ' ✨ (твой стиль!)'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InvPanel({ game }: { game: GameApi }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-display text-lg font-bold mb-2">Подарки поклонникам</h4>
        <div className="grid sm:grid-cols-3 gap-2">
          {GIFTS.map((g) => {
            const su = SUITORS.find((s) => s.id === g.suitor)!;
            return (
              <button
                key={g.id}
                onClick={() => game.buyGift(g)}
                className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 hover:bg-secondary p-2 text-left transition-all"
              >
                <Icon name={g.icon} size={18} style={{ color: su.accent }} />
                <span className="flex-1">
                  <span className="block text-xs font-medium">{g.name}</span>
                  <span className="block text-[10px] text-muted-foreground">
                    {g.price} монет · для {su.name} (+5%)
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <h4 className="font-display text-lg font-bold mb-2">Твоя сумка</h4>
        {game.state.inventory.length === 0 ? (
          <p className="text-sm text-muted-foreground">Пока пусто. Купи подарки, чтобы покорить сердца.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {game.state.inventory.map((it, i) => (
              <span key={i} className="rounded-full bg-secondary px-3 py-1 text-xs">
                {it}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────── ENDING ───────────────── */
function Ending({
  win,
  suitor,
  onExit,
  onReset,
}: {
  win: boolean;
  suitor?: Suitor;
  onExit: () => void;
  onReset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-lg animate-fade-in">
        {win && suitor ? (
          <>
            <img
              src={suitor.portrait}
              alt={suitor.name}
              className="w-40 h-40 mx-auto rounded-full object-cover border-4 mb-6 animate-float"
              style={{ borderColor: suitor.accent, boxShadow: `0 0 50px ${suitor.glow}` }}
            />
            <p className="tracking-[0.3em] text-xs uppercase mb-2" style={{ color: suitor.accent }}>
              Счастливый финал
            </p>
            <h2 className="font-display text-5xl font-bold text-glow mb-4">{suitor.name} признаётся</h2>
            <p className="text-muted-foreground leading-relaxed">
              {suitor.id === 'storyteller' &&
                '«Я переписал сотни сказок, но ни одна не была так прекрасна, как наша. Выходи за меня, моя ведьма — и пусть эта история никогда не закончится».'}
              {suitor.id === 'demon' &&
                '«Я предлагал тебе сделки, золото и вечность. Теперь предлагаю единственное, чего у меня не было — сердце. Стань моей, навсегда».'}
              {suitor.id === 'harlequin' &&
                '«Долой маски! Под всеми шутками пряталось одно: я люблю тебя до дрожи. Будь моей женой — и пусть весь мир аплодирует нам стоя!»'}
            </p>
            <p className="font-display text-2xl mt-4" style={{ color: suitor.accent }}>
              «Да!» — шепчешь ты. 💍
            </p>
          </>
        ) : (
          <>
            <Icon name="Skull" size={64} className="mx-auto text-destructive mb-4" />
            <h2 className="font-display text-5xl font-bold text-destructive mb-3">Конец пути</h2>
            <p className="text-muted-foreground">
              Голод и долги оказались сильнее магии. Дом ведьмы опустел, а поклонники ещё долго
              вспоминали ту, что исчезла слишком рано… Береги монеты и припасы, ведьма.
            </p>
          </>
        )}
        <div className="flex gap-3 justify-center mt-8">
          <Button
            size="lg"
            onClick={() => {
              onReset();
              onExit();
            }}
          >
            <Icon name="RotateCcw" size={18} /> Начать заново
          </Button>
        </div>
      </div>
    </div>
  );
}
