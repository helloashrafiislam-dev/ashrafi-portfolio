import React, { useState } from 'react';
import { ArrowUpRight, Check, Copy, Mail, MapPin } from 'lucide-react';
import { RESUME_PROFILE } from '../data/resume';

export default function ContactFooter() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(RESUME_PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback selection copy if clipboard API unavailable
      const input = document.createElement('input');
      input.value = RESUME_PROFILE.email;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <footer
      id="contact"
      className="border-t border-zinc-900 bg-[#09090b] pt-20 pb-24 sm:pt-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Big Call-To-Action Card */}
        <div
          data-build="pop"
          data-build-label="cta-card · pop"
          className="rounded-xl border border-zinc-800 bg-zinc-950 p-7 sm:p-12"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7 space-y-4">
              <p
                data-build="type"
                data-build-label="kicker · type"
                className="font-mono text-xs tracking-wider text-[#ff3b2f] uppercase"
              >
                Get in touch
              </p>
              <h2
                data-build="wipe"
                data-build-label="cta-title · wipe"
                className="font-anton text-4xl leading-[0.95] tracking-tight text-white uppercase sm:text-6xl text-balance"
              >
                Let&apos;s build something fast and reliable.
              </h2>
              <p
                data-build="type"
                data-build-label="cta-body · type"
                className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base"
              >
                Available for web development collaborations, Next.js and React
                frontend builds, and UI or API debugging.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`mailto:${RESUME_PROFILE.email}`}
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-[#ff3b2f] px-6 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#e02d22] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Send an email</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-5 font-mono text-xs font-medium text-zinc-200 whitespace-nowrap shrink-0 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                      <span>Copied {RESUME_PROFILE.email}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span>Copy {RESUME_PROFILE.email}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Email & Socials Column */}
            <div className="lg:col-span-5 space-y-5 border-t border-zinc-800 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <div>
                <p className="font-mono text-xs text-zinc-500 uppercase">Email</p>
                <a
                  href={`mailto:${RESUME_PROFILE.email}`}
                  className="mt-1 inline-block text-base font-medium text-white transition-colors hover:text-[#ff3b2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f]"
                >
                  {RESUME_PROFILE.email}
                </a>
              </div>

              <div>
                <p className="font-mono text-xs text-zinc-500 uppercase">Social</p>
                <a
                  href={RESUME_PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-base font-medium text-white transition-colors hover:text-[#ff3b2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f]"
                >
                  <span>{RESUME_PROFILE.linkedinDisplay}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <div>
                <p className="font-mono text-xs text-zinc-500 uppercase">Location</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-zinc-300">
                  <MapPin className="h-3.5 w-3.5 text-[#ff3b2f]" aria-hidden="true" />
                  <span>{RESUME_PROFILE.city}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Footer Row */}
        <div className="mt-14 flex flex-col gap-4 border-t border-zinc-900 pt-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">
            © {new Date().getFullYear()} {RESUME_PROFILE.name} · {RESUME_PROFILE.city}
          </p>

          <div className="flex flex-wrap items-center gap-5 font-mono">
            <a
              href="#work"
              className="transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f]"
            >
              Work
            </a>
            <a
              href="#stack"
              className="transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f]"
            >
              Stack
            </a>
            <a
              href="#record"
              className="transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f]"
            >
              Record
            </a>
            <a
              href="#about"
              className="transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f]"
            >
              About
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
