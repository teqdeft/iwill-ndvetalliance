"use client";

import { useState } from "react";
import { ChevronDown, Shield, HeartPulse, Users, Tag } from "lucide-react";

const faqs = [
  {
    question: "Who is this membership for?",
    answer:
      "It's exclusively for NNVA members — neurodivergent veterinary professionals across the veterinary team. Because NNVA brings the community together, you get negotiated rates on virtual medical and behavioral healthcare that you couldn't access alone, in a space built to honor how you think, learn, and live.",
    icon: Users,
  },
  {
    question: "How much does it cost and are there hidden fees?",
    answer:
      "Member plans start at $35/month for Basic and go up to $60/month for Premium. There are no hidden fees and no contracts — you pay the monthly rate and can cancel anytime. Premium includes Virtual Primary Care with a $25 co-pay on PCP visits only.",
    icon: Shield,
  },
  {
    question: "How do I use my affiliate code?",
    answer:
      "Enter your NNVA affiliate code NNVAWELL01 to unlock member pricing. Submit your details in the form on this page and your code is applied automatically, so your negotiated rate is locked in from the start.",
    icon: Tag,
  },
  {
    question: "I already have some coverage — why would I need this?",
    answer:
      "This is a complement, not a replacement. It gives you low-cost virtual visits for things that are otherwise expensive or slow — urgent care, prescription refills, and neurodivergent-affirming behavioral health support — available on your schedule, for you and your family.",
    icon: HeartPulse,
  },
];

export function RetailFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="section-padding bg-white"
      aria-labelledby="faq-heading"
    >
      <div className="container-main">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="faq-heading" className="text-3xl lg:text-4xl font-bold leading-tight text-foreground mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-gray-600">
            The things people ask before getting started.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group bg-white border border-primary-100 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary-200 hover:shadow-lg hover:shadow-primary/10"
              open={openIndex === index}
            >
              <summary
                className="flex items-center justify-between p-6 cursor-pointer list-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenIndex(openIndex === index ? null : index);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <faq.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground pr-10">{faq.question}</h3>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-300 group-open:rotate-180 flex-shrink-0" aria-hidden="true" />
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#claim-form"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 h-11 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:bg-accent/90 hover:shadow-accent/40"
          >
            <Tag className="w-5 h-5" aria-hidden="true" />
            Claim Your Member Rate
          </a>
        </div>
      </div>
    </section>
  );
}
