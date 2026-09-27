import { useEffect } from "react";

// Reveals .reveal elements as they scroll into view. A MutationObserver picks up
// elements rendered later (client-side route changes, lazy route chunks), so new
// pages never stay hidden until a refresh.
export function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(e => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    const scan = (root: ParentNode) => root.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach(e => io.observe(e));
    scan(document);
    const mo = new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => {
      if (!(n instanceof HTMLElement)) return;
      if (n.matches(".reveal:not(.in)")) io.observe(n);
      scan(n);
    })));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}
