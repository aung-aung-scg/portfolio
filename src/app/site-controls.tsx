"use client";

import { Children, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("portfolio-theme", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("portfolio-theme", onChange);
    window.removeEventListener("storage", onChange);
  };
}
function getTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}
const subscribeToNothing = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function ScrollEffects() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      const reduced = preference.matches;
      const animated = new Set<HTMLElement>();
      const reveal = (node: HTMLElement, delay = 0) => {
        if (reduced) return;
        node.style.setProperty("--reveal-delay", `${delay}ms`);
        node.classList.add("scroll-enter");
        animated.add(node);
      };
      const photo = document.querySelector<HTMLElement>(".profile-photo");
      if (photo) reveal(photo);
      document.querySelectorAll<HTMLElement>("#hero-title > span").forEach((line, index) => reveal(line, index * 80));
      const observer = !reduced && "IntersectionObserver" in window ? new IntersectionObserver(entries => {
        let timelineDelay = 0;
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const section = entry.target as HTMLElement;
          if (section.classList.contains("proof")) {
            reveal(section, 480 + Array.from(section.parentElement!.children).indexOf(section) * 60);
            section.classList.add("metric-enter");
            animated.add(section);
            observer?.unobserve(section);
            return;
          }
          if (section.matches(".timeline > li")) {
            reveal(section, timelineDelay);
            timelineDelay += 60;
            observer?.unobserve(section);
            return;
          }
          Array.from(section.children).forEach((child, index) => {
            // Never fade the carousel container: its entire case study must remain visible.
            if (child instanceof HTMLElement && !child.matches(".showcase, .experience-list")) reveal(child, index * 60);
          });
          section.querySelectorAll<HTMLElement>(".eyebrow").forEach(label => {
            label.classList.add("label-enter");
            animated.add(label);
          });
          if (section.id === "skills") section.querySelectorAll<HTMLElement>(".skill-years-row").forEach((row, index) => {
            row.style.setProperty("--reveal-delay", `${index * 60}ms`);
            row.classList.add("fill-enter");
            animated.add(row);
          });
          observer?.unobserve(section);
        });
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" }) : null;
      document.querySelectorAll<HTMLElement>("main > .section").forEach(section => observer?.observe(section));
      document.querySelectorAll<HTMLElement>(".proof").forEach(proof => observer?.observe(proof));
      document.querySelectorAll<HTMLElement>(".timeline > li").forEach(entry => observer?.observe(entry));

      let pending: number | null = null;
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".main-navigation a[href^='#']"));
      const sections = links.map(link => document.querySelector<HTMLElement>(link.hash));
      const nativeTimeline = CSS.supports("animation-timeline: scroll(root block)");
      const update = () => {
        pending = null;
        const range = document.documentElement.scrollHeight - window.innerHeight;
        if (!reduced && !nativeTimeline) document.documentElement.style.setProperty("--scroll-progress", String(range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0));
        const marker = (document.querySelector(".site-header")?.getBoundingClientRect().height ?? 88) + Math.min(window.innerHeight * .2, 120);
        let active = -1;
        sections.forEach((section, index) => { if (section && section.getBoundingClientRect().top <= marker) active = index; });
        if (range > 0 && window.scrollY >= range - 2) active = links.length - 1;
        links.forEach((link, index) => { if (index === active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current"); });
      };
      const schedule = () => { if (pending === null) pending = requestAnimationFrame(update); };
      const resize = "ResizeObserver" in window ? new ResizeObserver(schedule) : null;
      update();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      resize?.observe(document.body);
      cleanup = () => {
        observer?.disconnect();
        resize?.disconnect();
        if (pending !== null) cancelAnimationFrame(pending);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        document.documentElement.style.removeProperty("--scroll-progress");
        animated.forEach(node => { node.classList.remove("scroll-enter", "tag-enter", "label-enter", "metric-enter", "fill-enter"); node.style.removeProperty("--reveal-delay"); });
      };
    };
    setup();
    preference.addEventListener("change", setup);
    return () => { cleanup(); preference.removeEventListener("change", setup); };
  }, []);
  return <div className="scroll-progress" aria-hidden="true" />;
}

export function CountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const number = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = number.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const restore = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      clearTimeout(timer);
      node.textContent = value;
    };
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (preference.matches) return;
      timer = setTimeout(() => {
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 420, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = value.replace(/\d+(?:\.\d+)?/g, token => String(Math.round(Number(token) * eased)));
          if (progress < 1) frame = requestAnimationFrame(tick);
          else restore();
        };
        frame = requestAnimationFrame(tick);
      }, delay);
    }, { threshold: 0.5 });
    observer.observe(node);
    preference.addEventListener("change", restore);
    return () => { observer.disconnect(); restore(); preference.removeEventListener("change", restore); };
  }, [value, delay]);
  return <><span className="sr-only">{value}</span><span ref={number} aria-hidden="true">{value}</span></>;
}

export function ThemeToggle({ lightLabel, darkLabel }: { lightLabel: string; darkLabel: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("portfolio-theme", next); } catch { /* Switching works without persistence. */ }
    window.dispatchEvent(new Event("portfolio-theme"));
  }
  return <button className="theme-toggle" type="button" onClick={toggle} aria-label={theme === "dark" ? lightLabel : darkLabel}>
    {theme === "dark" ? <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" /></svg>}
  </button>;
}

type ShowcaseLabels = {
  region: string; slides: string; help: string;
  previous: string; next: string; previousShort: string; nextShort: string;
};

export function ProjectShowcase({ children, titles, labels }: { children: ReactNode; titles: string[]; labels: ShowcaseLabels }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const requested = useRef(0);
  const queued = useRef<number | null>(null);
  const animation = useRef<number | null>(null);
  const gesture = useRef<{ id: number; x: number; y: number; start: number; started: number; direction: number; moved: boolean } | null>(null);
  const blockClick = useRef(false);
  const [current, setCurrent] = useState(0);
  const [height, setHeight] = useState<number>();
  const hydrated = useSyncExternalStore(subscribeToNothing, clientReady, serverReady);

  function commit(index: number) {
    activeRef.current = index;
    setCurrent(previous => previous === index ? previous : index);
  }

  // Rotate the existing nodes instead of cloning case studies (and their IDs).
  // The reset stays on the same visible slide; the next slide is always adjacent.
  function arrange(direction: number) {
    const track = trackRef.current!;
    const count = titles.length;
    const base = direction > 0 ? activeRef.current : (activeRef.current + 1) % count;
    const slides = Array.from(track.children) as HTMLElement[];
    const changed = slides.some((slide, index) => slide.style.order !== String((index - base + count) % count));
    track.dataset.sliding = "true";
    if (changed) {
      slides.forEach((slide, index) => { slide.style.order = String((index - base + count) % count); });
      track.scrollLeft = slides[activeRef.current].offsetLeft;
    }
  }

  function cancelAnimation() {
    if (animation.current !== null) cancelAnimationFrame(animation.current);
    animation.current = null;
    queued.current = null;
    requested.current = activeRef.current;
    if (trackRef.current) delete trackRef.current.dataset.sliding;
  }

  function goTo(index: number) {
    requested.current = ((index % titles.length) + titles.length) % titles.length;
    if (animation.current !== null) { queued.current = index; return; }
    animateTo(index);
  }

  function animateTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    if (animation.current !== null) cancelAnimationFrame(animation.current);
    animation.current = null;
    // Keep snapping suspended between a drag and its settling animation.
    track.dataset.sliding = "true";
    const next = ((index % titles.length) + titles.length) % titles.length;
    if (next !== activeRef.current) arrange(index > activeRef.current ? 1 : -1);
    const target = (track.children[next] as HTMLElement).offsetLeft;
    if (document.activeElement !== track && track.contains(document.activeElement)) track.focus({ preventScroll: true });
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) {
      track.scrollLeft = target;
      delete track.dataset.sliding;
      commit(next);
      return;
    }
    const start = track.scrollLeft;
    const started = performance.now();
    track.dataset.sliding = "true";
    const tick = (now: number) => {
      const progress = motionPreference.matches ? 1 : Math.min((now - started) / 400, 1);
      const eased = progress < .5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      track.scrollLeft = start + (target - start) * eased;
      if (progress < 1) animation.current = requestAnimationFrame(tick);
      else {
        animation.current = null;
        delete track.dataset.sliding;
        commit(next);
        const pending = queued.current;
        queued.current = null;
        if (pending !== null && ((pending % titles.length) + titles.length) % titles.length !== next) animateTo(pending);
        else requested.current = next;
      }
    };
    animation.current = requestAnimationFrame(tick);
  }

  function syncPosition() {
    const track = trackRef.current;
    if (!track || animation.current !== null || gesture.current?.moved) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const nearest = slides.reduce((best, slide, index) => Math.abs(slide.offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - track.scrollLeft) ? index : best, 0);
    commit(nearest);
    requested.current = nearest;
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || titles.length < 2) return;
    blockClick.current = false;
    if (event.target instanceof Element && event.target.closest("a,button,summary,input,textarea,select,[contenteditable=true]")) return;
    cancelAnimation();
    syncPosition();
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, start: event.currentTarget.scrollLeft, started: performance.now(), direction: 0, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (event.pointerType === "mouse") event.preventDefault();
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    const state = gesture.current;
    if (!state || state.id !== event.pointerId) return;
    const distance = state.x - event.clientX;
    if (!state.moved) {
      if (Math.abs(distance) < 6 || Math.abs(distance) <= Math.abs(event.clientY - state.y)) return;
      state.direction = distance > 0 ? 1 : -1;
      arrange(state.direction);
      state.start = event.currentTarget.scrollLeft;
      state.moved = true;
      event.currentTarget.dataset.dragging = "true";
      event.currentTarget.focus({ preventScroll: true });
    }
    const limit = event.currentTarget.clientWidth;
    const movement = state.direction > 0 ? Math.max(0, Math.min(limit, distance)) : Math.min(0, Math.max(-limit, distance));
    event.currentTarget.scrollLeft = state.start + movement;
    event.preventDefault();
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const state = gesture.current;
    if (!state || state.id !== event.pointerId) return;
    gesture.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!state.moved) return;
    blockClick.current = true;
    const distance = Math.abs(event.currentTarget.scrollLeft - state.start);
    const enough = distance >= Math.min(60, event.currentTarget.clientWidth * .15) || (distance >= 12 && distance / Math.max(1, performance.now() - state.started) > .35);
    goTo(activeRef.current + (event.type !== "pointercancel" && enough ? state.direction : 0));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target instanceof HTMLElement && event.target.closest("input,textarea,select,[contenteditable=true]")) return;
    const target = event.key === "ArrowRight" ? requested.current + 1 : event.key === "ArrowLeft" ? requested.current - 1 : event.key === "Home" ? 0 : event.key === "End" ? titles.length - 1 : null;
    if (target !== null) { event.preventDefault(); goTo(target); }
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !("ResizeObserver" in window)) return;
    const contents = Array.from(track.children).map(slide => slide.firstElementChild).filter((node): node is HTMLElement => node instanceof HTMLElement);
    const measure = () => {
      // Reserve the tallest case study so navigating never shifts the page.
      const measured = Math.max(0, ...contents.map(content => Math.max(content.offsetHeight, content.scrollHeight)));
      if (measured > 0) setHeight(measured + 20);
    };
    measure();
    const observer = new ResizeObserver(measure);
    contents.forEach(content => observer.observe(content));
    const resize = () => {
      if (animation.current !== null) cancelAnimationFrame(animation.current);
      animation.current = null;
      queued.current = null;
      requested.current = activeRef.current;
      delete track.dataset.sliding;
      track.scrollLeft = (track.children[activeRef.current] as HTMLElement).offsetLeft;
    };
    window.addEventListener("resize", resize);
    return () => { observer.disconnect(); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => () => { if (animation.current !== null) cancelAnimationFrame(animation.current); }, []);

  return <div className="showcase" role="region" aria-roledescription="carousel" aria-label={labels.region} onKeyDown={onKeyDown}>
    <div className="showcase-navigation"><div className="showcase-controls"><p className="slide-counter" role="status" aria-live="polite" aria-atomic="true">{current + 1}<span> / </span>{titles.length}<span className="sr-only"> — {titles[current]}</span></p><div className="slide-buttons">
      <button type="button" onClick={() => goTo(requested.current - 1)} disabled={titles.length < 2} aria-label={labels.previous} aria-controls="project-slides"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg><span>{labels.previousShort}</span></button>
      <button type="button" onClick={() => goTo(requested.current + 1)} disabled={titles.length < 2} aria-label={labels.next} aria-controls="project-slides"><span>{labels.nextShort}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg></button>
    </div></div>
    <div className="slide-dots" role="group" aria-label={labels.slides}>{titles.map((title, index) => <button key={title} type="button" aria-label={`${index + 1} / ${titles.length}: ${title}`} aria-current={index === current ? "true" : undefined} aria-controls="project-slides" onClick={() => goTo(index)}><span aria-hidden="true" /></button>)}</div></div>
    <p id="showcase-help" className="sr-only">{labels.help}</p>
    <div ref={trackRef} id="project-slides" className="showcase-track" role="group" aria-label={labels.slides} aria-describedby="showcase-help" tabIndex={0} onScroll={syncPosition} onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onDragStart={event => event.preventDefault()} onClickCapture={event => { if (blockClick.current) { event.preventDefault(); event.stopPropagation(); blockClick.current = false; } }} onWheel={cancelAnimation} style={height ? { height } : undefined}>
      {Children.map(children, (child, index) => <div className="showcase-slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} / ${titles.length}: ${titles[index]}`} aria-hidden={hydrated && index !== current ? true : undefined} inert={hydrated && index !== current ? true : undefined}>{child}</div>)}
    </div>
  </div>;
}

export function ExperienceDisclosure({ children, expandLabel, collapseLabel }: { children: ReactNode; expandLabel: string; collapseLabel: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [allOpen, setAllOpen] = useState(false);
  useEffect(() => {
    const node = root.current;
    const animations = new Map<HTMLElement, Animation>();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => { animations.forEach(animation => animation.cancel()); animations.clear(); };
    const sync = (event: Event) => {
      const entries = Array.from(node?.querySelectorAll<HTMLDetailsElement>(".experience-details") ?? []);
      setAllOpen(entries.length > 0 && entries.every(entry => entry.open));
      const entry = event.target;
      if (!(entry instanceof HTMLDetailsElement)) return;
      const panel = entry.querySelector<HTMLElement>(".timeline-description");
      if (!panel) return;
      animations.get(panel)?.cancel();
      if (!entry.open || preference.matches) return;
      const animation = panel.animate([
        { height: "0px", opacity: 0, overflow: "hidden" },
        { height: `${panel.scrollHeight}px`, opacity: 1, overflow: "hidden" },
      ], { duration: 280, easing: "ease-out" });
      animations.set(panel, animation);
      animation.onfinish = () => animations.delete(panel);
    };
    node?.addEventListener("toggle", sync, true);
    preference.addEventListener("change", stop);
    return () => { node?.removeEventListener("toggle", sync, true); preference.removeEventListener("change", stop); stop(); };
  }, []);
  function toggleAll() {
    root.current?.querySelectorAll<HTMLDetailsElement>(".experience-details").forEach(entry => { entry.open = !allOpen; });
    setAllOpen(!allOpen);
  }
  return <div ref={root} className="experience-list"><button className="expand-all" type="button" aria-expanded={allOpen} aria-controls="experience-entries" onClick={toggleAll}>{allOpen ? collapseLabel : expandLabel}</button>{children}</div>;
}

export function CopyEmail({ email, label, copiedLabel, failedLabel }: { email: string; label: string; copiedLabel: string; failedLabel: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  async function copy() {
    try { await navigator.clipboard.writeText(email); setStatus("copied"); }
    catch { setStatus("failed"); }
  }
  return <><button className="copy-email" type="button" onClick={copy} aria-label={label}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="1" /><path d="M16 8V3H3v13h5" /></svg></button><span className="copy-status" role="status" aria-live="polite">{status === "copied" ? copiedLabel : status === "failed" ? failedLabel : ""}</span></>;
}
