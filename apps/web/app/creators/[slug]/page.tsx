import type { Metadata } from 'next';
import Container from '@/components/site/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateCreatorSchema } from '@/lib/seo';
import { getApiBaseUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

async function fetchCreator(slug: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/v1/creators/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchPlans(slug: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/v1/creators/${encodeURIComponent(slug)}/plans`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await params;
  const creator = await fetchCreator(p.slug);
  const title = creator ? `${creator.display_name} | اشتراک کریتور` : `Creator ${p.slug}`;
  const description = creator?.bio || 'صفحه عمومی کریتور';
  return {
    title,
    description,
    alternates: {
      canonical: `/creators/${encodeURIComponent(p.slug)}`,
    },
    openGraph: {
      title,
      description,
      type: 'profile',
    },
  };
}

export default async function CreatorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const creator = await fetchCreator(p.slug);
  const plans = await fetchPlans(p.slug);

  if (!creator) {
    return (
      <section className="section-wrap">
        <Container>
          <div className="surface-card text-sm text-[var(--text-secondary)]">کریتور پیدا نشد.</div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-wrap">
      <Container>
        <JsonLd
          data={generateCreatorSchema({
            slug: creator.slug,
            displayName: creator.display_name,
            description: creator.bio || 'Creator profile',
          })}
        />

        <article className="surface-card">
          <span className="chip">Creator Profile</span>
          <h1 className="mt-4 text-3xl font-black text-[var(--text-primary)]">{creator.display_name}</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">@{creator.slug}</p>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--text-secondary)]">{creator.bio || 'بدون بیوگرافی'}</p>
        </article>

        <div className="mt-8">
          <h2 className="text-xl font-extrabold text-[var(--text-primary)]">پلن‌های فعال</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {plans.map((plan: any) => (
              <article key={plan.id} className="surface-card card-link">
                <h3 className="text-lg font-extrabold">{plan.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{plan.description || 'بدون توضیح'}</p>
                <p className="mt-4 text-xs font-semibold text-[var(--text-muted)]">
                  {plan.price_amount} {plan.currency} / {plan.interval}
                </p>
              </article>
            ))}
            {plans.length === 0 ? (
              <div className="surface-card text-sm text-[var(--text-secondary)]">پلن فعالی وجود ندارد.</div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
