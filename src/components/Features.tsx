"use client";

import { Stethoscope, Brain, BadgePercent, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Stethoscope,
    title: "Virtual Medical Care",
    description: "Unlimited virtual visits for urgent care, primary care, and chronic condition management — for you and every member of your family.",
    outcome: "Get a prescription or care plan in minutes, not hours.",
    color: "primary",
  },
  {
    icon: Brain,
    title: "Behavioral Health",
    description: "Licensed therapists for anxiety, depression, burnout, and the unique pressures neurodivergent vet professionals carry — available on your schedule, in a space that honors how you think.",
    outcome: "Book a session this week, not next month.",
    color: "primary",
  },
  {
    icon: BadgePercent,
    title: "Negotiated Member Rates",
    description: "Because NNVA brings the community together, you get pricing you could never negotiate alone — real coverage that meets you where you are.",
    outcome: "Lock in your rate with affiliate code NNVAWELL01.",
    color: "primary",
  },
];

export function Features() {
  return (
    <section 
      id="features"
      className="section-padding bg-white"
      aria-labelledby="features-heading"
    >
      <div className="container-main">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="features-heading" className="text-3xl lg:text-4xl font-bold leading-tight text-foreground mb-4">
            Healthcare built for neurodivergent veterinary minds
          </h2>
          <p className="text-lg text-slate">
            Three pillars of care at negotiated NNVA member pricing — covering you and your household.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative bg-white border border-primary-100 rounded-2xl p-8 transition-all duration-500 hover:border-primary-200 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-6`}>
                <feature.icon className="w-7 h-7 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <div className="flex items-start gap-3 text-primary">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="font-medium">{feature.outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}