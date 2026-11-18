import React from 'react';
import { STACK_TOOLS } from '../data/resume';

export default function StackMarquee() {
  const repeatedTools = [...STACK_TOOLS, ...STACK_TOOLS];

  return (
    <section id="stack" className="border-t border-zinc-900 bg-[#09090b] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              data-build="type"
              data-build-label="kicker · type"
              className="font-mono text-xs tracking-wider text-[#ff3b2f] uppercase"
            >
              Technical Stack
            </p>
            <h2
              data-build="wipe"
              data-build-label="heading · wipe"
              className="mt-2 font-anton text-4xl tracking-tight text-white uppercase sm:text-5xl"
            >
              Tools from the workflow
            </h2>
          </div>
          <p
            data-build="type"
            data-build-label="hint · type"
            className="font-mono text-xs text-zinc-400"
          >
            Hover stream to pause · Moving left to right
          </p>
        </div>
      </div>

      {/* Endless Marquee moving left to right, faded edges, pauses on hover */}
      <div
        data-build="pop"
        data-build-label="marquee · pop"
        className="marquee-group marquee-mask mt-10 overflow-hidden border-y border-zinc-800 bg-zinc-950/70 py-7"
      >
        <div className="marquee-track">
          {repeatedTools.map((tool, index) => (
            <div
              key={`${tool}-${index}`}
              className="flex items-center gap-6 px-4 sm:gap-8 sm:px-6"
            >
              <span className="font-anton text-2xl tracking-wide text-zinc-100 uppercase whitespace-nowrap transition-colors hover:text-[#ff3b2f] sm:text-3xl">
                {tool}
              </span>
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 bg-[#ff3b2f]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
