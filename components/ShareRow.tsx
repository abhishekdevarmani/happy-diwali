"use client";

import { useEffect, useState } from "react";
import { Copy, Link2, MessageCircle } from "lucide-react";
import { copyText, whatsappUrl, withLink } from "@/lib/share";

export default function ShareRow({
  text,
  onToast,
}: {
  text: string;
  onToast: (message: string) => void;
}) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const full = withLink(text, origin);

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <a
        href={whatsappUrl(full)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-wa col-span-2"
      >
        <MessageCircle size={20} aria-hidden="true" /> SHARE ON WHATSAPP
      </a>
      <button
        type="button"
        className="btn btn-glass"
        onClick={async () => {
          const ok = await copyText(full);
          onToast(ok ? "Copied! Now go spread some Diwali happiness 😂🪔" : "Couldn't copy — try long-pressing the text instead.");
        }}
      >
        <Copy size={18} aria-hidden="true" /> COPY WISH
      </button>
      <button
        type="button"
        className="btn btn-glass"
        onClick={async () => {
          const ok = await copyText(`${window.location.origin}/`);
          onToast(ok ? "Link copied. Your Diwali marketing campaign has begun. 😂" : "Couldn't copy the link — long-press the address bar instead.");
        }}
      >
        <Link2 size={18} aria-hidden="true" /> COPY WEBSITE LINK
      </button>
    </div>
  );
}
