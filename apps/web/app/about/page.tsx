import type { Metadata } from 'next';
import Container from '@/components/site/Container';

export const metadata: Metadata = {
  title: 'درباره پروژه',
  description: 'چشم‌انداز، معماری و هدف پروژه AsDev Creator Membership.',
};

const pillars = [
  'Local-first runtime و استقلال از وابستگی خارجی در مسیر توسعه و تست',
  'کیفیت مهندسی با گیت‌های مستمر: lint/typecheck/test/build/smoke',
  'مدل عملیاتی امن برای پرداخت، اشتراک، دانلود و audit trail',
];

export default function AboutPage() {
  return (
    <section className="section-wrap">
      <Container>
        <div className="section-head text-right">
          <h1 className="section-title">درباره AsDev Creator Membership</h1>
          <p className="section-subtitle">
            این پروژه برای اجرای واقعی اقتصاد کریتور طراحی شده: مسیر کامل از onboarding تا subscription و content delivery.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((item) => (
            <article key={item} className="surface-card">
              <h2 className="text-base font-extrabold">ستون محصول</h2>
              <p className="mt-3 text-sm leading-8 text-[var(--text-secondary)]">{item}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
