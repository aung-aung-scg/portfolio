"use client";

import { useEffect, useSyncExternalStore } from "react";

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

export function ThemeToggle({ lightLabel, darkLabel }: { lightLabel: string; darkLabel: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    nodes.forEach(node => {
      if (node.getBoundingClientRect().top > window.innerHeight + 20) {
        node.classList.add("reveal-pending");
        observer.observe(node);
      }
    });
    const revealFocused = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) event.target.closest(".reveal-pending")?.classList.remove("reveal-pending");
    };
    document.addEventListener("focusin", revealFocused);
    return () => {
      observer.disconnect();
      nodes.forEach(node => node.classList.remove("reveal-pending"));
      document.removeEventListener("focusin", revealFocused);
    };
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("portfolio-theme", next); } catch { /* Theme switching still works without storage. */ }
    window.dispatchEvent(new Event("portfolio-theme"));
  }

  return <button className="theme-toggle" type="button" onClick={toggle} aria-label={theme === "dark" ? lightLabel : darkLabel}>
    {theme === "dark" ? <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" /></svg>}
  </button>;
}
