import React, { useState } from 'react';
import { ArrowDownRight, MapPin } from 'lucide-react';
import { HERO_STATS, RESUME_PROFILE } from '../data/resume';

export default function Hero() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-between overflow-hidden bg-[#09090b] pt-8 pb-20 sm:pt-10 lg:pb-16"
    >
      {/* Giant PORTFOLIO Backdrop in Anton with metallic red-to-black gradient + sweeping light sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-6 z-0 flex justify-center overflow-hidden select-none sm:top-4 lg:top-2"
      >
        <div
          data-build="wipe"
          data-hero-build="true"
          data-build-label="backdrop · wipe"
          className="relative inline-block"
        >
          <span className="portfolio-metallic block font-anton text-[clamp(4.8rem,20.5vw,17.5rem)] leading-[0.86] tracking-[-0.02em] uppercase">
            PORTFOLIO
          </span>
          <span
            aria-hidden="true"
            className="portfolio-sheen pointer-events-none absolute inset-0 block font-anton text-[clamp(4.8rem,20.5vw,17.5rem)] leading-[0.86] tracking-[-0.02em] uppercase"
          >
            PORTFOLIO
          </span>
        </div>
      </div>

      {/* Centered Black & White Headshot on Soft Red Radial Glow */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 sm:px-8">
        <div className="pointer-events-none relative mx-auto mt-14 mb-6 flex w-full max-w-[300px] items-end justify-center sm:max-w-[360px] lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:mb-0 lg:max-w-none">
          <div className="relative flex w-full items-end justify-center lg:w-[430px] xl:w-[470px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[85%] lg:bottom-4 lg:h-[82%]"
              style={{
                background:
                  'radial-gradient(circle at 50% 62%, rgba(255, 59, 47, 0.36) 0%, rgba(255, 59, 47, 0.12) 44%, transparent 72%)',
              }}
            />
            <div
              data-build="pop"
              data-hero-build="true"
              data-build-label="portrait · pop"
              className="relative z-10 w-full"
            >
              {!imgError ? (
                <img
                  src={RESUME_PROFILE.headshotSrc}
                  alt="Ashrafi Islam"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="headshot-fade-mask mx-auto h-[300px] w-auto object-contain object-bottom grayscale contrast-125 brightness-95 sm:h-[360px] lg:h-[470px] xl:h-[520px]"
                />
              ) : (
                <div className="headshot-fade-mask mx-auto flex h-[300px] w-[260px] items-center justify-center border border-zinc-800 bg-zinc-900 font-anton text-4xl text-zinc-500 lg:h-[470px] lg:w-[360px] lg:text-5xl">
                  AI
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Foreground Left + Right Content */}
        <div className="relative z-20 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-8 lg:pt-44">
          {/* Left Column: Handwritten intro, Huge Name, Red Role, 2-line Bio, View Work CTA, City */}
          <div className="lg:col-span-5 space-y-4">
            <p
              data-build="type"
              data-hero-build="true"
              data-build-label="intro · type"
              className="font-brush text-3xl text-zinc-200 sm:text-4xl"
            >
              Hello, I&apos;m
            </p>

            <h1
              data-build="wipe"
              data-hero-build="true"
              data-build-label="h1 · wipe"
              className="font-anton text-5xl leading-[0.92] tracking-tight text-white uppercase sm:text-7xl xl:text-[5.25rem]"
            >
              {RESUME_PROFILE.name}
            </h1>

            <p
              data-build="type"
              data-hero-build="true"
              data-build-label="role · type"
              className="font-mono text-sm font-medium tracking-wide text-[#ff3b2f] sm:text-base"
            >
              {RESUME_PROFILE.role}
            </p>

            <p
              data-build="type"
              data-hero-build="true"
              data-build-label="bio · type"
              className="max-w-md text-sm leading-relaxed text-zinc-300 sm:text-base"
            >
              {RESUME_PROFILE.heroBio}
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <a
                href="#work"
                data-build="pop"
                data-hero-build="true"
                data-build-label="cta · pop"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-[#ff3b2f] px-6 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#e02d22] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>View work</span>
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <div
                data-build="type"
                data-hero-build="true"
                data-build-label="city · type"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400"
              >
                <MapPin className="h-3.5 w-3.5 text-[#ff3b2f]" aria-hidden="true" />
                <span>Based in {RESUME_PROFILE.city}</span>
              </div>
            </div>
          </div>

          {/* Center Spacer over Headshot on Desktop */}
          <div className="hidden lg:block lg:col-span-4" aria-hidden="true" />

          {/* Right Column: 3 Real Stats from Resume */}
          <div className="lg:col-span-3">
            <div className="divide-y divide-zinc-800 border-y border-zinc-800 bg-[#09090b]/85 lg:bg-[#09090b]/75">
              {HERO_STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  data-build="pop"
                  data-hero-build="true"
                  data-build-label={`stat.${idx + 1} · pop`}
                  className="py-4 first:pt-3 last:pb-3 lg:px-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-anton text-3xl tracking-tight text-white tabular-nums sm:text-4xl">
                      {stat.value}
                    </span>
                    <span className="font-mono text-xs font-medium text-[#ff3b2f] text-right">
                      {stat.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
