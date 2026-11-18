import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Pause, Play, Bot, Compass, Square } from 'lucide-react';

interface AgentDef {
  id: number;
  name: string;
  color: string;
  textColor: string;
  blinkDelay: string;
}

const ALL_AGENTS: AgentDef[] = [
  { id: 0, name: 'Scout', color: '#ff3b2f', textColor: '#ffffff', blinkDelay: '0s' },
  { id: 1, name: 'Layout', color: '#2563eb', textColor: '#ffffff', blinkDelay: '0.4s' },
  { id: 2, name: 'Typeset', color: '#d97706', textColor: '#ffffff', blinkDelay: '0.9s' },
  { id: 3, name: 'Motion', color: '#059669', textColor: '#ffffff', blinkDelay: '1.3s' },
  { id: 4, name: 'QA', color: '#0284c7', textColor: '#ffffff', blinkDelay: '1.8s' },
  { id: 5, name: 'Deploy', color: '#e11d48', textColor: '#ffffff', blinkDelay: '2.2s' },
  { id: 6, name: 'Copy', color: '#ea580c', textColor: '#ffffff', blinkDelay: '0.2s' },
  { id: 7, name: 'Lint', color: '#0d9488', textColor: '#ffffff', blinkDelay: '0.7s' },
  { id: 8, name: 'Index', color: '#65a30d', textColor: '#09090b', blinkDelay: '1.1s' },
  { id: 9, name: 'Render', color: '#dc2626', textColor: '#ffffff', blinkDelay: '1.5s' },
  { id: 10, name: 'Palette', color: '#ca8a04', textColor: '#09090b', blinkDelay: '2.0s' },
  { id: 11, name: 'Review', color: '#0891b2', textColor: '#ffffff', blinkDelay: '2.5s' },
];

const MAX_CONCURRENT_BUILDS = 6;
const STORAGE_KEY = 'ashrafi_agents_enabled';
const TOUR_SESSION_KEY = 'ashrafi_tour_pending';

type BuildKind = 'type' | 'pop' | 'wipe';
type TaskPhase = 'glide' | 'drag' | 'reveal';

interface TextSnapshot {
  nodes: Text[];
  originals: string[];
  totalChars: number;
}

interface BuildTask {
  el: HTMLElement;
  kind: BuildKind;
  label: string;
  agentIndex: number;
  wireIndex: number;
  phase: TaskPhase;
  phaseStart: number;
  glideDuration: number;
  dragDuration: number;
  revealDuration: number;
  startX: number;
  startY: number;
}

interface AgentRuntime {
  x: number;
  y: number;
  idlePhase: number;
  busy: boolean;
  opacity: number;
}

declare global {
  interface Window {
    __ASHRAFI_BUILD_INIT__?: {
      enabled: boolean;
      forced: boolean;
      tour: boolean;
    };
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function easeOutBack(t: number): number {
  const c1 = 1.45;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Continuous C1 ease-in -> steady linear -> ease-out curve for Tour scrolling
function tourScrollCurve(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  const a = 0.12;
  const b = 0.88;
  const v = 1 / (0.5 + 0.5 * b - 0.5 * a);
  if (clamped <= a) {
    return 0.5 * (v / a) * clamped * clamped;
  }
  if (clamped <= b) {
    return 0.5 * v * a + v * (clamped - a);
  }
  const u = 1 - clamped;
  return 1 - 0.5 * (v / (1 - b)) * u * u;
}

function collectTextSnapshot(el: HTMLElement): TextSnapshot {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  const originals: string[] = [];
  let totalChars = 0;

  let current = walker.nextNode();
  while (current) {
    const textNode = current as Text;
    const val = textNode.nodeValue ?? '';
    if (val.length > 0) {
      nodes.push(textNode);
      originals.push(val);
      totalChars += val.length;
    }
    current = walker.nextNode();
  }

  return { nodes, originals, totalChars };
}

function applyTypedProgress(snap: TextSnapshot, charsToShow: number) {
  let remaining = charsToShow;
  for (let i = 0; i < snap.nodes.length; i++) {
    const orig = snap.originals[i];
    if (remaining <= 0) {
      snap.nodes[i].nodeValue = '';
    } else if (remaining >= orig.length) {
      snap.nodes[i].nodeValue = orig;
      remaining -= orig.length;
    } else {
      snap.nodes[i].nodeValue = orig.slice(0, remaining);
      remaining = 0;
    }
  }
}

function restoreTextSnapshot(snap: TextSnapshot) {
  for (let i = 0; i < snap.nodes.length; i++) {
    snap.nodes[i].nodeValue = snap.originals[i];
  }
}

export default function AgentBuildEngine() {
  const initData =
    typeof window !== 'undefined' && window.__ASHRAFI_BUILD_INIT__
      ? window.__ASHRAFI_BUILD_INIT__
      : { enabled: true, forced: false, tour: false };

  const [agentsEnabled, setAgentsEnabled] = useState<boolean>(initData.enabled);
  const [paused, setPaused] = useState<boolean>(false);
  const [booting, setBooting] = useState<boolean>(initData.enabled);
  const [bootProgress, setBootProgress] = useState<number>(initData.enabled ? 8 : 100);
  const [tourState, setTourState] = useState<'idle' | 'waiting-hero' | 'scrolling'>(
    initData.enabled && initData.tour ? 'waiting-hero' : 'idle'
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const cursorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wireRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wireLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const pausedRef = useRef<boolean>(false);
  const agentsEnabledRef = useRef<boolean>(initData.enabled);
  const tourStateRef = useRef<'idle' | 'waiting-hero' | 'scrolling'>(
    initData.enabled && initData.tour ? 'waiting-hero' : 'idle'
  );

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    agentsEnabledRef.current = agentsEnabled;
  }, [agentsEnabled]);

  useEffect(() => {
    tourStateRef.current = tourState;
  }, [tourState]);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const stopTour = useCallback(() => {
    if (tourStateRef.current !== 'idle') {
      tourStateRef.current = 'idle';
      setTourState('idle');
      try {
        window.sessionStorage.removeItem(TOUR_SESSION_KEY);
      } catch {
        // ignore storage errors
      }
      const url = new URL(window.location.href);
      if (url.searchParams.has('tour')) {
        url.searchParams.delete('tour');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

  const startTour = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
      window.sessionStorage.setItem(TOUR_SESSION_KEY, '1');
    } catch {
      // ignore storage errors
    }
    const url = new URL(window.location.href);
    if (url.searchParams.get('agents') === 'off') {
      url.searchParams.set('agents', 'on');
    }
    url.searchParams.set('tour', '1');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    window.location.assign(url.toString());
  }, []);

  const toggleAgents = useCallback(() => {
    const next = !agentsEnabledRef.current;
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'true' : 'false');
    } catch {
      // ignore
    }

    const url = new URL(window.location.href);
    if (next) {
      if (url.searchParams.get('agents') === 'off') {
        url.searchParams.set('agents', 'on');
      }
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      window.location.assign(url.toString());
    } else {
      stopTour();
      if (url.searchParams.get('agents') === 'on') {
        url.searchParams.delete('agents');
        window.history.replaceState({}, '', url.toString());
      }
      document.documentElement.classList.remove('build-mode');
      setAgentsEnabled(false);
      setBooting(false);
      setPaused(false);
    }
  }, [stopTour]);

  const togglePause = useCallback(() => {
    if (!agentsEnabledRef.current) return;
    setPaused((prev) => !prev);
  }, []);

  // Boot loader sequence
  useEffect(() => {
    if (!agentsEnabled) {
      setBooting(false);
      document.documentElement.classList.remove('build-mode');
      return;
    }

    let frameId = 0;
    const startTime = performance.now();
    const duration = 680;

    const tickBoot = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      setBootProgress(Math.round(8 + easeOutCubic(p) * 92));
      if (p < 1) {
        frameId = requestAnimationFrame(tickBoot);
      } else {
        setTimeout(() => {
          setBooting(false);
        }, 120);
      }
    };

    frameId = requestAnimationFrame(tickBoot);
    return () => cancelAnimationFrame(frameId);
  }, [agentsEnabled]);

  // Main single requestAnimationFrame + IntersectionObserver build engine
  useEffect(() => {
    if (!agentsEnabled || booting) {
      return;
    }

    const activeAgentCount = window.innerWidth < 768 ? 6 : 12;
    const textSnapshots = new WeakMap<HTMLElement, TextSnapshot>();
    const domOrder = new WeakMap<HTMLElement, number>();
    const queuedSet = new Set<HTMLElement>();
    const buildingSet = new Set<HTMLElement>();
    const queue: HTMLElement[] = [];
    const activeTasks: BuildTask[] = [];
    const usedWireIndices = new Set<number>();

    const agentStates: AgentRuntime[] = ALL_AGENTS.slice(0, activeAgentCount).map(
      (_, idx) => {
        const edgeSide = idx % 2 === 0 ? 0.08 : 0.92;
        const yFrac = 0.14 + ((idx % 6) / 6) * 0.65;
        return {
          x: window.innerWidth * edgeSide,
          y: window.innerHeight * yFrac,
          idlePhase: idx * 0.9,
          busy: false,
          opacity: 0.9,
        };
      }
    );

    const markBuiltInstant = (el: HTMLElement) => {
      if (el.dataset.built === 'true') return;
      const snap = textSnapshots.get(el);
      if (snap) {
        restoreTextSnapshot(snap);
      }
      el.style.minHeight = '';
      el.style.transform = '';
      el.style.opacity = '';
      el.style.clipPath = '';
      delete el.dataset.building;
      el.dataset.built = 'true';
      queuedSet.delete(el);
      buildingSet.delete(el);
    };

    const registerElements = () => {
      const all = Array.from(document.querySelectorAll<HTMLElement>('[data-build]'));
      all.forEach((el, idx) => {
        domOrder.set(el, idx);
        const kind = (el.dataset.build as BuildKind) || 'pop';
        if (kind === 'type' && !textSnapshots.has(el)) {
          textSnapshots.set(el, collectTextSnapshot(el));
        }
        // Any element already scrolled past or hidden via responsive display:none appears instantly
        if (el.dataset.built !== 'true' && el.dataset.building !== 'true') {
          const rect = el.getBoundingClientRect();
          if (rect.bottom < 0 || (rect.width === 0 && rect.height === 0)) {
            markBuiltInstant(el);
          }
        }
      });
      return all;
    };

    let allElements = registerElements();

    const enqueueElement = (el: HTMLElement) => {
      if (
        el.dataset.built === 'true' ||
        el.dataset.building === 'true' ||
        queuedSet.has(el) ||
        buildingSet.has(el)
      ) {
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || (rect.width === 0 && rect.height === 0)) {
        markBuiltInstant(el);
        return;
      }
      queuedSet.add(el);
      queue.push(el);
      queue.sort((a, b) => (domOrder.get(a) ?? 0) - (domOrder.get(b) ?? 0));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (el.dataset.built === 'true') continue;
          const rect = el.getBoundingClientRect();
          if (rect.bottom < 0) {
            markBuiltInstant(el);
          } else if (entry.isIntersecting) {
            enqueueElement(el);
          }
        }
      },
      {
        threshold: 0.02,
        rootMargin: '40px 0px -10px 0px',
      }
    );

    allElements.forEach((el) => observer.observe(el));

    // Seed initially visible elements immediately
    for (const el of allElements) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0) {
        markBuiltInstant(el);
      } else if (rect.top < window.innerHeight * 0.98 && rect.bottom > 0) {
        enqueueElement(el);
      }
    }

    const handleDomRefresh = () => {
      allElements = registerElements();
      allElements.forEach((el) => {
        observer.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0) {
          markBuiltInstant(el);
        } else if (rect.top < window.innerHeight * 0.98 && rect.bottom > 0) {
          enqueueElement(el);
        }
      });
    };
    window.addEventListener('portfolio:dom-refresh', handleDomRefresh);

    // Tour scroll state
    let tourWaitReadyAt: number | null = null;
    let tourScrollStartAt: number | null = null;
    let tourTotalDuration = 28000;
    let tourStartScrollY = 0;
    let tourTargetMaxY = 0;

    let rafId = 0;
    let lastTimestamp = performance.now();
    let pauseOffset = 0;
    let wasPaused = false;

    const allocateWireIndex = (): number => {
      for (let i = 0; i < MAX_CONCURRENT_BUILDS; i++) {
        if (!usedWireIndices.has(i)) {
          usedWireIndices.add(i);
          return i;
        }
      }
      return -1;
    };

    const allocateNearestAgent = (targetX: number, targetY: number): number => {
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let i = 0; i < agentStates.length; i++) {
        if (agentStates[i].busy) continue;
        const dx = agentStates[i].x - targetX;
        const dy = agentStates[i].y - targetY;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }
      return bestIdx;
    };

    const hideWireframe = (wireIdx: number) => {
      const wireEl = wireRefs.current[wireIdx];
      if (wireEl) {
        wireEl.style.opacity = '0';
        wireEl.style.transform = 'translate3d(-9999px, -9999px, 0)';
      }
    };

    const tick = (rawNow: number) => {
      if (!agentsEnabledRef.current) {
        allElements.forEach(markBuiltInstant);
        for (let w = 0; w < MAX_CONCURRENT_BUILDS; w++) hideWireframe(w);
        return;
      }

      if (pausedRef.current) {
        if (!wasPaused) {
          wasPaused = true;
        }
        pauseOffset += rawNow - lastTimestamp;
        lastTimestamp = rawNow;
        rafId = requestAnimationFrame(tick);
        return;
      } else if (wasPaused) {
        wasPaused = false;
      }

      const now = rawNow - pauseOffset;
      const dt = Math.min(48, rawNow - lastTimestamp);
      lastTimestamp = rawNow;

      // 1. Check for scrolled-past, hidden, or newly visible elements
      for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        if (el.dataset.built === 'true' || el.dataset.building === 'true') continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || (rect.width === 0 && rect.height === 0)) {
          markBuiltInstant(el);
        } else if (rect.top < window.innerHeight * 0.98 && rect.bottom > 0) {
          enqueueElement(el);
        }
      }

      // 2. Clean out any queued elements that were scrolled past
      for (let i = queue.length - 1; i >= 0; i--) {
        const el = queue[i];
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || el.dataset.built === 'true') {
          queue.splice(i, 1);
          queuedSet.delete(el);
          markBuiltInstant(el);
        }
      }

      // 3. Assign up to MAX_CONCURRENT_BUILDS tasks in reading order
      while (activeTasks.length < MAX_CONCURRENT_BUILDS && queue.length > 0) {
        const wireIdx = allocateWireIndex();
        if (wireIdx === -1) break;

        const el = queue[0];
        const rect = el.getBoundingClientRect();
        const agentIdx = allocateNearestAgent(rect.left, rect.top);
        if (agentIdx === -1) {
          usedWireIndices.delete(wireIdx);
          break;
        }

        queue.shift();
        queuedSet.delete(el);
        buildingSet.add(el);
        agentStates[agentIdx].busy = true;
        agentStates[agentIdx].opacity = 1;

        const kind = (el.dataset.build as BuildKind) || 'pop';
        const label = el.dataset.buildLabel || `${el.tagName.toLowerCase()} · ${kind}`;
        const dx = rect.left - agentStates[agentIdx].x;
        const dy = rect.top - agentStates[agentIdx].y;
        const dist = Math.hypot(dx, dy);

        const glideDuration = Math.max(115, Math.min(240, 95 + dist * 0.14));
        const dragDuration = Math.max(130, Math.min(200, 120 + rect.width * 0.08));

        let revealDuration = 240;
        if (kind === 'type') {
          const snap = textSnapshots.get(el);
          const chars = snap ? snap.totalChars : 24;
          revealDuration = Math.max(180, Math.min(620, chars * 9));
        } else if (kind === 'wipe') {
          revealDuration = 300;
        }

        activeTasks.push({
          el,
          kind,
          label,
          agentIndex: agentIdx,
          wireIndex: wireIdx,
          phase: 'glide',
          phaseStart: now,
          glideDuration,
          dragDuration,
          revealDuration,
          startX: agentStates[agentIdx].x,
          startY: agentStates[agentIdx].y,
        });
      }

      // 4. Advance active tasks
      for (let i = activeTasks.length - 1; i >= 0; i--) {
        const task = activeTasks[i];
        const rect = task.el.getBoundingClientRect();

        // If user scrolled rapidly past this element mid-build, complete it instantly
        if (rect.bottom < -40) {
          markBuiltInstant(task.el);
          agentStates[task.agentIndex].busy = false;
          usedWireIndices.delete(task.wireIndex);
          hideWireframe(task.wireIndex);
          activeTasks.splice(i, 1);
          continue;
        }

        const wireEl = wireRefs.current[task.wireIndex];
        const wireLabelEl = wireLabelRefs.current[task.wireIndex];
        const elapsed = now - task.phaseStart;

        if (task.phase === 'glide') {
          const p = Math.min(1, elapsed / task.glideDuration);
          const eased = easeOutCubic(p);
          agentStates[task.agentIndex].x =
            task.startX + (rect.left - task.startX) * eased;
          agentStates[task.agentIndex].y =
            task.startY + (rect.top - task.startY) * eased;

          if (p >= 1) {
            task.phase = 'drag';
            task.phaseStart = now;
            if (wireLabelEl) {
              wireLabelEl.textContent = task.label;
            }
          }
        } else if (task.phase === 'drag') {
          const p = Math.min(1, elapsed / task.dragDuration);
          const eased = easeOutQuart(p);
          const w = Math.max(8, rect.width * eased);
          const h = Math.max(8, rect.height * eased);

          agentStates[task.agentIndex].x = rect.left + w;
          agentStates[task.agentIndex].y = rect.top + h;

          if (wireEl) {
            wireEl.style.opacity = '1';
            wireEl.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
            wireEl.style.width = `${w}px`;
            wireEl.style.height = `${h}px`;
          }

          if (p >= 1) {
            task.phase = 'reveal';
            task.phaseStart = now;
            task.el.dataset.building = 'true';

            if (task.kind === 'type') {
              const snap = textSnapshots.get(task.el);
              if (snap) {
                task.el.style.minHeight = `${rect.height}px`;
                applyTypedProgress(snap, 0);
              }
            } else if (task.kind === 'pop') {
              task.el.style.opacity = '0';
              task.el.style.transform = 'scale(0.92)';
            } else if (task.kind === 'wipe') {
              task.el.style.clipPath = 'inset(0 100% 0 0)';
            }
          }
        } else if (task.phase === 'reveal') {
          const p = Math.min(1, elapsed / task.revealDuration);

          if (wireEl) {
            wireEl.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
            wireEl.style.width = `${rect.width}px`;
            wireEl.style.height = `${rect.height}px`;
            wireEl.style.opacity = `${Math.max(0, 1 - p * 0.85)}`;
          }

          if (task.kind === 'type') {
            const snap = textSnapshots.get(task.el);
            if (snap) {
              const chars = Math.floor(p * snap.totalChars);
              applyTypedProgress(snap, chars);
            }
            agentStates[task.agentIndex].x = rect.left + rect.width * (0.25 + p * 0.72);
            agentStates[task.agentIndex].y = rect.top + rect.height;
          } else if (task.kind === 'pop') {
            const eased = easeOutBack(p);
            const scale = 0.92 + 0.08 * eased;
            task.el.style.opacity = `${Math.min(1, p * 1.35)}`;
            task.el.style.transform = `scale(${scale})`;
            agentStates[task.agentIndex].x = rect.right;
            agentStates[task.agentIndex].y = rect.bottom;
          } else if (task.kind === 'wipe') {
            const eased = easeOutCubic(p);
            const rightInset = Math.max(0, (1 - eased) * 100);
            task.el.style.clipPath = `inset(0 ${rightInset}% 0 0)`;
            agentStates[task.agentIndex].x = rect.left + rect.width * eased;
            agentStates[task.agentIndex].y = rect.top + rect.height * 0.5;
          }

          if (p >= 1) {
            markBuiltInstant(task.el);
            agentStates[task.agentIndex].busy = false;
            usedWireIndices.delete(task.wireIndex);
            hideWireframe(task.wireIndex);
            activeTasks.splice(i, 1);
          }
        }
      }

      // 5. Gently park idle agents near viewport margins so they never cover content
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      for (let i = 0; i < agentStates.length; i++) {
        const agent = agentStates[i];
        if (!agent.busy) {
          agent.idlePhase += dt * 0.0014;
          const isLeft = i % 2 === 0;
          const parkX = isLeft
            ? Math.max(24, vw * 0.03 + Math.sin(agent.idlePhase) * 10)
            : Math.min(vw - 110, vw * 0.93 + Math.cos(agent.idlePhase) * 10);
          const parkY =
            vh * (0.18 + ((i % 6) / 6) * 0.62) + Math.sin(agent.idlePhase * 1.2) * 8;

          agent.x += (parkX - agent.x) * Math.min(1, dt * 0.0045);
          agent.y += (parkY - agent.y) * Math.min(1, dt * 0.0045);
          const targetOpacity = activeTasks.length > 0 ? 0.55 : 0.28;
          agent.opacity += (targetOpacity - agent.opacity) * Math.min(1, dt * 0.006);
        }

        const cursorEl = cursorRefs.current[i];
        if (cursorEl) {
          cursorEl.style.transform = `translate3d(${agent.x}px, ${agent.y}px, 0)`;
          cursorEl.style.opacity = `${agent.opacity}`;
        }
      }

      // 6. Tour mode state machine
      if (tourStateRef.current === 'waiting-hero') {
        const heroEls = Array.from(
          document.querySelectorAll<HTMLElement>('[data-hero-build="true"]')
        );
        const heroDone =
          heroEls.length > 0 && heroEls.every((el) => el.dataset.built === 'true');
        if (heroDone) {
          if (tourWaitReadyAt === null) {
            tourWaitReadyAt = now;
          } else if (now - tourWaitReadyAt > 480) {
            tourStateRef.current = 'scrolling';
            setTourState('scrolling');
            tourScrollStartAt = now;
            tourStartScrollY = window.scrollY;
            tourTargetMaxY = Math.max(
              0,
              document.documentElement.scrollHeight - window.innerHeight
            );
            tourTotalDuration = Math.max(18000, Math.min(44000, tourTargetMaxY * 10.5));
          }
        }
      } else if (tourStateRef.current === 'scrolling' && tourScrollStartAt !== null) {
        const elapsedTour = now - tourScrollStartAt;
        const t = Math.min(1, elapsedTour / tourTotalDuration);
        const curve = tourScrollCurve(t);
        const nextY = tourStartScrollY + (tourTargetMaxY - tourStartScrollY) * curve;
        window.scrollTo({ top: nextY, behavior: 'instant' as ScrollBehavior });

        if (t >= 1) {
          stopTour();
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('portfolio:dom-refresh', handleDomRefresh);
    };
  }, [agentsEnabled, booting, stopTour]);

  // Cancel tour on user scroll or Escape, plus keyboard shortcuts T / A / P
  useEffect(() => {
    const onUserScrollIntent = () => {
      if (tourStateRef.current !== 'idle') {
        stopTour();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (tourStateRef.current !== 'idle') {
          e.preventDefault();
          stopTour();
        }
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (tourStateRef.current !== 'idle') {
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'PageDown' ||
          e.key === 'PageUp' ||
          e.key === ' '
        ) {
          stopTour();
          return;
        }
      }

      const lower = e.key.toLowerCase();
      if (lower === 't') {
        e.preventDefault();
        startTour();
      } else if (lower === 'a') {
        e.preventDefault();
        toggleAgents();
      } else if (lower === 'p') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('wheel', onUserScrollIntent, { passive: true });
    window.addEventListener('touchmove', onUserScrollIntent, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onUserScrollIntent);
      window.removeEventListener('touchmove', onUserScrollIntent);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [startTour, stopTour, toggleAgents, togglePause]);

  const visibleAgents = ALL_AGENTS.slice(0, isMobile ? 6 : 12);

  return (
    <>
      {/* Short Boot Loader */}
      {booting && (
        <div
          aria-live="polite"
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#09090b] px-6"
        >
          <div className="w-full max-w-xs space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="font-anton text-xl tracking-wide text-white uppercase">
                Ashrafi Islam
              </span>
              <span className="font-mono text-xs tabular-nums text-zinc-400">
                {bootProgress}%
              </span>
            </div>
            <div className="h-[2px] w-full overflow-hidden bg-zinc-800">
              <div
                className="h-full bg-[#ff3b2f] transition-transform duration-75 origin-left"
                style={{ transform: `scaleX(${bootProgress / 100})` }}
              />
            </div>
            <p className="font-mono text-[11px] text-zinc-500">
              Dispatching {isMobile ? 6 : 12} layout agents…
            </p>
          </div>
        </div>
      )}

      {/* Blue Wireframe Overlay Pool (Max 6 concurrent) */}
      {agentsEnabled && !booting && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
        >
          {Array.from({ length: MAX_CONCURRENT_BUILDS }).map((_, idx) => (
            <div
              key={idx}
              ref={(node) => {
                wireRefs.current[idx] = node;
              }}
              style={{
                opacity: 0,
                transform: 'translate3d(-9999px, -9999px, 0)',
                willChange: 'transform, width, height, opacity',
              }}
              className="fixed top-0 left-0 border border-blue-500/90 bg-blue-500/[0.06]"
            >
              {/* 4 Corner Handles */}
              <span className="absolute -top-[3px] -left-[3px] h-1.5 w-1.5 border border-blue-500 bg-white" />
              <span className="absolute -top-[3px] -right-[3px] h-1.5 w-1.5 border border-blue-500 bg-white" />
              <span className="absolute -bottom-[3px] -left-[3px] h-1.5 w-1.5 border border-blue-500 bg-white" />
              <span className="absolute -bottom-[3px] -right-[3px] h-1.5 w-1.5 border border-blue-500 bg-white" />
              {/* Small Label */}
              <span
                ref={(node) => {
                  wireLabelRefs.current[idx] = node;
                }}
                className="absolute -top-5 left-0 whitespace-nowrap bg-blue-600 px-1.5 py-0.5 font-mono text-[10px] leading-none text-white"
              >
                build
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Robot Cursors Layer */}
      {agentsEnabled && !booting && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
        >
          {visibleAgents.map((agent, idx) => (
            <div
              key={agent.name}
              ref={(node) => {
                cursorRefs.current[idx] = node;
              }}
              style={{
                transform: 'translate3d(-120px, -120px, 0)',
                willChange: 'transform, opacity',
              }}
              className="fixed top-0 left-0 select-none"
            >
              {/* Crisp Arrow Pointer */}
              <svg
                width="16"
                height="18"
                viewBox="0 0 16 18"
                fill="none"
                className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
              >
                <path
                  d="M1.5 1.5L14.2 8.2L8.4 9.9L5.6 15.8L1.5 1.5Z"
                  fill={agent.color}
                  stroke="#09090b"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Coloured Name Tag + Tiny Robot Head */}
              <div
                style={{ backgroundColor: agent.color, color: agent.textColor }}
                className="ml-3 -mt-1 flex items-center gap-1 rounded px-1.5 py-0.5 shadow-lg ring-1 ring-black/40"
              >
                {/* Tiny Robot Head SVG (pulsing antenna + blinking LED eyes) */}
                <svg
                  width="12"
                  height="13"
                  viewBox="0 0 12 13"
                  fill="none"
                  className="shrink-0"
                >
                  <line
                    x1="6"
                    y1="2.2"
                    x2="6"
                    y2="4.2"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                  <circle
                    cx="6"
                    cy="1.6"
                    r="1.1"
                    fill="#ffffff"
                    className="robot-antenna"
                    style={{ animationDelay: agent.blinkDelay }}
                  />
                  <rect
                    x="1.4"
                    y="4.2"
                    width="9.2"
                    height="7.2"
                    rx="1.8"
                    fill="#09090b"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <rect
                    x="3.2"
                    y="6.7"
                    width="1.8"
                    height="2.1"
                    rx="0.5"
                    fill="#60a5fa"
                    className="robot-eye"
                    style={{ animationDelay: agent.blinkDelay }}
                  />
                  <rect
                    x="7.0"
                    y="6.7"
                    width="1.8"
                    height="2.1"
                    rx="0.5"
                    fill="#60a5fa"
                    className="robot-eye"
                    style={{ animationDelay: agent.blinkDelay }}
                  />
                </svg>
                <span className="font-mono text-[10px] font-medium leading-none tracking-tight whitespace-nowrap">
                  {agent.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compact Bottom Controls Dock */}
      <div
        role="region"
        aria-label="Portfolio animation controls"
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
      >
        <div className="flex h-10 items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950/95 px-1.5 shadow-2xl">
          <button
            type="button"
            onClick={togglePause}
            disabled={!agentsEnabled}
            aria-pressed={paused}
            title="Pause or resume build animation (P)"
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 font-mono text-xs whitespace-nowrap shrink-0 text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f] disabled:pointer-events-none disabled:opacity-40"
          >
            {paused ? (
              <Play className="h-3.5 w-3.5 text-[#ff3b2f]" aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{paused ? 'Resume' : 'Pause'}</span>
            <kbd className="hidden sm:inline text-[10px] text-zinc-500">P</kbd>
          </button>

          <span className="h-4 w-px bg-zinc-800" aria-hidden="true" />

          <button
            type="button"
            onClick={toggleAgents}
            aria-pressed={agentsEnabled}
            title="Toggle agent build animation (A)"
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 font-mono text-xs whitespace-nowrap shrink-0 text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f] disabled:pointer-events-none disabled:opacity-40"
          >
            <Bot
              className={`h-3.5 w-3.5 ${
                agentsEnabled ? 'text-[#ff3b2f]' : 'text-zinc-500'
              }`}
              aria-hidden="true"
            />
            <span>{agentsEnabled ? 'Agents On' : 'Agents Off'}</span>
            <kbd className="hidden sm:inline text-[10px] text-zinc-500">A</kbd>
          </button>

          <span className="h-4 w-px bg-zinc-800" aria-hidden="true" />

          {tourState === 'idle' ? (
            <button
              type="button"
              onClick={startTour}
              title="Reload and run smooth auto-scroll tour (T)"
              className="inline-flex h-7 items-center gap-1.5 rounded-md bg-[#ff3b2f] px-3 font-mono text-xs font-medium whitespace-nowrap shrink-0 text-white transition-colors hover:bg-[#e02d22] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-40"
            >
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tour</span>
              <kbd className="hidden sm:inline text-[10px] text-white/80">T</kbd>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopTour}
              title="Stop tour (Esc or scroll)"
              className="inline-flex h-7 items-center gap-1.5 rounded-md bg-zinc-800 px-3 font-mono text-xs font-medium whitespace-nowrap shrink-0 text-white transition-colors hover:bg-zinc-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b2f]"
            >
              <Square className="h-3 w-3 fill-[#ff3b2f] text-[#ff3b2f]" aria-hidden="true" />
              <span>Stop Tour</span>
              <kbd className="hidden sm:inline text-[10px] text-zinc-400">Esc</kbd>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
