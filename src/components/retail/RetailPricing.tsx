"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Plus, Sparkles } from "lucide-react";

type Coverage = "self" | "family";

const plans = [
  {
    name: "Basic",
    selfPrice: 35,
    familyPrice: 45,
    description: "Virtual urgent care + specialist access",
    features: [
      "Virtual Urgent Care - Unlimited access to an MD for acute, non-emergent care",
      "Care Coordinators - 24/7/365 access to care coordinators",
      "Message A Specialist - Consultations with Pediatricians, Ophthalmologists, Women's Health Physicians, Sports Medicine Doctors, Nutritionists, Registered Dietitians, Fitness Coaches, Dentists, Pharmacists, and more",
    ],
    popular: false,
  },
  {
    name: "Standard",
    selfPrice: 50,
    familyPrice: 60,
    description: "Everything in Basic, plus behavioral health",
    features: [
      "All Basic features",
      "Behavioral Health Care - Master's Level Therapists, Psychologists and Psychiatrists",
    ],
    popular: false,
  },
  {
    name: "Plus",
    selfPrice: 55,
    familyPrice: 65,
    description: "Everything in Standard, plus advanced behavioral health",
    features: [
      "All Standard features",
      "Advanced Behavioral Health Care - An app with Assessment Measures (Anxiety, Depression, & Substance Use), a Mood Calendar, Voice & Written Journal Capabilities, Safety Plans, Emergency Resources, Affirmations Sharing, and more",
    ],
    popular: true,
  },
  {
    name: "Premium",
    selfPrice: 60,
    familyPrice: 75,
    description: "Everything in Plus, plus virtual primary care",
    features: [
      "All Plus features",
      "Virtual Primary Care - All of the above PLUS Unlimited VPC, Medication Management, Lab Panels, Health Risk Assessments, and Virtual Dermatology",
      "$25 co-pay with PCP visits only",
    ],
    popular: false,
  },
];

const addOns = [
  { name: "Advanced Behavioral Health Care", price: 10 },
  { name: "Silver Prescription Plan", price: 10 },
  { name: "Gold Prescription Plan", price: 15 },
  { name: "Platinum Prescription Plan", price: 20 },
];

export function RetailPricing() {
  const [coverage, setCoverage] = useState<Coverage>("self");

  return (
    <section
      id="pricing"
      className="section-padding bg-primary-50/50"
      aria-labelledby="pricing-heading"
    >
      <div className="container-main">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 id="pricing-heading" className="text-3xl lg:text-4xl font-bold leading-tight text-foreground mb-4">
            Your negotiated member pricing
          </h2>
          <p className="text-lg text-slate mb-8">
            Exclusive NNVA member rates. Choose the plan that fits you and your household — no hidden fees, no contracts, cancel anytime. Apply affiliate code <strong className="text-primary">NNVAWELL01</strong> at checkout.
          </p>

          {/* Self / Self + Family toggle */}
          <div
            className="inline-flex items-center gap-1 bg-white border border-primary-100 rounded-full p-1"
            role="radiogroup"
            aria-label="Coverage type"
          >
            {[
              { value: "self" as Coverage, label: "Self" },
              { value: "family" as Coverage, label: "Self + Family" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={coverage === option.value}
                onClick={() => setCoverage(option.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  coverage === option.value
                    ? "bg-primary text-white"
                    : "text-primary hover:bg-primary-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`group relative flex flex-col h-full p-8 rounded-3xl transition-all duration-500 ${
                plan.popular
                  ? "z-10 bg-gradient-to-b from-primary to-primary-800 text-white shadow-2xl shadow-primary/40 ring-1 ring-primary/20"
                  : "bg-white text-foreground border border-primary-100 shadow-sm opacity-95 hover:opacity-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1.5 bg-warm-bg text-primary-800 text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full shadow-lg shadow-primary/30 ring-2 ring-white/40">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-sm font-semibold mb-3 ${plan.popular ? "text-primary-100" : "text-gray-500"}`}>
                  {plan.description}
                </h3>
                <h4 className="text-2xl font-bold mb-3">{plan.name}</h4>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-6xl font-extrabold tracking-tight">
                    ${coverage === "self" ? plan.selfPrice : plan.familyPrice}
                  </span>
                  <span className={`text-sm mb-2 ${plan.popular ? "text-primary-100" : "text-gray-500"}`}>/month</span>
                </div>
              </div>

              {/* Hairline divider between header and feature list */}
              <div className={`h-px w-full mb-6 ${plan.popular ? "bg-white/20" : "bg-primary-100"}`} aria-hidden="true" />

              <ul className="space-y-4 mb-8 flex-1" role="list">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.popular ? "bg-white/15" : "bg-primary-100"
                      }`}
                      aria-hidden="true"
                    >
                      <Check className={`w-3 h-3 ${plan.popular ? "text-warm-bg" : "text-primary"}`} strokeWidth={3} />
                    </span>
                    <span className={`text-sm ${plan.popular ? "text-primary-100" : "text-gray-700"}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`w-full mt-auto ${
                  plan.popular
                    ? "bg-white text-primary-800 shadow-lg shadow-primary-800/30 hover:bg-warm-bg hover:text-primary-800"
                    : "bg-transparent text-primary border border-primary-200 shadow-none hover:bg-primary-50 hover:text-primary-800"
                }`}
                onClick={() => document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </Button>
            </article>
          ))}
        </div>

        {/* Optional Add-Ons */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Optional Add-Ons</h3>
            <p className="text-gray-600">Enhance any plan with these add-ons.</p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
            {addOns.map((addOn) => (
              <li
                key={addOn.name}
                className="flex items-center justify-between gap-4 bg-white border border-primary-100 rounded-xl p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <span className="font-medium text-foreground">{addOn.name}</span>
                </div>
                <span className="font-bold text-primary whitespace-nowrap">${addOn.price}/month</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
