"use client";

import { Children, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";

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
      if (preference.matches) return;
      const animated = new Set<HTMLElement>();
      const reveal = (node: HTMLElement, delay = 0) => {
        node.style.setProperty("--reveal-delay", `${delay}ms`);
        node.classList.add("scroll-enter");
        animated.add(node);
      };
      const photo = document.querySelector<HTMLElement>(".profile-photo");
      if (photo) reveal(photo);
      document.querySelectorAll<HTMLElement>("#hero-title > span").forEach((line, index) => reveal(line, index * 80));
      const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const section = entry.target as HTMLElement;
          Array.from(section.children).forEach((child, index) => {
            // Never fade the carousel container: its entire case study must remain visible.
            if (child instanceof HTMLElement && !child.classList.contains("showcase")) reveal(child, index * 60);
          });
          section.querySelectorAll<HTMLElement>(".eyebrow").forEach(label => {
            label.classList.add("label-enter");
            animated.add(label);
          });
          if (section.id === "skills") section.querySelectorAll<HTMLElement>(".tags li").forEach((tag, index) => {
            tag.style.setProperty("--reveal-delay", `${index * 20}ms`);
            tag.classList.add("tag-enter");
            animated.add(tag);
          });
          observer?.unobserve(section);
        });
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" }) : null;
      document.querySelectorAll<HTMLElement>("main > .section").forEach(section => observer?.observe(section));

      let pending: number | null = null;
      const update = () => {
        pending = null;
        const range = document.documentElement.scrollHeight - window.innerHeight;
        document.documentElement.style.setProperty("--scroll-progress", String(range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0));
      };
      const schedule = () => { if (pending === null) pending = requestAnimationFrame(update); };
      const nativeTimeline = CSS.supports("animation-timeline: scroll(root block)");
      const resize = !nativeTimeline && "ResizeObserver" in window ? new ResizeObserver(schedule) : null;
      if (!nativeTimeline) {
        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        resize?.observe(document.body);
      }
      cleanup = () => {
        observer?.disconnect();
        resize?.disconnect();
        if (pending !== null) cancelAnimationFrame(pending);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        document.documentElement.style.removeProperty("--scroll-progress");
        animated.forEach(node => { node.classList.remove("scroll-enter", "tag-enter", "label-enter"); node.style.removeProperty("--reveal-delay"); });
      };
    };
    setup();
    preference.addEventListener("change", setup);
    return () => { cleanup(); preference.removeEventListener("change", setup); };
  }, []);
  return <div className="scroll-progress" aria-hidden="true" />;
}

export function CountUp({ value }: { value: string }) {
  const number = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = number.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | null = null;
    const restore = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      node.textContent = value;
    };
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (preference.matches) return;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 420, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = value.replace(/\d+(?:\.\d+)?/g, token => String(Math.round(Number(token) * eased)));
        if (progress < 1) frame = requestAnimationFrame(tick);
        else restore();
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    observer.observe(node);
    preference.addEventListener("change", restore);
    return () => { observer.disconnect(); restore(); preference.removeEventListener("change", restore); };
  }, [value]);
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
  const animation = useRef<number | null>(null);
  const [current, setCurrent] = useState(0);
  const [height, setHeight] = useState<number>();
  const hydrated = useSyncExternalStore(subscribeToNothing, clientReady, serverReady);

  function cancelAnimation() {
    if (animation.current !== null) cancelAnimationFrame(animation.current);
    animation.current = null;
    if (trackRef.current) delete trackRef.current.dataset.sliding;
  }

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    cancelAnimation();
    const next = Math.max(0, Math.min(index, titles.length - 1));
    const target = (track.children[next] as HTMLElement).offsetLeft;
    if (document.activeElement !== track && track.contains(document.activeElement)) track.focus({ preventScroll: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollLeft = target;
      activeRef.current = next;
      setCurrent(next);
      return;
    }
    const start = track.scrollLeft;
    const started = performance.now();
    track.dataset.sliding = "true";
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 350, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      track.scrollLeft = start + (target - start) * eased;
      if (progress < 1) animation.current = requestAnimationFrame(tick);
      else {
        animation.current = null;
        delete track.dataset.sliding;
        activeRef.current = next;
        setCurrent(next);
      }
    };
    animation.current = requestAnimationFrame(tick);
  }

  function syncPosition() {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const nearest = slides.reduce((best, slide, index) => Math.abs(slide.offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - track.scrollLeft) ? index : best, 0);
    activeRef.current = nearest;
    setCurrent(nearest);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target instanceof HTMLElement && event.target.closest("input,textarea,select,[contenteditable=true]")) return;
    const target = event.key === "ArrowRight" ? activeRef.current + 1 : event.key === "ArrowLeft" ? activeRef.current - 1 : event.key === "Home" ? 0 : event.key === "End" ? titles.length - 1 : null;
    if (target !== null) { event.preventDefault(); goTo(target); }
  }

  useEffect(() => {
    const track = trackRef.current;
    const content = track?.children[current]?.firstElementChild;
    if (!track || !content || !("ResizeObserver" in window)) return;
    const measure = () => {
      // Use layout dimensions, independent of ancestor reveal transforms.
      const measured = Math.max((content as HTMLElement).offsetHeight, content.scrollHeight);
      if (measured > 0) setHeight(measured + 20);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    const resize = () => {
      if (animation.current !== null) cancelAnimationFrame(animation.current);
      animation.current = null;
      delete track.dataset.sliding;
      track.scrollLeft = (track.children[activeRef.current] as HTMLElement).offsetLeft;
    };
    window.addEventListener("resize", resize);
    return () => { observer.disconnect(); window.removeEventListener("resize", resize); };
  }, [current]);

  useEffect(() => {
    const slide = trackRef.current?.children[current] as HTMLElement | undefined;
    if (!slide || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fade = slide.animate([{ opacity: .65 }, { opacity: 1 }], { duration: 350, easing: "ease-out" });
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => { if (preference.matches) fade.cancel(); };
    preference.addEventListener("change", stop);
    return () => { fade.cancel(); preference.removeEventListener("change", stop); };
  }, [current]);

  useEffect(() => () => { if (animation.current !== null) cancelAnimationFrame(animation.current); }, []);

  return <div className="showcase" role="region" aria-roledescription="carousel" aria-label={labels.region} onKeyDown={onKeyDown}>
    <div className="showcase-controls"><p className="slide-counter" role="status" aria-live="polite" aria-atomic="true">{current + 1}<span> / </span>{titles.length}<span className="sr-only"> — {titles[current]}</span></p><div className="slide-buttons">
      <button type="button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label={labels.previous} aria-controls="project-slides"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg><span>{labels.previousShort}</span></button>
      <button type="button" onClick={() => goTo(current + 1)} disabled={current === titles.length - 1} aria-label={labels.next} aria-controls="project-slides"><span>{labels.nextShort}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg></button>
    </div></div>
    <p id="showcase-help" className="sr-only">{labels.help}</p>
    <div ref={trackRef} id="project-slides" className="showcase-track" role="group" aria-label={labels.slides} aria-describedby="showcase-help" tabIndex={0} onScroll={syncPosition} onPointerDown={cancelAnimation} onWheel={cancelAnimation} style={height ? { height } : undefined}>
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
