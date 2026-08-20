import { useActiveSectionContext } from "@/context/active-section-context";
import { useLoaderContext } from "@/context/loader-context";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { sectionHash } from "./data";
import type { SectionName } from "./types";

// Covers a real nav click's smooth-scroll window. Deliberately not what
// guards against the loader hand-off race any more — see isSettled below for
// why a duration-based check can't be trusted for that one.
const OBSERVER_SUPPRESSION_MS = 1500;

export function useSectionInView(sectionName: SectionName, threshold = 0.75) {
  // While the loader's post-reveal zoom is still moving (home-shell.tsx),
  // every section is visually compressed toward the top of the page, so one
  // that would normally sit off-screen can satisfy this very observer's
  // threshold from the transform alone — no scrolling involved. `skip`
  // pauses observation outright rather than just filtering what to do with
  // the result: a timestamp check ("was the reveal less than N ms ago") can
  // be defeated by any effect-scheduling delay, which an entrance animation
  // competing for the main thread is exactly the moment likely to cause.
  // See loader-gate.tsx's `end` for where isSettled flips back on.
  const { isSettled } = useLoaderContext();
  const { ref, inView } = useInView({
    threshold,
    skip: !isSettled,
  });
  const { setActiveSection, timeOfLastClick } = useActiveSectionContext();

  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > OBSERVER_SUPPRESSION_MS) {
      setActiveSection(sectionName);
      // Keeps the address bar in step with whatever the nav is highlighting.
      // replaceState rather than pushState: this fires on every section the
      // user scrolls past, and pushing each one would fill the back-button
      // history with scroll stops instead of actual navigations.
      const hash = sectionHash[sectionName];
      if (hash && window.location.hash !== hash) {
        window.history.replaceState(null, "", hash);
      }
    }
  }, [inView, setActiveSection, timeOfLastClick, sectionName]);

  return {
    ref,
  };
}

/**
 * Scrolls to a section by id, bypassing the browser's native hash-jump.
 *
 * The native jump is a one-shot position calculated when the click fires; on
 * this page the hero's height changes as it recedes on scroll (see
 * home-shell.tsx / hero.tsx's scroll-linked scale), so a jump calculated a
 * moment too early or late lands short. Driving it through scrollIntoView
 * instead re-reads the target's position at call time. scroll-margin-top
 * (the scroll-mt-* utility already on every section) is respected
 * automatically, so the fixed header offset still applies.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

/**
 * Click handler for same-page hash links. Takes over the scroll (see
 * scrollToId) and pushes the URL immediately rather than waiting on the
 * native jump, but only for a plain left click — a modified click (cmd/ctrl,
 * shift, middle button) is left alone so opening the link in a new tab still
 * works.
 */
export function handleHashNavClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  hash: string,
  onNavigate: () => void
) {
  if (e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  e.preventDefault();
  window.history.pushState(null, "", hash);
  scrollToId(hash.replace(/^#/, ""));
  onNavigate();
}
