import React from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { PROJECTS, RESUME_PROFILE, WORK_STATS } from '../data/resume';

export default function WorkSection() {
  return (
    <section id="work" className="border-t border-zinc-900 bg-[#09090b] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Header: Heading + Short Line on Left, 3 Stats on Right */}
        <div className="grid grid-cols-1 gap-10 border-b border-zinc-800 pb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6 space-y-4">
            <p
              data-build="type"
              data-build-label="kicker · type"
              className="font-mono text-xs tracking-wider text-[#ff3b2f] uppercase"
            >
              Selected Projects
            </p>
            <h2
              data-build="wipe"
              data-build-label="heading · wipe"
              className="font-anton text-4xl tracking-tight text-white uppercase sm:text-6xl text-balance"
            >
              Work that ships
            </h2>
            <p
              data-build="type"
              data-build-label="summary · type"
              className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base"
            >
              Client websites, multi-page platforms, and live production debugging built
              with Next.js, React, and Tailwind CSS.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {WORK_STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  data-build="pop"
                  data-build-label={`metric.${idx + 1} · pop`}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                >
                  <div className="font-anton text-3xl text-white tabular-nums">
                    {stat.value}
                  </div>
                  <div className="mt-1 font-mono text-xs font-medium text-[#ff3b2f]">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Text Cards Grid (No Screenshots) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <article
              key={project.id}
              data-build="pop"
              data-build-label={`project.${index + 1} · pop`}
              className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-6 transition-colors hover:border-zinc-700 sm:p-7"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-zinc-400">
                      0{index + 1} · {project.category}
                    </p>
                    <h3 className="mt-1.5 font-anton text-2xl tracking-tight text-white uppercase sm:text-3xl">
                      {project.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-zinc-500 shrink-0">
                    {project.displayUrl}
                  </span>
                </div>

                {/* 3 to 4 concise bullet points */}
                <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-zinc-300">
                  {project.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#ff3b2f]"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Chips + Live / Code Links */}
              <div className="mt-6 border-t border-zinc-800/80 pt-5">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((chip) => (
                    <span
                      key={chip}
                      className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-300 whitespace-nowrap"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[#ff3b2f] px-4 font-mono text-xs font-medium text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#e02d22] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span>Live Site</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>

                  <a
                    href={`mailto:${RESUME_PROFILE.email}?subject=${encodeURIComponent(
                      `Code / Project Inquiry — ${project.title}`
                    )}`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-4 font-mono text-xs font-medium text-zinc-200 whitespace-nowrap shrink-0 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f]"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Request Code</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
