import React from 'react';
import { PRINCIPLES, RESUME_PROFILE, SKILL_GROUPS } from '../data/resume';

export default function AboutSection() {
  return (
    <section id="about" className="border-t border-zinc-900 bg-[#09090b] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Top Row: Heading + 2 Short Paragraphs */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p
              data-build="type"
              data-build-label="kicker · type"
              className="font-mono text-xs tracking-wider text-[#ff3b2f] uppercase"
            >
              Background &amp; Craft
            </p>
            <h2
              data-build="wipe"
              data-build-label="heading · wipe"
              className="mt-2 font-anton text-4xl tracking-tight text-white uppercase sm:text-6xl text-balance"
            >
              About me
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-5 text-base leading-relaxed text-zinc-300">
            {RESUME_PROFILE.aboutParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                data-build="type"
                data-build-label={`about.p${idx + 1} · type`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="mt-16 border-t border-zinc-800 pt-14">
          <div className="flex items-baseline justify-between gap-4">
            <h3
              data-build="wipe"
              data-build-label="skills · wipe"
              className="font-anton text-2xl tracking-tight text-white uppercase sm:text-3xl"
            >
              Skills &amp; Languages
            </h3>
            <span className="font-mono text-xs text-zinc-500">
              From technical &amp; core profile
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_GROUPS.map((group, idx) => (
              <div
                key={group.category}
                data-build="pop"
                data-build-label={`skill.${idx + 1} · pop`}
                className="rounded-lg border border-zinc-800 bg-zinc-950 p-5"
              >
                <h4 className="font-mono text-xs font-medium text-[#ff3b2f] uppercase">
                  {group.category}
                </h4>
                <ul className="mt-3.5 space-y-2 text-sm text-zinc-300">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 bg-zinc-600"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Principles I Work By */}
        <div className="mt-16 border-t border-zinc-800 pt-14">
          <h3
            data-build="wipe"
            data-build-label="principles · wipe"
            className="font-anton text-2xl tracking-tight text-white uppercase sm:text-3xl"
          >
            4 Principles I work by
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((principle, idx) => (
              <div
                key={principle.number}
                data-build="pop"
                data-build-label={`principle.${idx + 1} · pop`}
                className="rounded-lg border border-zinc-800 bg-zinc-950 p-5"
              >
                <span className="font-mono text-xs font-medium text-[#ff3b2f] tabular-nums">
                  {principle.number}
                </span>
                <h4 className="mt-2.5 text-base font-semibold text-white">
                  {principle.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
