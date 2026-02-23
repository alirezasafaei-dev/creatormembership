import Link from 'next/link';
import type { Metadata } from 'next';
import Container from '@/components/site/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateWebSiteSchema } from '@/lib/seo';
import { getApiBaseUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'پلتفرم عضویت کریتور',
  description: 'مدیریت اشتراک، پرداخت، و محتوای محافظت‌شده برای کریتورهای فارسی‌زبان.',
};

async function fetchFeaturedCreators() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/v1/creators?limit=6`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
}

const valueProps = [
  {
    title: 'پرداخت امن و قابل‌ردگیری',
    body: 'checkout، callback، reconcile و replay-protection در مسیر پرداخت پیاده‌سازی شده است.',
  },
  {
    title: 'کنترل دسترسی محتوا',
    body: 'دانلود محتوا با توکن کوتاه‌عمر و بررسی عضویت فعال انجام می‌شود.',
  },
  {
    title: 'حکمرانی عملیات',
    body: 'گیت‌های lint/test/build/smoke و داشبورد Ops برای پایش سلامت در دسترس است.',
  },
];

const steps = [
  { n: '01', title: 'ساخت حساب', desc: 'کاربر ثبت‌نام می‌کند و session امن دریافت می‌کند.' },
  { n: '02', title: 'ایجاد کریتور و پلن', desc: 'کلیت صفحه کریتور و پلن‌های اشتراک ساخته و منتشر می‌شود.' },
  { n: '03', title: 'خرید و فعال‌سازی', desc: 'پس از callback موفق، اشتراک به ACTIVE منتقل می‌شود.' },
  { n: '04', title: 'تحویل محتوا', desc: 'فایل محافظت‌شده فقط به کاربر دارای اشتراک فعال می‌رسد.' },
];

export default async function HomePage() {
  const creators = await fetchFeaturedCreators();

  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />

      <section className="hero-backdrop surface-grid border-b border-[var(--border-default)]">
        <Container className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="chip">Local-First Creator Platform</span>
            <h1 className="mt-6 text-3xl font-black leading-tight text-[var(--text-primary)] md:text-5xl">
              زیرساخت عضویت کریتور،
              <br />
              آماده برای رشد واقعی
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--text-secondary)] md:text-lg">
              همه چیز از یک مسیر قابل‌اعتماد: مدیریت پلن، پرداخت، اعتبارسنجی callback، دسترسی محتوا،
              و ابزارهای عملیاتی برای تیم محصول.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/creators" className="btn-primary">
                شروع از کریتورها
              </Link>
              <Link href="/pricing" className="btn-secondary">
                مشاهده پلن‌ها
              </Link>
              <Link href="/how-it-works" className="btn-secondary">
                نحوه کار سیستم
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="kpi-card">
              <div className="text-3xl font-black">7</div>
              <p className="text-xs text-[var(--text-muted)]">فاز توسعه پایه بسته‌شده</p>
            </div>
            <div className="kpi-card">
              <div className="text-3xl font-black">10+</div>
              <p className="text-xs text-[var(--text-muted)]">گیت کیفیت و قرارداد</p>
            </div>
            <div className="kpi-card">
              <div className="text-3xl font-black">24/7</div>
              <p className="text-xs text-[var(--text-muted)]">پایش عملیاتی local runtime</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-wrap">
        <Container>
          <div className="section-head">
            <h2 className="section-title">چرا این پلتفرم؟</h2>
            <p className="section-subtitle">الگوهای فنی از پروژه‌های production واقعی بازاستفاده شده‌اند تا سرعت توسعه بالا بماند.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {valueProps.map((item) => (
              <article key={item.title} className="surface-card fade-up">
                <h3 className="text-lg font-extrabold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-wrap border-y border-[var(--border-default)] bg-[var(--surface-2)]/55">
        <Container>
          <div className="section-head">
            <h2 className="section-title">جریان محصول در ۴ مرحله</h2>
            <p className="section-subtitle">مسیر پرداخت و عضویت end-to-end به‌صورت smoke تست می‌شود.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step) => (
              <article key={step.n} className="surface-card">
                <span className="chip">مرحله {step.n}</span>
                <h3 className="mt-4 text-lg font-extrabold">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{step.desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-wrap">
        <Container>
          <div className="section-head">
            <h2 className="section-title">کریتورهای تازه</h2>
            <p className="section-subtitle">نمونه‌های عمومی که الان قابل مشاهده هستند.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {creators.map((creator: any) => (
              <Link key={creator.id} href={`/creators/${creator.slug}`} className="surface-card card-link">
                <h3 className="text-lg font-extrabold">{creator.display_name}</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">@{creator.slug}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] line-clamp-3">{creator.bio || 'بدون بیوگرافی'}</p>
              </Link>
            ))}
            {creators.length === 0 ? (
              <div className="surface-card text-sm text-[var(--text-secondary)]">
                فعلاً کریتوری برای نمایش پیدا نشد. API را اجرا کنید و داده نمونه بسازید.
              </div>
            ) : null}
          </div>
          <div className="mt-6 text-center">
            <Link href="/creators" className="btn-primary">
              مشاهده همه کریتورها
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
