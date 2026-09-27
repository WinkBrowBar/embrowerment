import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHero, Ph, SmartLink, IMG } from "@/components/site";

export const Route = createFileRoute("/method")({
  head: () => ({ meta: [
    { title: "The Method — Embrowerment®" },
    { name: "description", content: "Explore Embrowerment® services." },
  ] }),
  component: MethodPage,
});

const INCLUDED = ["Initial Consultation", "Brainstorming Session", "Collaborative Planning", "Customized Deliverables", "Multiple Feedback Rounds", "Actionable Recommendations", "Post-Project Support"];
const TIERS = [
  { level: "Basic Service", name: "The Atlas Project", img: IMG.studio[0] },
  { level: "Intermediate Service", name: "The Echo Project", img: IMG.studio[1] },
  { level: "Advanced Service", name: "The Brightline Project", img: IMG.studio[2], recommended: true },
];

function MethodPage() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  return <>
    <PageHero title="Explore Our Services" image={IMG.pmu[2]} alt="Black and white side profile portrait">
      <SmartLink href="#inquire" className="btn-solid">Inquire Now</SmartLink>
    </PageHero>

    <section className="feat">
      <div className="feat-head wide reveal"><h2 className="h-display">What We Offer</h2></div>
      <div className="tiers">
        {TIERS.map(t => <article className={`tier reveal${t.recommended ? " rec" : ""}`} key={t.name}>
          <Ph src={t.img} alt="" />
          <div className="tier-body">
            <div className="tier-top"><h4 className="eyebrow">{t.level}</h4>{t.recommended && <span className="badge">Recommended</span>}</div>
            <SmartLink href="#inquire" className="tier-name">{t.name} <span aria-hidden="true">→</span></SmartLink>
            <p className="eyebrow">Included</p>
            <ul>{INCLUDED.map(p => <li key={p}>{p}</li>)}</ul>
          </div>
        </article>)}
      </div>
    </section>

    <section className="quote-band reveal"><blockquote><p>“Their attention to detail and commitment to quality truly stood out. We've already recommended them to others.”</p><cite>– Former Customer</cite></blockquote></section>

    <section className="feat split" id="inquire">
      <div className="reveal"><h3 className="h-display">Get In Touch</h3><p className="lede">If you're interested in working with us, complete the form with a few details about your project. We'll review your message and get back to you within 48 hours.</p></div>
      {sent ? <p className="form-done">Thank you!</p> :
        <form className="form" onSubmit={onSubmit}>
          <label>Name<input required name="name" autoComplete="name" /></label>
          <label>Email<input required type="email" name="email" autoComplete="email" /></label>
          <label>Message<textarea name="message" rows={5} /></label>
          <button className="btn-solid" type="submit">Submit</button>
        </form>}
    </section>
  </>;
}
