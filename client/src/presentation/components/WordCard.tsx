"use client";

export default function WordCard({
  text,
  isFatah,
}: {
  text: string;
  isFatah: boolean;
}) {
  return (
    <div
      className={`case-card p-4 sm:p-5 text-center border-2 ${
        isFatah ? "border-alarm" : "border-lamp"
      }`}
    >
      <div
        className={`font-display text-[11px] tracking-[0.25em] uppercase mb-2 ${
          isFatah ? "text-alarm" : "text-lamp"
        }`}
      >
        {isFatah ? "You are Fatah — hint only" : "Your word"}
      </div>
      <div className="font-display text-2xl sm:text-3xl font-bold tracking-wide">
        {text}
      </div>
      {isFatah && (
        <p className="mt-2 text-xs text-paper-dim">
          You don&apos;t know the real word. Blend in — type clues that could plausibly fit.
        </p>
      )}
    </div>
  );
}
