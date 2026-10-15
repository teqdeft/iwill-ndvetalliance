"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function RetailAnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-primary w-full">
      <div className="container-main flex items-center justify-center gap-3 py-2.5 pr-10 md:pr-8">
        <span className="text-center text-xs md:text-sm font-medium text-white text-balance">
          NNVA members: unlock negotiated healthcare pricing with affiliate code{" "}
          <strong className="tracking-wide">NNVAWELL01</strong>.
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-colors text-white"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
