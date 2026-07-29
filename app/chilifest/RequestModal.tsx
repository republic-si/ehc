"use client";

import { useEffect, useRef, useState } from "react";
import { RequestForm } from "./RequestForm";
import type { Lang } from "@/lib/chilifest/copy";

// A reliable, click-to-open home for the Chili Fest request flow.
//
// Anchor-scrolling to an on-page #request section was intermittent: on a fresh
// load the browser measured the target before the images above had settled, and
// Next's App Router doesn't reliably scroll to a hash after a soft route change.
// A modal removes the whole class of problem — a click that opens a dialog does
// not depend on scroll position, image timing, or the router.
//
// The native <dialog> element gives us focus-trapping, Esc-to-close, and
// top-layer stacking (above the sticky nav) for free.
//
// Opens on: the custom OPEN_EVENT (buttons), a hashchange to #request, and on
// mount when the URL already carries #request — so every existing deep link
// (press emails, the nav pill from other pages) keeps working and now works
// every time. The hash is stripped on close so re-clicking the same link
// re-fires hashchange.

export const OPEN_EVENT = "chilifest:open-request";

export function openRequestModal() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function RequestModal({ lang = "en" }: { lang?: Lang }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  function show() {
    const d = dialogRef.current;
    if (d && !d.open) {
      d.showModal();
      setOpen(true);
    }
  }

  function hide() {
    const d = dialogRef.current;
    if (d?.open) d.close();
  }

  useEffect(() => {
    const onOpen = () => show();
    const onHash = () => {
      if (window.location.hash === "#request") show();
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener("hashchange", onHash);
    // Honour a deep link present on first load.
    if (window.location.hash === "#request") show();
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  // Lock background scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Fires on Esc, backdrop close, and hide() — the single place we reset state
  // and clear the hash so the next link click re-triggers an open.
  function handleClose() {
    setOpen(false);
    if (window.location.hash === "#request") {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={(e) => {
        // A click landing on the dialog element itself (the backdrop area
        // around the content) closes it; clicks inside the content don't.
        if (e.target === dialogRef.current) hide();
      }}
      className="fixed inset-0 m-auto h-fit w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-transparent p-0 backdrop:bg-ink-deep/70"
    >
      <div className="relative max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 text-ink shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={hide}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-rule/40 hover:text-ink"
        >
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
        {/* Mount the form only while open so its funnel-analytics + sessionStorage
            rehydration run fresh each time the dialog is shown. */}
        {open ? <RequestForm lang={lang} /> : null}
      </div>
    </dialog>
  );
}
