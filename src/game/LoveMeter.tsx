import { Suitor } from './data';

interface Props {
  suitor: Suitor;
  value: number;
  compact?: boolean;
}

export default function LoveMeter({ suitor, value, compact }: Props) {
  return (
    <div className={compact ? 'w-full' : 'w-full'}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium" style={{ color: suitor.accent }}>
          {suitor.name}
        </span>
        <span className="text-xs tabular-nums text-muted-foreground">{value}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden border border-border">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${suitor.accent}55, ${suitor.accent})`,
            boxShadow: `0 0 12px ${suitor.glow}`,
          }}
        />
      </div>
    </div>
  );
}
