import type { Metadata } from 'next';
import Container from '@/components/site/Container';

export const metadata: Metadata = {
  title: 'پلن‌ها',
  description: 'نمای کلی پلن‌های قابل ارائه برای کریتورها و تیم‌های رشد.',
};

const plans = [
  {
    name: 'Starter',
    price: '0',
    unit: 'تومان',
    details: ['پروفایل عمومی کریتور', 'ایجاد پلن اولیه', 'گزارش پایه پرداخت'],
  },
  {
    name: 'Growth',
    price: '9,900,000',
    unit: 'تومان / ماه',
    details: ['مدیریت چند پلن', 'گزارش reconciliation', 'کنترل دسترسی پیشرفته محتوا'],
    featured: true,
  },
  {
    name: 'Operations+',
    price: 'سفارشی',
    unit: '',
    details: ['داشبورد Ops سفارشی', 'SRE playbook و مانیتورینگ', 'همراهی در go-live production'],
  },
];

export default function PricingPage() {
  return (
    <section className="section-wrap">
      <Container>
        <div className="section-head text-right">
          <h1 className="section-title">پلن‌های همکاری</h1>
          <p className="section-subtitle">برای MVP تا production-scale، پلن مناسب تیم شما قابل انتخاب است.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`surface-card ${plan.featured ? 'ring-2 ring-[color:rgb(var(--color-primary-rgb)/0.25)]' : ''}`}
            >
              {plan.featured ? <span className="chip">پیشنهاد تیم محصول</span> : null}
              <h2 className="mt-4 text-xl font-black">{plan.name}</h2>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-primary)]">{plan.price}</p>
              <p className="text-xs text-[var(--text-muted)]">{plan.unit}</p>
              <ul className="mt-4 grid gap-2 text-sm text-[var(--text-secondary)]">
                {plan.details.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
