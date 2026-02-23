import type { Metadata } from 'next';
import Container from '@/components/site/Container';

export const metadata: Metadata = {
  title: 'حریم خصوصی',
  description: 'نحوه مدیریت داده‌های کاربران در AsDev Creator Membership.',
  robots: {
    index: false,
    follow: false,
  },
};

const items = [
  {
    title: 'حداقل‌گرایی داده',
    desc: 'فقط داده‌های لازم برای احراز هویت، اشتراک و عملیات پرداخت نگهداری می‌شود.',
  },
  {
    title: 'Auditability',
    desc: 'رویدادهای حساس در audit_events ثبت می‌شوند تا بررسی امنیتی و عملیاتی ممکن باشد.',
  },
  {
    title: 'کنترل session',
    desc: 'کاربر می‌تواند session را refresh/signout/signout-all کند و دستگاه‌های فعال را ببیند.',
  },
];

export default function PrivacyPage() {
  return (
    <section className="section-wrap">
      <Container>
        <div className="section-head text-right">
          <h1 className="section-title">حریم خصوصی</h1>
          <p className="section-subtitle">این صفحه خلاصه رفتار داده‌ای سیستم را نشان می‌دهد.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="surface-card">
              <h2 className="text-lg font-extrabold">{item.title}</h2>
              <p className="mt-3 text-sm leading-8 text-[var(--text-secondary)]">{item.desc}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
