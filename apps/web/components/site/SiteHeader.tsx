'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Container from './Container';

const navItems = [
  { href: '/', label: 'خانه' },
  { href: '/creators', label: 'کشف کریتور' },
  { href: '/pricing', label: 'پلن‌ها' },
  { href: '/how-it-works', label: 'نحوه کار' },
  { href: '/about', label: 'درباره' },
];

export default function SiteHeader() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[color:var(--surface-1)]/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="group inline-flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white shadow-[var(--shadow-md)]">
            A
          </span>
          <span className="text-base font-extrabold tracking-tight text-[var(--text-primary)]">AsDev Membership</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="ناوبری اصلی">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive(item.href)
                  ? 'bg-[color:rgb(var(--color-primary-rgb)/0.14)] text-[var(--color-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/creators" className="btn-primary">
            شروع عضویت
          </Link>
        </div>

        <button
          type="button"
          aria-label="باز کردن منو"
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </Container>

      {open ? (
        <div className="border-t border-[var(--border-default)] bg-[var(--surface-1)] md:hidden">
          <Container className="grid gap-2 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/creators" className="btn-primary text-center" onClick={() => setOpen(false)}>
              شروع عضویت
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
