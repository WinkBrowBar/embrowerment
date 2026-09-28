import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Ph, Accordion, Concierge, SmartLink, IMG, LINKS } from "@/components/site";

export const Route = createFileRoute("/permanent-makeup")({
  head: () => ({ meta: [
    { title: "Permanent Makeup — Embrowerment®" },
    { name: "description", content: "Embrowerment® Advanced Semi-Permanent Makeup: nanoblading, microshading, ombre and hybrid brows, and eyeliner. Consultations personally conducted by Umbreen." },
  ] }),
  component: PMU,
});

type Row = [name: string, desc: string, price: string];
const FOLLOW: Row = ["FOLLOW UP", "Included for free with any of the initial brow services when booked six (6) weeks after initial appointment", "$350"];
const BROWS: Row[] = [
  ["Nanoblading", "Cutting-edge technique. Precision hair-like strokes", "$950"],
  ["Microshading / Combo Brows", "Combines hair-like strokes with powder-like shading", "$950"],
  ["Ombre / Powder Brows", "Gives the effect of makeup colored in brows", "$950"],
  ["Hybrid Brows", "Custom technique mixing any of the other brow services", "$1000"],
  ["Microblading", "Hair-like strokes", "$900"],
  FOLLOW,
];
const EYES: Row[] = [
  ["Classic Eyeliner Winged", "Replaces the need to wear eyeliner every day", "$900"],
  ["Lash Line Enhancement No Wing", "Make your lashes appear fuller and fill in gaps", "$900"],
  FOLLOW,
];
const POST: Row[] = [
  ["Annual", "9-15 months after your follow-up appointment", "$600"],
  ["AFTER 15 MONTHS", "Any appointment made after the 15 month time frame is considered a new service.", ""],
];

function PriceList({ title, rows }: { title: string; rows: Row[] }) {
  return <div className="plist reveal">
    <h3>{title}</h3>
    <ul>{rows.map(([n, d, p]) => <li key={n + d}><div><b>{n}</b><span>{d}</span></div>{p && <em>{p}</em>}</li>)}</ul>
  </div>;
}

function PMU() {
  const book = <SmartLink href={LINKS.consult} className="btn-solid">Book a Consultation</SmartLink>;
  const lookbook = <SmartLink href={LINKS.lookbook} className="btn-mono">View the Lookbook</SmartLink>;
  return <>
    <PageHero title="permanent makeup" image={IMG.products1} alt="Woman with a glowing natural makeup look">
      <div className="row">{book}{lookbook}</div>
      <p>Consultations are personally conducted by Umbreen at no- charge and are designed solely to assess candidacy, suitability, and long-term outcomes. If you are booked following consultation and approval, the service is performed by certified and vetted artists who are certified in the Embrowerment® Method.</p>
    </PageHero>

    <section className="method">
      <Ph src={IMG.method} alt="Model portrait in natural light" />
      <div className="method-body reveal">
        <h3 className="eyebrow">LOVED BY 100'S OF CLIENTS</h3>
        <h3 className="h-display">NEXT GEN: YOUR BEST BROWS</h3>
        <div className="feat-copy">
          <p><b>Our Embrowerment® Advanced Semi-Permanent Makeup Method is the next generation in creating perfectly balanced, full &amp; natural looking brows that last years.</b></p>
          {book}
        </div>
      </div>
    </section>

    <section className="feat">
      <div className="feat-head wide reveal"><h2 className="h-display">Pricing</h2></div>
      <div className="plist-grid">
        <PriceList title="BROWS" rows={BROWS} />
        <PriceList title="Eyes" rows={EYES} />
      </div>
    </section>

    <section className="feat split dark">
      <div className="reveal"><h2 className="h-display">FAQ</h2></div>
      <Accordion items={[
        { q: "What is nanoblading", a: <p>The most innovative procedure in the Semi-Permanent Makeup family. Similar to Microblading, Nanoblading utilizes a much smaller needle than Microblading which improves precision to produce even more natural looking hair like stroke results.</p> },
        { q: "How long does it take", a: <p>The first session is estimated to last 2.5hrs.<br />Follow up sessions are 2 hrs.</p> },
      ]} />
    </section>

    <section className="feat">
      <div className="feat-head wide reveal"><h2 className="h-display">PRICING</h2></div>
      <div className="plist-grid"><PriceList title="Post Follow-Up" rows={POST} /></div>
    </section>

    <Concierge title="Embrowerment® Concierge" quoteTitle="Contact us" quote={{ text: "My brows were custom mapped to align with my face and bone structure, the brow color was matched to my liking. The results were impeccable and I was on a zoom call later the same day.", by: "PMU Client" }} />

    <section className="feat">
      <div className="feat-head reveal"><h3 className="h-display">We have years of experience in all skin tones and types</h3>
        <div className="feat-copy"><p>See healed results across skin tones, types and techniques.</p><SmartLink href={LINKS.lookbook} className="more">View the Lookbook <span aria-hidden="true">→</span></SmartLink></div></div>
      <div className="grid-3">
        <Ph src={IMG.pmu[0]} alt="Black and white silhouette behind sheer mesh" />
        <Ph src={IMG.pmu[1]} alt="Black and white motion-blurred portrait" />
        <Ph src={IMG.pmu[2]} alt="Black and white side profile portrait of a woman" />
      </div>
    </section>
  </>;
}