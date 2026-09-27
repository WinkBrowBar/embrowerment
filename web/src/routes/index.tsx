import { createFileRoute } from "@tanstack/react-router";
import { api, type Product } from "@/lib/api";
import { Hero, Definition, Method, PermanentMakeup, Products, Academy, AboutUmbreen } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Embrowerment® — Confidence begins in the eye zone" },
    { name: "description", content: "Embrowerment® — a method for brows, a mindset for life. The Method, permanent makeup, products and academy by Umbreen Sheikh." },
    { property: "og:title", content: "Embrowerment®" },
    { property: "og:description", content: "Confidence begins in the eye zone. A method for brows - a mindset for life." },
    { property: "og:image", content: "/images/hero.webp" },
  ] }),
  loader: () => api<{ products: Product[] }>("/products").then(d => d.products).catch(() => [] as Product[]),
  component: Index,
});

function Index() {
  const products = Route.useLoaderData();
  return <>
    <Hero />
    <Definition />
    <Method />
    <PermanentMakeup />
    <Products products={products} />
    <Academy />
    <AboutUmbreen />
  </>;
}
