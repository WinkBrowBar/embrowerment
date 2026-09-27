import { IMG } from "./data";
import { More } from "./ui";

export function Hero() {
  return <section className="hero">
    <div className="hero-text reveal">
      <h1 className="h-display">Confidence begins in the eye zone</h1>
      <div className="hero-sub"><strong>Embrowerment®</strong><span>A method for brows - a mindset for life</span></div>
      <More href="/method">Learn more</More>
    </div>
    <div className="hero-img"><img src={IMG.hero} alt="Two people standing back to back against a sunlit wall" fetchPriority="high" /></div>
  </section>;
}
