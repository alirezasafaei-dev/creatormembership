import Link from 'next/link';
import Container from './Container';

const footerLinks = [
  { href: '/creators', label: 'کشف کریتور' },
  { href: '/pricing', label: 'پلن‌ها' },
  { href: '/how-it-works', label: 'نحوه کار' },
  { href: '/privacy', label: 'حریم خصوصی' },
  { href: '/about', label: 'درباره' },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--surface-1)]/95">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-[var(--text-primary)]">AsDev Creator Membership</h2>
            <p className="text-sm leading-7 text-[var(--text-secondary)]">
              زیرساخت local-first برای کریتورها: پرداخت، اشتراک، محافظت محتوا و گردش‌کار عملیاتی.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">مسیرهای سریع</h3>
            <ul className="mt-3 grid gap-2 text-sm text-[var(--text-secondary)]">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link className="hover:text-[var(--color-primary)]" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">وضعیت محصول</h3>
            <p className="text-sm text-[var(--text-secondary)]">MVP پایدار، با مسیر روشن برای production-grade.</p>
            <Link href="/admin/ops" className="btn-secondary inline-flex">
              داشبورد عملیات
            </Link>
          </section>
        </div>

        <div className="mt-8 border-t border-[var(--border-default)] pt-4 text-xs text-[var(--text-muted)]">
          © {year} AsDev. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
