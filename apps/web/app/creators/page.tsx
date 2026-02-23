import Link from 'next/link';
import type { Metadata } from 'next';
import Container from '@/components/site/Container';
import { getApiBaseUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'کشف کریتور',
  description: 'لیست عمومی کریتورها و صفحات عضویت آن‌ها.',
};

async function fetchCreators(q: string) {
  const url = new URL('/api/v1/creators', getApiBaseUrl());
  if (q) url.searchParams.set('q', q);
  url.searchParams.set('limit', '36');
  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
}

export default async function CreatorsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const q = String(sp?.q || '');
  const creators = await fetchCreators(q);

  return (
    <section className="section-wrap">
      <Container>
        <div className="section-head text-right">
          <h1 className="section-title">کشف کریتور‌ها</h1>
          <p className="section-subtitle">بر اساس نام یا slug جستجو کنید و صفحه عمومی هر کریتور را ببینید.</p>
        </div>

        <form className="surface-card mb-6" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="جستجو بر اساس نام یا slug"
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none ring-[var(--color-primary)] transition focus:ring-2"
          />
        </form>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {creators.map((c: any) => (
            <Link key={c.id} href={`/creators/${c.slug}`} className="surface-card card-link">
              <h2 className="text-lg font-extrabold">{c.display_name}</h2>
              <p className="mt-1 text-xs text-[var(--text-muted)]">@{c.slug}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{c.bio || 'بدون بیوگرافی'}</p>
            </Link>
          ))}
          {creators.length === 0 ? (
            <div className="surface-card text-sm text-[var(--text-secondary)]">نتیجه‌ای پیدا نشد.</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
