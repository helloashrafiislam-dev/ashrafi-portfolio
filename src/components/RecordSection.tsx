import React, { useEffect, useState } from 'react';
import { RECORD_TIMELINE, RecordEntry } from '../data/resume';

type FilterOption = 'All' | RecordEntry['category'];

const FILTER_OPTIONS: FilterOption[] = [
  'All',
  'Experience',
  'Education',
  'Competitions & Workshops',
];

export default function RecordSection() {
  const [filter, setFilter] = useState<FilterOption>('All');

  const entries =
    filter === 'All'
      ? RECORD_TIMELINE
      : RECORD_TIMELINE.filter((item) => item.category === filter);

  useEffect(() => {
    // Ensure dynamically filtered items inside an already-viewed section are visible immediately
    const container = document.getElementById('record-timeline-list');
    if (container) {
      const nodes = container.querySelectorAll<HTMLElement>('[data-build]');
      nodes.forEach((node) => {
        if (filter !== 'All') {
          node.dataset.built = 'true';
        }
      });
    }
    window.dispatchEvent(new CustomEvent('portfolio:dom-refresh'));
  }, [filter]);

  return (
    <section id="record" className="border-t border-zinc-900 bg-[#09090b] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col gap-6 border-b border-zinc-800 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              data-build="type"
              data-build-label="kicker · type"
              className="font-mono text-xs tracking-wider text-[#ff3b2f] uppercase"
            >
              Experience, Competitions &amp; Education
            </p>
            <h2
              data-build="wipe"
              data-build-label="heading · wipe"
              className="mt-2 font-anton text-4xl tracking-tight text-white uppercase sm:text-6xl"
            >
              Record
            </h2>
          </div>

          {/* Interactive Filter Controls */}
          <div
            role="tablist"
            aria-label="Filter timeline records"
            data-build="pop"
            data-build-label="filters · pop"
            className="flex flex-wrap gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-1"
          >
            {FILTER_OPTIONS.map((option) => {
              const active = filter === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(option)}
                  className={`h-9 rounded-md px-3 font-mono text-xs whitespace-nowrap shrink-0 transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f] ${
                    active
                      ? 'bg-[#ff3b2f] font-medium text-white'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Vertical Timeline */}
        <div id="record-timeline-list" className="mt-12 divide-y divide-zinc-800/80">
          {entries.map((entry, idx) => (
            <div
              key={entry.id}
              data-build="pop"
              data-build-label={`record.${idx + 1} · pop`}
              className="grid grid-cols-1 gap-4 py-7 md:grid-cols-12 md:gap-8"
            >
              <div className="md:col-span-4 space-y-1.5">
                <p className="font-mono text-xs font-medium text-[#ff3b2f] tabular-nums">
                  {entry.period}
                </p>
                <p className="font-mono text-xs text-zinc-400">
                  {entry.category}
                </p>
              </div>

              <div className="md:col-span-8">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="text-lg font-semibold text-white sm:text-xl">
                    {entry.title}
                  </h3>
                  <span className="font-mono text-xs text-zinc-400">
                    {entry.organization}
                  </span>
                </div>

                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-300">
                  {entry.highlights.map((item, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 bg-zinc-500"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
