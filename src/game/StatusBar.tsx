import Icon from '@/components/ui/icon';
import { GameState } from './useGame';

interface Props {
  state: GameState;
}

const Stat = ({ icon, value, color }: { icon: string; value: string | number; color: string }) => (
  <div className="flex items-center gap-2 rounded-full bg-card/70 backdrop-blur px-4 py-1.5 border border-border">
    <Icon name={icon} size={16} className={color} />
    <span className="text-sm font-semibold tabular-nums">{value}</span>
  </div>
);

export default function StatusBar({ state }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <Stat icon="CalendarDays" value={`День ${state.day}`} color="text-primary" />
      <Stat icon="Hourglass" value={`${state.actions}/3`} color="text-violet-300" />
      <Stat icon="Coins" value={state.money} color="text-amber-300" />
      <Stat icon="Apple" value={state.food} color="text-rose-300" />
      {state.debt > 0 && <Stat icon="ScrollText" value={`Долг ${state.debt}`} color="text-red-400" />}
    </div>
  );
}
