"use client";

import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "../../domain/types";

export default function ChatPanel({
  messages,
  selfId,
  onSend,
}: {
  messages: ChatMessage[];
  selfId: string;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const submit = () => {
    const clean = text.trim();

    if (!clean) return;

    onSend(clean);
    setText("");
  };

  return (
    <div className="relative">
      {/* Offset blue paper behind the card */}
      <div className="absolute -right-1.5 -top-1.5 h-full w-full rotate-[1deg] border-2 border-[#17151a] bg-[#5c8dff]" />

      {/* Main card */}
      <div className="relative flex flex-col border-2 border-[#17151a] bg-[#fffdf8] p-4 shadow-[5px_5px_0_#17151a] sm:p-5">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-sm uppercase tracking-[0.16em] text-[#17151a]">
              Room chat
            </h2>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#817a82]">
              Talk. Accuse. Bluff.
            </p>
          </div>

          {/* Chat label */}
          <div className="rotate-2 border-2 border-[#17151a] bg-[#ef6b73] px-2 py-1 font-display text-[9px] uppercase tracking-[0.12em] shadow-[2px_2px_0_#17151a]">
            LIVE
          </div>
        </div>

        {/* Divider */}
        <div className="mb-3 border-t-2 border-dashed border-[#d8d2c9]" />

        {/* Messages */}
        <div
          ref={listRef}
          className="
            min-h-[150px]
            max-h-[240px]
            space-y-2
            overflow-y-auto
            pr-1
            sm:min-h-[170px]
            sm:max-h-[260px]
          "
        >
          {messages.length === 0 ? (
            <div className="flex min-h-[145px] items-center justify-center text-center">
              <div>
                <p className="font-display text-xs uppercase tracking-[0.12em] text-[#817a82]">
                  Nothing here yet
                </p>

                <p className="mt-1 text-[10px] text-[#aaa3aa]">
                  Start the investigation...
                </p>
              </div>
            </div>
          ) : (
            messages.map((m, index) => {
              const isSelf = m.playerId === selfId;

              return (
                <div
                  key={m.id}
                  className={`flex ${
                    isSelf ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[88%]
                      border-2
                      border-[#17151a]
                      px-3
                      py-2
                      shadow-[2px_2px_0_#17151a]
                      ${
                        isSelf
                          ? "bg-[#f7c948]"
                          : "bg-[#f4efe4]"
                      }
                      ${
                        index % 3 === 0
                          ? "rotate-[-0.5deg]"
                          : index % 3 === 1
                          ? "rotate-[0.5deg]"
                          : ""
                      }
                    `}
                  >
                    <div className="mb-0.5 flex items-baseline gap-1.5">
                      <span
                        className={`truncate font-display text-[10px] uppercase tracking-[0.08em] ${
                          isSelf
                            ? "text-[#17151a]"
                            : "text-[#5c8dff]"
                        }`}
                      >
                        {m.playerName}
                      </span>

                      {isSelf && (
                        <span className="text-[8px] font-bold uppercase text-[#817a82]">
                          you
                        </span>
                      )}
                    </div>

                    <p className="break-words text-xs font-medium leading-relaxed text-[#3f3a40] sm:text-sm">
                      {m.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input area */}
        <div className="mt-4 border-t-2 border-dashed border-[#d8d2c9] pt-3">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              maxLength={200}
              placeholder="Say something..."
              className="
                min-w-0
                flex-1
                border-2
                border-[#17151a]
                bg-[#f4efe4]
                px-3
                py-2.5
                text-xs
                font-semibold
                text-[#17151a]
                outline-none
                placeholder:text-[#aaa3aa]
                focus:bg-white
                focus:ring-4
                focus:ring-[#f7c948]/30
                sm:text-sm
              "
            />

            <button
              type="button"
              onClick={submit}
              disabled={!text.trim()}
              className="
                shrink-0
                border-2
                border-[#17151a]
                bg-[#f7c948]
                px-3
                font-display
                text-[10px]
                uppercase
                tracking-[0.1em]
                shadow-[3px_3px_0_#17151a]
                transition-all
                hover:bg-[#ffd65e]
                active:translate-x-[2px]
                active:translate-y-[2px]
                active:shadow-[1px_1px_0_#17151a]
                disabled:cursor-not-allowed
                disabled:opacity-40
                sm:px-4
                sm:text-xs
              "
            >
              Send →
            </button>
          </div>

          {/* Character counter */}
          <div className="mt-1.5 text-right text-[9px] font-semibold text-[#aaa3aa]">
            {text.length}/200
          </div>
        </div>
      </div>
    </div>
  );
}