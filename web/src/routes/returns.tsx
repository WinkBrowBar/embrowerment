import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PageHero, CONCIERGE } from "@/components/site";

export const Route = createFileRoute("/returns")({
  head: () => ({ meta: [
    { title: "Returns — Embrowerment®" },
    { name: "description", content: "Embrowerment® returns and exchanges for product orders." },
  ] }),
  component: Returns,
});

const mail = <a href={`mailto:${CONCIERGE.email}?subject=Return%20request`}>{CONCIERGE.email}</a>;
// TODO(client): replace every [placeholder] with the actual Embrowerment® returns terms before launch.
const TBD = ({ children }: { children: ReactNode }) => <p className="tbd">{children}</p>;

const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  { id: "eligibility", title: "Eligibility", body: <TBD>[Return window — e.g. number of days from delivery — and condition requirements for returned products.]</TBD> },
  { id: "non-returnable", title: "Non-returnable items", body: <TBD>[Items that cannot be returned, e.g. opened skincare or used tools, for hygiene reasons.]</TBD> },
  { id: "how-to", title: "How to start a return", body: <p>Email {mail} with your order number and the item(s) you would like to return. The Embrowerment® Concierge is available {CONCIERGE.hours}.</p> },
  { id: "refunds", title: "Refunds", body: <TBD>[How and when refunds are issued, to which payment method, and whether shipping costs are refunded.]</TBD> },
  { id: "exchanges", title: "Exchanges & damaged items", body: <TBD>[Process for exchanges, and for items that arrive damaged or incorrect.]</TBD> },
  { id: "services", title: "Services", body: <p>Permanent makeup services, consultations and follow ups are covered by our <a href="/pmu-policies">PMU Policies</a>, not this returns policy.</p> },
];

function Returns() {
  return <>
    <PageHero title="Returns." kicker="Orders & Support">
      <p>Questions about an order? Contact the <b>Embrowerment® Concierge</b> · <a href={`tel:${CONCIERGE.tel}`}>{CONCIERGE.phone}</a> · {mail}</p>
    </PageHero>
    <div className="doc">
      <aside className="doc-toc"><ol>{SECTIONS.map((s, i) => <li key={s.id}><a href={`#${s.id}`}><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</a></li>)}</ol></aside>
      <div className="doc-body">{SECTIONS.map((s, i) => <section id={s.id} key={s.id}><h2><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</h2>{s.body}</section>)}</div>
    </div>
  </>;
}
