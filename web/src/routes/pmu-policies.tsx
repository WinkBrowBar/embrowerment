import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PageHero, CONCIERGE } from "@/components/site";

export const Route = createFileRoute("/pmu-policies")({
  head: () => ({ meta: [
    { title: "PMU Policies — Embrowerment®" },
    { name: "description", content: "Embrowerment® permanent makeup policies: cancellation, rescheduling, no-show, payment, CareCredit, refunds and follow-ups." },
  ] }),
  component: Policies,
});

const mail = <a href={`mailto:${CONCIERGE.email}`}>{CONCIERGE.email}</a>;

const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  { id: "cancellation", title: "Cancellation & Rescheduling", body: <>
    <p>Appointments may be canceled or rescheduled no later than 48 hours prior to the scheduled start time. Cancellations or reschedule requests made within 48 hours of the appointment, including same-day changes, are considered late cancellations and will result in the full session fee being charged.</p>
    <p>For Follow up appointments, these may no longer be free if you miss or cancel an appointment within 48 hours and may become chargeable at $350 plus tax per missed session.</p></> },
  { id: "no-show", title: "No-Show Policy", body: <p>Failure to attend a scheduled appointment without notice will be considered a no-show. No-show appointments are non-refundable and will be charged in full.</p> },
  { id: "fees", title: "Fees & Payments", body: <p>All services, consultations, and sessions are reserved exclusively for the scheduled client and time. By booking, the client acknowledges that missed or late-canceled appointments result in lost availability and cannot be reassigned.</p> },
  { id: "chargeback", title: "Chargeback & Dispute Acknowledgment", body: <>
    <p>By booking an appointment, the client expressly agrees to the following:</p>
    <ul><li>The client understands and agrees to the cancellation, rescheduling, and no-show policy outlined above.</li>
      <li>The client authorizes the service provider to charge the payment method on file for late cancellations or no-show appointments.</li>
      <li>The client agrees not to initiate a chargeback, payment dispute, or bank reversal for any charges that comply with these policies.</li></ul></> },
  { id: "payment", title: "Payment", body: <p>To secure an appointment, a complete payment is required no later than 72 hours prior to booking.</p> },
  { id: "carecredit", title: "CareCredit", body: <>
    <p>We accept CareCredit for any amount over $400 excluding tax, in the 6-month interest-free program. Gratuity is not accepted on CareCredit.</p>
    <p>To pay by CareCredit, please contact us.</p></> },
  { id: "refunds", title: "Refunds", body: <><h3>First Service</h3><p>Full refund if cancelled before 48 hours of appointment time with written confirmation of cancellation to {mail}.</p></> },
  { id: "touchup", title: "Free Touchup Service", body: <>
    <p>Must be completed within 6 weeks of first appointment to be eligible for the free follow up. Accommodations on dates after the 6 week time can be made if agreed at the time of booking your first service.</p>
    <p>Late cancellations, no shows and late reschedules forfeit the Free Follow Up.</p>
    <p>Follow Ups are normally charged at $350 per service.</p></> },
  { id: "day-of", title: "The day of the appointment", body: <><p>Please arrive at your scheduled time.</p><p>Arrival later than 10 min after your appointment time may have a late reschedule policy applied.</p></> },
  { id: "outside-hours", title: "Appointments outside studio hours", body: <>
    <p>On occasion we accept appointments outside of studio hours. These are subject to additional charges for the studio.</p>
    <p>If you wish to book, please email {mail} with your requested time for more information.</p></> },
];

function Policies() {
  return <>
    <PageHero title="PMU Policies." kicker="Orders & Support">
      <p>The <b>Embrowerment® Concierge</b> is available Monday - Sunday 2-7pm · <a href={`tel:${CONCIERGE.tel}`}>{CONCIERGE.phone}</a> · {mail}</p>
    </PageHero>
    <div className="doc">
      <aside className="doc-toc"><ol>{SECTIONS.map((s, i) => <li key={s.id}><a href={`#${s.id}`}><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</a></li>)}</ol></aside>
      <div className="doc-body">{SECTIONS.map((s, i) => <section id={s.id} key={s.id}><h2><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</h2>{s.body}</section>)}</div>
    </div>
  </>;
}
