import { useRef, useState } from "react";
import type { Card } from "@/data/questions";

type Props = {
  card: Card;
  index: number;
  total: number;
  trackLabel: string;
  onNext: () => void;
  onPrev: () => void;
};

export function Flashcard({ card, index, total, trackLabel, onNext, onPrev }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [dx, setDx] = useState(0);
  const [flying, setFlying] = useState<0 | 1 | -1>(0);
  const start = useRef<number | null>(null);

  const reset = () => {
    setDx(0);
    start.current = null;
  };

  const commit = (dir: 1 | -1) => {
    setFlying(dir);
    window.setTimeout(() => {
      setFlying(0);
      setFlipped(false);
      setDx(0);
      dir === 1 ? onNext() : onPrev();
    }, 240);
  };

  const onDown = (e: React.PointerEvent) => {
    if (flying) return;
    start.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (start.current === null) return;
    setDx(e.clientX - start.current);
  };

  const onUp = () => {
    if (start.current === null) return;
    const moved = dx;
    reset();
    if (Math.abs(moved) > 90) commit(moved < 0 ? 1 : -1);
  };

  const offset = flying ? flying * -700 : dx;
  const rotate = offset / 22;

  return (
    <div className="deck3d relative select-none pb-3">
      <div className="absolute inset-x-3 inset-y-0 -rotate-3 rounded-[24px] bg-card/70 ring-1 ring-border" />
      <div className="absolute inset-x-6 inset-y-0 translate-y-2 rotate-2 rounded-[24px] bg-card/85 ring-1 ring-border" />


      <div
        className="flip-shell relative touch-pan-y"
        style={{
          transform: `translateX(${offset}px) rotate(${rotate}deg) rotateX(${flipped ? 180 : 0}deg)`,
          opacity: flying ? 0 : 1,
          transition: start.current !== null ? "none" : undefined,
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClick={() => Math.abs(dx) < 6 && setFlipped((f) => !f)}
      >
        {/* FRONT */}
        <div className="flip-face rounded-[24px] bg-card p-6 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-primary-soft px-3 py-1 font-mono text-[11px] font-medium text-primary">
              {trackLabel}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">question</span>
          </div>
          <p className="mt-4 min-h-[7rem] font-display text-xl font-semibold leading-snug text-balance">
            {card.q}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">
              {index + 1} / {total}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">tap to flip</span>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-face flip-back absolute inset-0 overflow-auto rounded-[24px] bg-card p-6 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-mint/40 px-3 py-1 font-mono text-[11px] font-medium text-foreground">
              {trackLabel}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">answer</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/75">{card.a}</p>
          {card.code && (
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-secondary p-3 font-mono text-[12px] leading-5 text-foreground/80">
              {card.code}
            </pre>
          )}
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">
              {index + 1} / {total}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">swipe to continue</span>
          </div>
        </div>
      </div>
    </div>
  );
}
