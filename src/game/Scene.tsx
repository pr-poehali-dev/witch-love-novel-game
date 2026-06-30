import Icon from '@/components/ui/icon';
import { Suitor, HEROINE, BG_HOME, BG_TOWN, ROOM_THEMES, DECOR } from './data';

interface Props {
  suitor: Suitor | null;
  text: string;
  location: 'home' | 'town';
  decor: string[];
}

// какой тематический фон комнаты показать: тот, чьего декора куплено больше всего (минимум 2 предмета)
function pickRoomBg(decor: string[]): string {
  const count: Record<string, number> = { storyteller: 0, demon: 0, harlequin: 0 };
  decor.forEach((id) => {
    const d = DECOR.find((x) => x.id === id);
    if (d) count[d.suitor]++;
  });
  let best: string | null = null;
  let max = 1; // нужно минимум 2 тематических предмета, чтобы комната «преобразилась»
  (Object.keys(count) as (keyof typeof count)[]).forEach((k) => {
    if (count[k] > max) {
      max = count[k];
      best = k;
    }
  });
  return best ? ROOM_THEMES[best as Suitor['id']] : BG_HOME;
}

export default function Scene({ suitor, text, location, decor }: Props) {
  const bg = location === 'home' ? pickRoomBg(decor) : BG_TOWN;
  const placed = DECOR.filter((d) => decor.includes(d.id));

  return (
    <div className="relative w-full h-[42vh] sm:h-[48vh] rounded-2xl overflow-hidden border border-border shadow-2xl">
      <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute inset-0 magic-grain opacity-60" />

      {/* Иконки купленного декора — мерцают в комнате */}
      {location === 'home' && placed.length > 0 && (
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 animate-fade-in">
          {placed.map((d) => {
            const su = SUITORS_COLOR[d.suitor];
            return (
              <span
                key={d.id}
                title={d.name}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-card/70 backdrop-blur border border-border"
                style={{ color: su, boxShadow: `0 0 10px ${su}55` }}
              >
                <Icon name={d.icon} size={15} />
              </span>
            );
          })}
        </div>
      )}

      {/* Парень — по пояс, по центру/справа */}
      {suitor && (
        <img
          src={suitor.portrait}
          alt={suitor.name}
          className="absolute bottom-0 right-2 sm:right-16 h-[78%] object-contain object-bottom animate-fade-in drop-shadow-2xl"
          style={{ filter: `drop-shadow(0 0 30px ${suitor.glow})` }}
        />
      )}

      {/* Героиня — слева */}
      <img
        src={HEROINE}
        alt="Ведьма"
        className="absolute bottom-0 left-0 sm:left-4 h-[92%] object-contain object-bottom animate-fade-in drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 0 26px rgba(199,125,255,0.45))' }}
      />

      {/* Текстовый блок снизу */}
      <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6">
        <div className="rounded-xl border border-border bg-card/85 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 shadow-xl animate-slide-up">
          {suitor && (
            <span className="font-display text-lg sm:text-xl font-bold text-glow" style={{ color: suitor.accent }}>
              {suitor.name} · {suitor.role}
            </span>
          )}
          <p className="text-sm sm:text-base leading-relaxed text-foreground/90 mt-1">{text}</p>
        </div>
      </div>
    </div>
  );
}

const SUITORS_COLOR: Record<string, string> = {
  storyteller: '#8b9dff',
  demon: '#ff4d5e',
  harlequin: '#c77dff',
};
