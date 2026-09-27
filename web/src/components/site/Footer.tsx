import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { LINKS } from "./data";

export function Subscribe({ light = true }: { light?: boolean }) {
  const [done, setDone] = useState(false);
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setDone(true); };
  return done ? <p className="sub-form sub-done">Thank you!</p> :
    <form className="sub-form" onSubmit={onSubmit}>
      <input type="email" required placeholder="Email Address" aria-label="Email Address" />
      <button type="submit" className={`btn-mono${light ? " light" : ""}`}>Sign Up</button>
    </form>;
}

export function Footer() {
  return <footer className="ftr">
    <div className="ftr-grid">
      <div>
        <h4>Subscribe</h4>
        <p>Sign up with your email address to receive news and updates.</p>
        <Subscribe />
        <p className="sub-note">We respect your privacy.</p>
      </div>
      <div><h4>Orders &amp; Support</h4><ul className="gap"><li><Link to="/pmu-policies">PMU Policies</Link></li><li><Link to="/returns">Returns</Link></li></ul></div>
      <div><h4>Embrowerment®</h4><ul><li><a href={LINKS.winkBrowBar} target="_blank" rel="noreferrer">Wink Brow Bar</a></li><li><a href={LINKS.umbreen} target="_blank" rel="noreferrer">Umbreen</a></li><li>Foundation</li></ul></div>
      <div><h4>Follow</h4><ul><li><a href={LINKS.instagram} target="_blank" rel="noreferrer">INSTAGRAM</a></li><li><a href={LINKS.tiktok}>TIKTOK</a></li><li>FACEBOOK</li></ul></div>
    </div>
    <svg className="ftr-mark" viewBox="0 0 1000 90" aria-hidden="true"><text x="0" y="89" fontSize="122" fill="currentColor" textLength="1000" lengthAdjust="spacing">EMBROWERMENT</text></svg>
    <div className="ftr-legal"><span>© {new Date().getFullYear()} Embrowerment®. All rights reserved.</span><span>Confidence begins in the eye zone.</span></div>
  </footer>;
}
