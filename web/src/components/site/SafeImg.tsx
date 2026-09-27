import { useState, type ImgHTMLAttributes } from "react";
import { API } from "@/lib/api";

/** Resolves API-relative upload paths and shows a neutral placeholder instead of a broken-image icon. */
export function SafeImg({ src, alt = "", className, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src?: string | undefined }) {
  const [failed, setFailed] = useState(false);
  const url = src?.startsWith("/uploads/") ? `${API}${src}` : src;
  if (!url || failed) return <span className={`img-ph${className ? ` ${className}` : ""}`} role="img" aria-label={alt}>EMBROWERMENT</span>;
  return <img src={url} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />;
}
