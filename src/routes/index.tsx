import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CARDS, TRACKS, type Track } from "@/data/questions";
import { Flashcard } from "@/components/Flashcard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cardstack — SDE Interview Flashcards" },
      {
        name: "description",
        content:
          "Swipeable flashcards for SDE interview prep: 70 Python, OOP and DBMS/SQL questions with answers.",
      },
      { property: "og:title", content: "Cardstack — SDE Interview Flashcards" },
      {
        property: "og:description",
        content: "Tap to flip, swipe to move on. 70 core CS questions for your SDE round.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [track, setTrack] = useState<Track | null>(null);
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);

  const deck = useMemo(() => CARDS.filter((c) => c.track === track), [track]);
  const activeTrack = TRACKS.find((t) => t.id === track);

  const startTrack = (t: Track) => {
    setTrack(t);
    setI(0);
    setDone(false);
  };

  const next = () => {
    if (i + 1 >= deck.length) setDone(true);
    else setI(i + 1);
  };
  const prev = () => setI((v) => Math.max(0, v - 1));

  const progress = track ? ((done ? deck.length : i) / deck.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-cream font-body text-ink antialiased selection:bg-primary/20">
      <header className="sticky top-0 z-30 border-b border-border bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
          <button className="flex items-center gap-2" onClick={() => setTrack(null)}>
            <span className="flex size-8 items-center justify-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground">
              C
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Cardstack</span>
          </button>
          <span className="rounded-full bg-sun/40 px-3 py-1 font-mono text-[11px] font-medium text-foreground/70">
            {CARDS.length} cards
          </span>
        </div>
        <div className="h-1 w-full bg-secondary">
          <div
            className="h-full rounded-r-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 pb-16">
        {!track && (
          <section className="pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              (a) deck
            </p>
            <h1 className="rise-in mt-2 max-w-[34ch] font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance">
              Pick a deck.
              <br />
              Start flicking.
            </h1>
            <p className="rise-in mt-3 max-w-[36ch] text-[15px] leading-relaxed text-foreground/55 text-pretty [animation-delay:60ms]">
              70 bite-size SDE questions across four tracks. Tap to flip, swipe to move on, and
              finish the whole stack.
            </p>

            <div className="mt-7 space-y-3">
              {TRACKS.map((t, idx) => {
                const count = CARDS.filter((c) => c.track === t.id).length;
                return (
                  <button
                    key={t.id}
                    onClick={() => startTrack(t.id)}
                    style={{ animationDelay: `${120 + idx * 60}ms` }}
                    className="rise-in flex w-full items-center gap-4 rounded-3xl bg-card p-4 text-left ring-1 ring-border transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <span
                      className={`flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl ${t.tone}`}
                    >
                      <span className="font-display text-xl font-bold">{count}</span>
                      <span className="text-[10px] font-semibold text-foreground/40">cards</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-semibold">{t.name}</span>
                      <span className="mt-0.5 block truncate text-[13px] text-foreground/45">
                        {t.blurb}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">start</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {track && !done && (
          <section className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              (b) study mode
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-balance">
              {activeTrack?.name}
            </h2>

            <div className="mt-5 rounded-[28px] bg-gradient-to-b from-primary-soft/40 to-cream p-5 ring-1 ring-border">
              <Flashcard
                key={deck[i]!.id}
                card={deck[i]!}
                index={i}
                total={deck.length}
                trackLabel={activeTrack?.name ?? ""}
                onNext={next}
                onPrev={prev}
              />

              <div className="mt-5 flex items-center justify-between px-1">
                <button
                  onClick={prev}
                  disabled={i === 0}
                  className="font-mono text-[11px] text-muted-foreground disabled:opacity-40"
                >
                  ← previous
                </button>
                <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-mint" />
                  tap to flip
                </span>
                <button onClick={next} className="font-mono text-[11px] text-primary">
                  next →
                </button>
              </div>
            </div>
          </section>
        )}

        {track && done && (
          <section className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              (c) deck complete
            </p>
            <div className="pop-in mt-5 rounded-[28px] bg-card p-7 text-center ring-1 ring-border">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-mint/40">
                <span className="font-display text-3xl font-bold">✓</span>
              </span>
              <h3 className="mt-5 font-display text-3xl font-bold tracking-tight text-balance">
                Deck cleared.
              </h3>
              <p className="mx-auto mt-2 max-w-[30ch] text-[15px] leading-relaxed text-foreground/55 text-pretty">
                All {deck.length} {activeTrack?.name} cards done. Say the answers out loud once more
                before the round.
              </p>
              <button
                onClick={() => {
                  setI(0);
                  setDone(false);
                }}
                className="mt-7 w-full rounded-2xl bg-primary py-3.5 font-display text-base font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                Review again
              </button>
              <button
                onClick={() => setTrack(null)}
                className="mt-2.5 w-full rounded-2xl py-3 text-sm font-medium text-foreground/50"
              >
                Back to decks
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
