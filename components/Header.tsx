"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { contact } from "@/content/company";
import { nav } from "@/lib/site";
import { Container } from "./primitives";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change. Adjusting state during render rather than in an
  // effect — React's own recommendation for "reset state when a prop changes".
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    if (open) setOpen(false);
  }

  // Body scroll lock, Escape, and focus trap while the panel is open.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 bg-bg transition-[padding] duration-150 ease-out ${
        condensed ? "border-b-2 border-divider" : "border-b-2 border-divider"
      }`}
    >
      <Container>
        <div
          className={`flex items-center gap-6 transition-[height] duration-150 ease-out ${
            condensed ? "h-[62px]" : "h-[78px]"
          }`}
        >
          <Link
            href="/"
            className="shrink-0"
            aria-label="Proserv Property Services — home"
          >
            <Image
              src="/proserv-logo.png"
              alt="Proserv"
              width={1116}
              height={202}
              priority
              className={`w-auto transition-[height] duration-150 ease-out ${
                condensed ? "h-[26px]" : "h-[32px]"
              }`}
            />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {nav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`text-[15px] font-semibold no-underline decoration-2 underline-offset-[6px] hover:underline ${
                        active ? "text-accent-700 underline" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <a
              href={`tel:${contact.phones[0].replace(/\s/g, "")}`}
              className="hidden text-[15px] font-semibold text-ink no-underline hover:underline xl:block"
            >
              {contact.phones[0]}
            </a>
            <Link
              href="/contact"
              className="btn btn-primary hidden sm:inline-flex"
            >
              Request a quotation
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="btn btn-secondary lg:hidden"
              style={{ padding: "10px 12px", minWidth: 44 }}
            >
              {open ? (
                <X size={20} aria-hidden />
              ) : (
                <Menu size={20} aria-hidden />
              )}
              <span className="sr-only">
                {open ? "Close menu" : "Open menu"}
              </span>
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 top-[62px] z-50 overflow-y-auto border-t-2 border-divider bg-bg lg:hidden"
        >
          <Container className="py-6">
            <ul className="border-t-2 border-divider">
              {nav.map((item) => (
                <li key={item.href} className="border-b-2 border-divider">
                  <Link
                    href={item.href}
                    className="flex min-h-[56px] items-center justify-between text-[20px] font-extrabold tracking-[-0.015em] text-ink no-underline"
                  >
                    {item.label}
                    <ArrowRight size={20} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>

            <Link href="/contact" className="btn btn-primary mt-8 w-full">
              Request a quotation
            </Link>

            <div className="mt-8 border-t-2 border-divider pt-5">
              {contact.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/\s/g, "")}`}
                  className="block min-h-[44px] py-2 text-[17px] font-semibold text-ink no-underline"
                >
                  {p}
                </a>
              ))}
              <p className="mt-2 text-[13px] text-muted">
                {contact.responseCommitment}.
              </p>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
