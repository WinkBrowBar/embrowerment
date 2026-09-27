import { IMG, LINKS } from "./data";
import { More, Ph, SmartLink } from "./ui";
import { ProductCollage } from "./ProductCollage";
import type { Product } from "@/lib/api";

export function Method() {
  return <section className="method" id="method">
    <Ph src={IMG.method} alt="Model framing her face with raised arms in soft sunlight" />
    <div className="method-body reveal">
      <h2 className="h-display">The Method.</h2>
      <div className="feat-copy">
        <p>A structured, science-led approach to the eye zone. Every brow is mapped to bone structure, growth pattern and facial balance before a single hair is touched, then managed over time so the shape stays yours.</p>
        <More href={LINKS.method}>Learn more</More>
      </div>
    </div>
  </section>;
}

export function PermanentMakeup() {
  return <section className="feat" id="permanent-makeup">
    <div className="feat-head reveal">
      <h2 className="h-display">Permanent makeup.</h2>
      <div className="feat-copy">
        <p>Semi-permanent brow work designed with the same precision as the method: measured, conservative, and built to age well with your face rather than follow a trend.</p>
        <More href={LINKS.pmu}>Learn more</More>
      </div>
    </div>
    <div className="grid-3">
      <Ph src={IMG.pmu[0]} alt="Black and white silhouette behind sheer mesh" />
      <Ph src={IMG.pmu[1]} alt="Black and white motion-blurred portrait" />
      <Ph src={IMG.pmu[2]} alt="Black and white side profile portrait of a woman" />
    </div>
  </section>;
}

export function Products({ products = [] }: { products?: Product[] }) {
  return <section className="feat" id="products">
    <div className="feat-head reveal">
      <h2 className="h-display">Products.</h2>
      <div className="feat-copy">
        <p>Professional-grade tools and formulas developed around the eye zone — sculpting pencils, precision instruments, serums and care, made to extend the method beyond the chair.</p>
        <More href="/shop">Shop all</More>
      </div>
    </div>
    <div className="collection"><img src={IMG.collection} alt="Embrowerment® product collection" loading="lazy" /></div>
    {products.length ? <ProductCollage products={products} /> : <div className="shop-row">
      <Ph src={IMG.products1} alt="Woman with a glowing natural makeup look against a blue sky" />
      <div className="card">
        <Ph src={IMG.kit} alt="Embrowerment Pro Precision kit: tweezers, scissors, brow tool and spoolie" />
        <div className="card-meta">
          <div><h3>The Essential Embrowerment® Kit</h3><p>For professionals who desire precision Artistry</p></div>
          <span className="card-price">$80</span>
        </div>
        <SmartLink href="/shop/pro-essentials-kit" className="btn-mono">Buy</SmartLink>
      </div>
      <Ph src={IMG.products3} alt="Man in a coffee shop photographed through glass" />
    </div>}
  </section>;
}

export function Academy() {
  return <section className="feat" id="academy">
    <div className="feat-head reveal">
      <h2 className="h-display">Academy.</h2>
      <div className="feat-copy">
        <p>Education for beauty professionals who want the science behind the shape. Courses translate anatomy and growth behavior into technique you can use from your next client onward.</p>
        <More href="/academy">See Courses</More>
      </div>
    </div>
    <div className="academy">
      <Ph className="tall" src={IMG.academy} alt="Close-up of an eye and a defined brow" />
      <Ph className="wide" src={IMG.studio[0]} alt="Hands working with material samples on a wooden table" />
      <div className="academy-pair">
        <Ph src={IMG.studio[1]} alt="Globe lamp and swatches on a dark console" />
        <Ph src={IMG.studio[2]} alt="Notebook and swatches on a burl wood desk" />
      </div>
    </div>
  </section>;
}

export function AboutUmbreen() {
  return <section className="about" id="about-umbreen">
    <div className="about-copy reveal">
      <h2 className="h-display">About Umbreen.</h2>
      <p>Embrowerment® was created by Umbreen Sheikh, a biomedical scientist, entrepreneur, and the creator of The Embrowerment Method®. Guided by the belief that confidence begins in the eye zone, she combines science, artistry, and education to help people look and feel more like themselves. Through Embrowerment, her mission is to transform not only brows, but confidence itself.</p>
      <More href={LINKS.umbreen}>Meet Umbreen</More>
    </div>
    <div className="about-imgs">
      <Ph className="main" src={IMG.umbreen} alt="Umbreen Sheikh in a black suit, black and white portrait" />
    </div>
  </section>;
}
