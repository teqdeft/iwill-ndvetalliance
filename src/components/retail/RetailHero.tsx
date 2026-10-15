"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Stethoscope, Brain, BadgePercent, Tag } from "lucide-react";
import Image from "next/image";

const PROMO_CODE = "NNVAWELL01";

export function RetailHero() {
  return (
    <section
      className="relative section-padding overflow-hidden bg-gradient-to-b from-white via-blush-50/40 to-white"
      aria-labelledby="hero-heading"
    >
      <div className="container-main">
        <div className="lg:grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <p className="font-script text-xl lg:text-2xl text-highlight font-semibold mb-4 animate-fade-up">
              Honoring how you think, learn, and live.
            </p>
            <h1
              id="hero-heading"
              className="text-4xl lg:text-5xl xl:text-[56px] font-bold leading-[1.1] text-foreground mb-6 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              Member pricing on <span className="text-primary">your own healthcare</span>, for neurodivergent veterinary professionals
            </h1>
            <p
              className="text-lg lg:text-xl text-slate mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Through your NNVA membership, you unlock exclusive negotiated rates on virtual medical
              and behavioral healthcare for yourself and your family. Care that meets you as you are —
              so you can stop masking and start thriving.
            </p>

            {/* Affiliate code callout */}
            <div
              className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-blush-50 border-2 border-dashed border-highlight/60 rounded-2xl px-5 py-4 mb-8 animate-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              <div className="flex items-center gap-2 text-primary">
                <Tag className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm font-semibold uppercase tracking-wide">Your NNVA affiliate code</span>
              </div>
              <span className="text-2xl font-extrabold tracking-[0.15em] text-primary bg-white rounded-lg px-4 py-1.5 border border-primary-100 shadow-sm">
                {PROMO_CODE}
              </span>
            </div>

            <div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Button
                variant="accent"
                size="lg"
                className="group w-full sm:w-auto"
                onClick={() => document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BadgePercent className="w-5 h-5" aria-hidden="true" />
                Claim Your Member Rate
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-primary-200 text-primary hover:bg-primary-50 hover:text-primary-800"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See What's Included
              </Button>
            </div>

            <div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-2">
                <BadgePercent className="w-5 h-5 text-primary" aria-hidden="true" />
                <span>Negotiated member rates</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" aria-hidden="true" />
                <span>Virtual medical care</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
                <span>Behavioral health support</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <div className="relative aspect-square max-w-lg mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl bg-lavender-50">
              <Image
                src="/images/Hero_image.png"
                alt="Veterinary professional caring for a patient"
                fill
                className="object-cover relative z-10"
                priority
              />
            </div>

            <div className="absolute -bottom-6 -left-6 lg:-left-10 w-32 h-32 rounded-full bg-blush/30 animate-float-slow" aria-hidden="true" />
            <div className="absolute -top-4 -right-4 lg:-right-10 w-24 h-24 rounded-full bg-lavender-50 animate-float-slower" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
