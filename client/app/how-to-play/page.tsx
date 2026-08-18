"use client";

import Link from "next/link";

export default function HowToPlayPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4efe4] text-[#17151a]">

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-24 top-32 h-64 w-64 rounded-full bg-[#f7c948] opacity-20" />

        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#ef6b73] opacity-15" />

        <div className="absolute bottom-[-100px] left-[35%] h-72 w-72 rounded-full bg-[#5c8dff] opacity-10" />

        <div className="absolute left-[8%] top-[18%] rotate-12 font-display text-5xl text-[#ef6b73]">
          ✦
        </div>

        <div className="absolute right-[8%] top-[40%] rotate-12 font-display text-7xl text-[#5c8dff] opacity-40">
          ?
        </div>

        <div className="absolute bottom-[15%] right-[12%] rotate-[-8deg] font-display text-4xl text-[#f7c948]">
          +
        </div>

      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10">

        <Link href="/" className="group">
          <img
            src="/logo.png"
            alt="Sojho or Fatah"
            className="h-16 w-auto object-contain transition-transform group-hover:rotate-[-2deg] sm:h-20"
          />
        </Link>

        <Link
          href="/"
          className="
            border-2
            border-[#17151a]
            bg-[#fffdf8]
            px-4
            py-2
            font-display
            text-[10px]
            uppercase
            tracking-[0.14em]
            shadow-[3px_3px_0_#17151a]
            transition-all
            hover:bg-[#f7c948]
            active:translate-x-[2px]
            active:translate-y-[2px]
            active:shadow-[1px_1px_0_#17151a]
            sm:px-5
            sm:py-2.5
            sm:text-xs
          "
        >
          ← Back
        </Link>

      </header>

      {/* Main */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-16 pt-5 sm:px-8 sm:pt-8">

        {/* Hero */}
        <section className="mb-10 text-center">

          <div className="mb-5 inline-block rotate-[-2deg] border-2 border-[#17151a] bg-[#f7c948] px-4 py-2 shadow-[4px_4px_0_#17151a]">
            <span className="font-display text-[10px] uppercase tracking-[0.16em]">
              Before you start...
            </span>
          </div>

          <h1 className="font-display text-5xl uppercase leading-none tracking-[-0.03em] sm:text-7xl">
            How to
            <span className="relative ml-3 inline-block text-[#5c8dff]">
              Play
              <span className="absolute -bottom-1 left-0 h-2 w-full rotate-[-2deg] bg-[#ef6b73]" />
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-semibold leading-relaxed text-[#625c63] sm:text-base">
            Everyone gets the same word.
            <br />
            <span className="font-bold text-[#17151a]">
              Except Fatah.
            </span>
            {" "}They have to fake their way through the round without
            getting caught.
          </p>

        </section>

        {/* Quick rules */}
        <section className="mb-10 grid gap-4 sm:grid-cols-3">

          <RuleCard
            number="01"
            color="bg-[#f7c948]"
            title="Get your word"
            text="Most players see the secret word. One unlucky player gets only a hint."
          />

          <RuleCard
            number="02"
            color="bg-[#dfe8ff]"
            title="Give clues"
            text="Everyone gives a short clue. Be useful, but don't make the answer obvious."
          />

          <RuleCard
            number="03"
            color="bg-[#ffe0df]"
            title="Find Fatah"
            text="Listen carefully, spot the suspicious clue, then vote for who you think is Fatah."
          />

        </section>

        {/* Game flow */}
        <section className="mb-10">

          <SectionHeading
            number="01"
            label="The game"
            title="Here's how a round works"
            color="bg-[#5c8dff]"
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <StepCard
              number="1"
              title="Join the room"
              text="Create a room or enter a friend's room code. You need at least 3 players."
              color="bg-[#f7c948]"
            />

            <StepCard
              number="2"
              title="Get your secret"
              text="The game privately tells you what you need to know. Most players receive the same word. Fatah gets a hint instead."
              color="bg-[#dfe8ff]"
            />

            <StepCard
              number="3"
              title="Drop a clue"
              text="Give one clue that connects to the word. Don't say the word itself and don't make it painfully obvious."
              color="bg-[#ffe0df]"
            />

            <StepCard
              number="4"
              title="Watch everyone"
              text="Read the clues. Who sounds like they know exactly what the word is? Who is trying a little too hard to blend in?"
              color="bg-[#f7c948]"
            />

            <StepCard
              number="5"
              title="Vote"
              text="Choose the player you think is Fatah. Once you vote, your choice is locked."
              color="bg-[#dfe8ff]"
            />

            <StepCard
              number="6"
              title="Reveal"
              text="The votes are counted and Fatah is revealed. Then the next round begins."
              color="bg-[#ffe0df]"
            />

          </div>

        </section>

        {/* Roles */}
        <section className="mb-10">

          <SectionHeading
            number="02"
            label="Know your role"
            title="Are you Sojho or Fatah?"
            color="bg-[#ef6b73]"
          />

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            {/* Sojho */}
            <div className="border-2 border-[#17151a] bg-[#fffdf8] p-5 shadow-[5px_5px_0_#17151a] sm:p-6">

              <div className="mb-5 flex items-center justify-between">

                <div className="rotate-[-2deg] border-2 border-[#17151a] bg-[#f7c948] px-3 py-1.5 font-display text-xs uppercase tracking-[0.12em] shadow-[2px_2px_0_#17151a]">
                  SOJHO
                </div>

                <span className="font-display text-2xl">
                  👀
                </span>

              </div>

              <h3 className="font-display text-2xl uppercase">
                You know the word.
              </h3>

              <p className="mt-3 text-sm font-semibold leading-relaxed text-[#625c63]">
                Your job is to give a clue that proves you know the answer
                without handing it directly to Fatah.
              </p>

              <ul className="mt-5 space-y-2 text-sm font-semibold">

                <Tip text="Give a clue related to the word." />

                <Tip text="Pay attention to everyone else's clues." />

                <Tip text="Look for someone being vague or suspicious." />

                <Tip text="Don't make your own clue too obvious." />

              </ul>

            </div>

            {/* Fatah */}
            <div className="border-2 border-[#17151a] bg-[#fffdf8] p-5 shadow-[5px_5px_0_#17151a] sm:p-6">

              <div className="mb-5 flex items-center justify-between">

                <div className="rotate-[2deg] border-2 border-[#17151a] bg-[#ef6b73] px-3 py-1.5 font-display text-xs uppercase tracking-[0.12em] shadow-[2px_2px_0_#17151a]">
                  FATAH
                </div>

                <span className="font-display text-2xl">
                  🫣
                </span>

              </div>

              <h3 className="font-display text-2xl uppercase">
                You don't know the word.
              </h3>

              <p className="mt-3 text-sm font-semibold leading-relaxed text-[#625c63]">
                You only get a hint. Your mission is to figure out the word
                from everyone else's clues while pretending you already know it.
              </p>

              <ul className="mt-5 space-y-2 text-sm font-semibold">

                <Tip text="Listen to the clues before revealing too much." />

                <Tip text="Give clues that could fit multiple possibilities." />

                <Tip text="Try to sound confident." />

                <Tip text="Don't get caught." />

              </ul>

            </div>

          </div>

        </section>

        {/* Clue rules */}
        <section className="mb-10">

          <SectionHeading
            number="03"
            label="Clue etiquette"
            title="Don't make it too easy"
            color="bg-[#f7c948]"
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <Advice
              good
              title="Good clue"
              example='"Freezing"'
              text="If the word is snow, this gives something away without directly saying it."
            />

            <Advice
              title="Bad clue"
              example='"White stuff that falls from the sky"'
              text="Way too obvious. Fatah gets the answer for free."
            />

            <Advice
              good
              title="Good strategy"
              example='"Think sideways"'
              text="Use clues that make sense to people who know the word."
            />

            <Advice
              title="Bad strategy"
              example='"I have absolutely no idea"'
              text="Being deliberately useless makes you look suspicious."
            />

          </div>

        </section>

        {/* Timing */}
        <section className="mb-10">

          <SectionHeading
            number="04"
            label="Keep moving"
            title="The clock is watching"
            color="bg-[#dfe8ff]"
          />

          <div className="mt-5 border-2 border-[#17151a] bg-[#fffdf8] p-5 shadow-[5px_5px_0_#17151a] sm:p-7">

            <div className="grid gap-5 sm:grid-cols-2">

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 shrink-0 rotate-[-3deg] items-center justify-center border-2 border-[#17151a] bg-[#f7c948] font-display text-xl shadow-[3px_3px_0_#17151a]">
                  15s
                </div>

                <div>
                  <p className="font-display text-sm uppercase tracking-[0.1em]">
                    Clue time
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#817a82]">
                    Think fast and submit your clue before time runs out.
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 shrink-0 rotate-[2deg] items-center justify-center border-2 border-[#17151a] bg-[#ef6b73] font-display text-xl shadow-[3px_3px_0_#17151a]">
                  45s
                </div>

                <div>
                  <p className="font-display text-sm uppercase tracking-[0.1em]">
                    Vote time
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#817a82]">
                    Decide who looks the most suspicious.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* Final tip */}
        <section className="relative mx-auto max-w-2xl">

          <div className="absolute -right-1 -top-1 h-full w-full rotate-2 border-2 border-[#17151a] bg-[#5c8dff]" />

          <div className="relative border-2 border-[#17151a] bg-[#fffdf8] p-6 text-center shadow-[5px_5px_0_#17151a] sm:p-8">

            <div className="mx-auto mb-4 inline-block rotate-[-2deg] border-2 border-[#17151a] bg-[#f7c948] px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.15em] shadow-[2px_2px_0_#17151a]">
              One last thing
            </div>

            <h2 className="font-display text-3xl uppercase sm:text-4xl">
              Trust nobody.
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-relaxed text-[#625c63]">
              Fatah is counting on you to make the wrong accusation.
              So listen carefully, think sideways, and don't reveal too much.
            </p>

            <Link
              href="/"
              className="
                mt-6
                inline-block
                border-2
                border-[#17151a]
                bg-[#f7c948]
                px-6
                py-3
                font-display
                text-xs
                uppercase
                tracking-[0.14em]
                shadow-[4px_4px_0_#17151a]
                transition-all
                hover:bg-[#ffd65e]
                active:translate-x-[3px]
                active:translate-y-[3px]
                active:shadow-[1px_1px_0_#17151a]
              "
            >
              Got it → Play
            </Link>

          </div>

        </section>

      </div>

      {/* Footer */}
      <footer className="relative z-10 px-5 pb-6 text-center">

        <p className="font-display text-[9px] uppercase tracking-[0.25em] text-[#9b949b]">
          Think carefully · Trust nobody
        </p>

      </footer>

    </main>
  );
}


/* -------------------------------- */
/* Small components                 */
/* -------------------------------- */

function RuleCard({
  number,
  color,
  title,
  text,
}: {
  number: string;
  color: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border-2 border-[#17151a] bg-[#fffdf8] p-4 shadow-[4px_4px_0_#17151a]">

      <div
        className={`mb-4 inline-flex h-8 w-8 rotate-[-3deg] items-center justify-center border-2 border-[#17151a] ${color} font-display text-[10px] shadow-[2px_2px_0_#17151a]`}
      >
        {number}
      </div>

      <h3 className="font-display text-base uppercase">
        {title}
      </h3>

      <p className="mt-2 text-xs font-semibold leading-relaxed text-[#817a82]">
        {text}
      </p>

    </div>
  );
}


function SectionHeading({
  number,
  label,
  title,
  color,
}: {
  number: string;
  label: string;
  title: string;
  color: string;
}) {
  return (
    <div className="flex items-end gap-3 border-b-2 border-[#17151a] pb-3">

      <div
        className={`flex h-10 w-10 shrink-0 rotate-[-3deg] items-center justify-center border-2 border-[#17151a] ${color} font-display text-xs shadow-[3px_3px_0_#17151a]`}
      >
        {number}
      </div>

      <div>
        <p className="font-display text-[9px] uppercase tracking-[0.2em] text-[#817a82]">
          {label}
        </p>

        <h2 className="font-display text-2xl uppercase leading-none sm:text-3xl">
          {title}
        </h2>
      </div>

    </div>
  );
}


function StepCard({
  number,
  title,
  text,
  color,
}: {
  number: string;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <div className="group border-2 border-[#17151a] bg-[#fffdf8] p-4 shadow-[4px_4px_0_#17151a] transition-transform hover:-translate-y-0.5 sm:p-5">

      <div className="flex gap-4">

        <div
          className={`flex h-9 w-9 shrink-0 rotate-[-2deg] items-center justify-center border-2 border-[#17151a] ${color} font-display text-xs shadow-[2px_2px_0_#17151a]`}
        >
          {number}
        </div>

        <div>

          <h3 className="font-display text-base uppercase">
            {title}
          </h3>

          <p className="mt-1.5 text-xs font-semibold leading-relaxed text-[#817a82]">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}


function Tip({ text }: { text: string }) {
  return (
    <li className="flex gap-2">

      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-[#17151a] bg-[#f7c948] font-display text-[9px]">
        ✓
      </span>

      <span className="text-xs leading-relaxed">
        {text}
      </span>

    </li>
  );
}


function Advice({
  good,
  title,
  example,
  text,
}: {
  good?: boolean;
  title: string;
  example: string;
  text: string;
}) {
  return (
    <div className="border-2 border-[#17151a] bg-[#fffdf8] p-4 shadow-[3px_3px_0_#17151a]">

      <div className="flex items-center justify-between gap-3">

        <p className="font-display text-[10px] uppercase tracking-[0.15em]">
          {title}
        </p>

        <span
          className={`border-2 border-[#17151a] px-2 py-1 font-display text-[9px] uppercase ${
            good ? "bg-[#f7c948]" : "bg-[#ef6b73]"
          }`}
        >
          {good ? "✓ Works" : "✕ Too much"}
        </span>

      </div>

      <div className="mt-3 border-l-4 border-[#17151a] bg-[#f4efe4] px-3 py-2">

        <p className="font-display text-sm">
          {example}
        </p>

      </div>

      <p className="mt-3 text-xs font-semibold leading-relaxed text-[#817a82]">
        {text}
      </p>

    </div>
  );
}