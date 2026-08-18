"use client";

export default function WordCard({
  text,
  isFatah,
}: {
  text: string;
  isFatah: boolean;
}) {
  return (
    <div className="relative">

      {/* Offset backing */}
      <div
        className={`
          absolute
          -right-1
          -top-1
          h-full
          w-full
          rotate-1
          border-2
          border-[#17151a]
          ${
            isFatah
              ? "bg-[#ef6b73]"
              : "bg-[#f7c948]"
          }
        `}
      />

      {/* Main card */}
      <div className="relative border-2 border-[#17151a] bg-[#fffdf8] p-5 text-center shadow-[5px_5px_0_#17151a] sm:p-7">

        {/* Top label */}
        <div className="mb-5 flex items-center justify-center gap-2">

          <span
            className={`
              rotate-[-2deg]
              border-2
              border-[#17151a]
              px-3
              py-1.5
              font-display
              text-[10px]
              uppercase
              tracking-[0.16em]
              shadow-[2px_2px_0_#17151a]
              ${
                isFatah
                  ? "bg-[#ef6b73]"
                  : "bg-[#f7c948]"
              }
            `}
          >
            {isFatah
              ? "Secret role"
              : "Your word"}
          </span>

        </div>

        {/* Main heading */}
        <p className="font-display text-[11px] uppercase tracking-[0.22em] text-[#817a82]">
          {isFatah
            ? "You are Fatah"
            : "Your secret word"}
        </p>

        {/* Word */}
        <div className="mt-3 font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          {text}
        </div>

        {/* Fatah explanation */}
        {isFatah && (
          <div className="mx-auto mt-5 max-w-md border-2 border-[#17151a] bg-[#ffe0df] p-3 text-left">

            <p className="font-display text-[10px] uppercase tracking-[0.14em]">
              Your mission
            </p>

            <p className="mt-1 text-xs font-semibold leading-relaxed text-[#625c63]">
              You don&apos;t know the real word. Blend in and give clues
              that could plausibly fit.
            </p>

          </div>
        )}

        {/* Normal player hint */}
        {!isFatah && (
          <p className="mx-auto mt-4 max-w-md text-xs font-semibold leading-relaxed text-[#817a82]">
            Give a clue that helps the group identify the word without
            making it too obvious.
          </p>
        )}

      </div>
    </div>
  );
}