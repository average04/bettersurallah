import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { FeeBadge } from "@/components/services-directory";
import {
  CHARTER,
  CLASSIFICATION_HELP,
  FEEDBACK,
  OFFICE_BY_KEY,
  pdfPageUrl,
  SERVICE_BY_SLUG,
  SERVICES,
  TRANSACTION_LABELS,
  type Service,
  type Step,
} from "@/data/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_BY_SLUG.get(slug);
  if (!service) return {};
  const office = OFFICE_BY_KEY[service.office];
  return {
    title: service.name,
    description: `What to bring, steps, fees and processing time for ${service.name.toLowerCase()} at the ${office.name}, Surallah.`,
  };
}

function feeSummary(s: Service): string {
  if (s.free) return "Free";
  if (s.totalFee && s.totalFee !== "None") return `${s.totalFee} in total`;
  return "Fees apply. See the steps below.";
}

const LONG_FEE = 160;

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = SERVICE_BY_SLUG.get(slug);
  if (!service) notFound();
  const office = OFFICE_BY_KEY[service.office];
  const related = SERVICES.filter((s) => s.office === service.office && s.slug !== service.slug);
  const pages = service.endPage > service.page ? `pages ${service.page}–${service.endPage}` : `page ${service.page}`;
  const showOfficial = service.officialTitle.toLowerCase() !== service.name.toLowerCase();

  return (
    <article className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 sm:py-16">
      <div className="flex items-center justify-between gap-4">
        <Link href="/services" className="text-sm font-semibold text-blue hover:text-blue-deep print:hidden">
          ← All services
        </Link>
        <PrintButton />
      </div>

      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-blue">
        {office.topic} · {office.short}
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">{service.name}</h1>
      {showOfficial && (
        <p className="mt-2 text-sm text-ink-soft">
          In the charter: <span className="font-medium text-ink">{service.officialTitle}</span>
        </p>
      )}
      {service.summary && <p className="mt-5 max-w-3xl text-lg leading-8 text-ink-soft">{service.summary}</p>}

      <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
        <Fact label="Processing time" value={service.totalTime || "Not stated in the charter"} />
        <Fact label="Fees" value={feeSummary(service)} />
        <Fact label="Who can apply" value={service.whoMayAvail} />
        <Fact
          label="Type of transaction"
          value={[service.classification, ...service.transaction.map((t) => TRANSACTION_LABELS[t].toLowerCase())].join(" · ")}
          hint={CLASSIFICATION_HELP[service.classification]}
        />
      </dl>

      {service.notes.length > 0 && (
        <div className="mt-6 flex flex-col gap-2 rounded-xl border border-blue/20 bg-mist/50 p-5 text-sm leading-6 text-ink">
          {service.notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      )}

      <section aria-labelledby="bring" className="mt-12">
        <h2 id="bring" className="font-display text-2xl font-bold text-ink">What to bring</h2>
        <p className="mt-1 text-sm text-ink-soft print:hidden">Tick items off as you gather them. Nothing is saved or sent anywhere.</p>
        <div className="mt-5 flex flex-col gap-6">
          {service.requirements.map((group, gi) => (
            <div key={gi}>
              {group.label && <h3 className="font-display text-lg font-bold text-ink">{group.label}</h3>}
              {group.note && <p className="mt-1 text-sm leading-6 text-ink-soft">{group.note}</p>}
              <ul className="mt-3 divide-y divide-ink/10 overflow-hidden rounded-xl border border-ink/10">
                {group.items.map((it, ii) => (
                  <li key={ii}>
                    <label className="flex cursor-pointer gap-3 p-4 transition-colors hover:bg-mist/40">
                      <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-blue" />
                      <span className="min-w-0">
                        <span className="leading-6 text-ink">{it.item}</span>
                        {it.options && (
                          <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-ink-soft">
                            {it.options.map((o) => (
                              <li key={o}>{o}</li>
                            ))}
                          </ul>
                        )}
                        {it.where === "Client" ? (
                          <span className="mt-1 block text-sm text-ink-soft">You prepare this yourself</span>
                        ) : (
                          it.where && (
                            <span className="mt-1 block text-sm text-ink-soft">
                              Get it from: <span className="font-medium text-ink">{it.where}</span>
                            </span>
                          )
                        )}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="steps" className="mt-12">
        <h2 id="steps" className="font-display text-2xl font-bold text-ink">Step by step</h2>
        <ol className="mt-5 flex flex-col gap-4">
          {service.steps.map((step, i) => (
            <StepCard key={i} step={step} n={i + 1} />
          ))}
        </ol>
        {service.totalTime && (
          <p className="mt-4 text-sm text-ink-soft">
            Total processing time in the charter: <span className="font-semibold text-ink">{service.totalTime}</span>
          </p>
        )}
      </section>

      <section aria-labelledby="where" className="mt-12 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-ink/10 p-5">
          <h2 id="where" className="font-display text-lg font-bold text-ink">Where to go</h2>
          <p className="mt-2 font-semibold text-ink">{office.name}</p>
          <p className="text-sm leading-6 text-ink-soft">{office.address}</p>
          {office.phone && (
            <a href={`tel:${office.phone.replace(/[^\d]/g, "")}`} className="mt-2 inline-block text-sm font-semibold text-blue hover:text-blue-deep">
              ☎ {office.phone}
            </a>
          )}
        </div>
        <div className="rounded-xl border border-ink/10 p-5">
          <h2 className="font-display text-lg font-bold text-ink">Problems or feedback?</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            The {FEEDBACK.office} handles complaints:{" "}
            <a href={`mailto:${FEEDBACK.email}`} className="font-semibold text-blue hover:text-blue-deep">{FEEDBACK.email}</a> ·{" "}
            <a href={`tel:${FEEDBACK.phone.replace(/[^\d]/g, "")}`} className="font-semibold text-blue hover:text-blue-deep">{FEEDBACK.phone}</a>.{" "}
            <Link href="/services#feedback" className="font-semibold text-blue hover:text-blue-deep print:hidden">How it works</Link>
          </p>
        </div>
      </section>

      <p className="mt-8 rounded-xl bg-mist/60 p-5 text-sm leading-6 text-ink-soft">
        Source: {CHARTER.title}, {pages}.{" "}
        <a href={pdfPageUrl(service.page)} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue hover:text-blue-deep">
          Open the PDF at this page ↗
        </a>{" "}
        If anything here differs from the PDF, the PDF is the official version.
      </p>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-12 print:hidden">
          <h2 id="related" className="font-display text-lg font-bold text-ink">More from the {office.short}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/services/${r.slug}`} className="group flex items-center justify-between gap-3 rounded-lg border border-ink/10 px-4 py-3 text-sm transition-colors hover:border-blue/40">
                  <span className="font-semibold text-ink group-hover:text-blue">{r.name}</span>
                  <span className="shrink-0 text-xs"><FeeBadge free={r.free} totalFee={r.totalFee} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function Fact({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-base p-5">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{label}</dt>
      <dd className="mt-1 font-semibold leading-6 text-ink">{value}</dd>
      {hint && <dd className="mt-1 text-xs leading-5 text-ink-soft">{hint}</dd>}
    </div>
  );
}

function StepCard({ step, n }: { step: Step; n: number }) {
  const fee = step.fee === "None" ? "Free" : step.fee;
  const longFee = fee.length > LONG_FEE;
  return (
    <li className="rounded-xl border border-ink/10 p-5 sm:p-6">
      <div className="flex gap-4">
        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue font-display text-base font-bold text-white">
          {n}
        </span>
        <div className="min-w-0 flex-1">
          {step.label && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue">{step.label}</p>
          )}
          <p className="font-semibold leading-7 text-ink">
            <span className="sr-only">Step {n}: </span>
            {step.you}
          </p>
          {step.office.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">The office will</p>
              <ul className="mt-1 list-disc pl-5 text-sm leading-6 text-ink-soft">
                {step.office.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            {!longFee && <Meta label="Fee" value={fee} />}
            {step.time && <Meta label="Time" value={step.time} />}
            {step.who && <Meta label="Handled by" value={step.who} wide={longFee || !step.time} />}
          </dl>
          {longFee && (
            <details className="mt-3 rounded-lg bg-mist/50 px-4 py-3 text-sm">
              <summary className="cursor-pointer font-semibold text-ink">Fees for this step</summary>
              <p className="mt-2 leading-6 text-ink-soft">{fee}</p>
            </details>
          )}
        </div>
      </div>
    </li>
  );
}

function Meta({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">{label}</dt>
      <dd className="mt-0.5 leading-6 text-ink">{value}</dd>
    </div>
  );
}
