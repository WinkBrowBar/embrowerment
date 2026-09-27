import { useEffect, useRef, useState, type ReactNode } from "react";
import { api } from "../api";

export function Page({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  useEffect(() => { document.title = `${title} — Embrowerment® Admin`; }, [title]);
  return <div className="page"><header className="page-head"><h1>{title}</h1><div className="page-actions">{actions}</div></header>{children}</div>;
}

export function Field({ label, hint, children, wide }: { label: string; hint?: string; children: ReactNode; wide?: boolean }) {
  return <label className={`field${wide ? " wide" : ""}`}><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <label className="toggle"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} /><span className="track" /><span>{label}</span></label>;
}

export function Badge({ status }: { status: string }) {
  return <span className={`badge b-${status}`}>{status}</span>;
}

type ToastT = { id: number; msg: string; kind: "ok" | "err" };
let push: (t: Omit<ToastT, "id">) => void = () => {};
export const toast = { ok: (msg: string) => push({ msg, kind: "ok" }), err: (e: unknown) => push({ msg: e instanceof Error ? e.message : String(e), kind: "err" }) };
export function Toasts() {
  const [list, setList] = useState<ToastT[]>([]);
  push = (t) => { const id = Date.now() + Math.random(); setList(l => [...l, { ...t, id }]); setTimeout(() => setList(l => l.filter(x => x.id !== id)), t.kind === "err" ? 7000 : 3500); };
  return <div className="toasts" role="status">{list.map(t => <div key={t.id} className={`toast ${t.kind}`}>{t.msg}</div>)}</div>;
}

export function Modal({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return <div className="modal-scrim" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className="modal" role="dialog" aria-label={title}><header><h2>{title}</h2><button className="icon" onClick={onClose} aria-label="Close">✕</button></header><div className="modal-body">{children}</div>{footer && <footer>{footer}</footer>}</div>
  </div>;
}

export function ImageUpload({ value, onChange, multiple }: { value: string[]; onChange: (v: string[]) => void; multiple?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const upload = async (files: FileList | null) => {
    if (!files?.length) return; setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) { const fd = new FormData(); fd.append("file", f); urls.push((await api("/admin/upload", { form: fd })).url); }
      onChange(multiple ? [...value, ...urls] : urls.slice(0, 1));
    } catch (e) { toast.err(e); } finally { setBusy(false); if (ref.current) ref.current.value = ""; }
  };
  return <div className="images">
    {value.map((u, i) => <div className="thumb" key={u + i}><img src={u} alt="" />
      <div className="thumb-actions">{multiple && i > 0 && <button type="button" onClick={() => { const v = [...value]; [v[i - 1], v[i]] = [v[i], v[i - 1]]; onChange(v); }} title="Move left">←</button>}
        <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} title="Remove">✕</button></div></div>)}
    {(multiple || value.length === 0) && <button type="button" className="thumb add" onClick={() => ref.current?.click()} disabled={busy}>{busy ? "Uploading…" : "+ Upload"}</button>}
    <input ref={ref} type="file" accept="image/*" multiple={multiple} hidden onChange={e => upload(e.target.files)} />
  </div>;
}

export function Empty({ children }: { children: ReactNode }) { return <div className="empty">{children}</div>; }

export function useLoad<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [n, setN] = useState(0);
  useEffect(() => { let live = true; setError(null); fn().then(d => live && setData(d)).catch(e => live && setError(e.message)); return () => { live = false; }; }, [...deps, n]); // eslint-disable-line react-hooks/exhaustive-deps
  return { data, error, reload: () => setN(x => x + 1) };
}
