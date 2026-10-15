"use client";

import { Shield, Lock, Users, HeartHandshake } from "lucide-react";

const trustBadges = [
  { icon: Shield, label: "HIPAA Compliant" },
  { icon: Lock, label: "Secure & Private" },
  { icon: Users, label: "Licensed Providers" },
  { icon: HeartHandshake, label: "Neurodivergent-Affirming Care" },
];

export function TrustBadges() {
  return (
    <section
      className="py-8 bg-blush-50/50 border-y border-primary-100"
      aria-label="Trust badges"
    >
      <div className="container-main">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {trustBadges.map((badge) => (
            <div 
              key={badge.label} 
              className="flex items-center gap-3 text-gray-600"
            >
              <badge.icon className="w-6 h-6 text-primary flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}