import type { Metadata } from 'next';
import Container from '@/components/site/Container';

export const metadata: Metadata = {
  title: 'نحوه کار',
  description: 'مسیر فنی و عملیاتی عضویت کریتور در این پلتفرم.',
};

const flow = [
  {
    title: 'احراز هویت و Session',
    desc: 'ثبت‌نام/ورود و مدیریت چرخه session (refresh, signout, signout-all) با audit event انجام می‌شود.',
  },
  {
    title: 'Checkout و Callback',
    desc: 'پرداخت ثبت می‌شود، callback امضاشده پردازش می‌شود، و replay با webhook receipt کنترل می‌گردد.',
  },
  {
    title: 'Subscription Lifecycle',
    desc: 'وضعیت اشتراک بین PENDING/ACTIVE/CANCELED مدیریت و برای owner قابل مشاهده است.',
  },
  {
    title: 'Protected Delivery',
    desc: 'برای دانلود، توکن کوتاه‌عمر صادر می‌شود و دسترسی فقط برای عضو فعال آزاد است.',
  },
];

export default function HowItWorksPage() {
  return (
    <section className="section-wrap">
      <Container>
        <div className="section-head text-right">
          <h1 className="section-title">نحوه کار سیستم</h1>
          <p className="section-subtitle">این جریان در تست‌های smoke به‌صورت end-to-end راستی‌آزمایی می‌شود.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {flow.map((item, index) => (
            <article key={item.title} className="surface-card">
              <span className="chip">مرحله {index + 1}</span>
              <h2 className="mt-4 text-lg font-extrabold">{item.title}</h2>
              <p className="mt-3 text-sm leading-8 text-[var(--text-secondary)]">{item.desc}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
