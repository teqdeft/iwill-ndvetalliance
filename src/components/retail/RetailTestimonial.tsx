"use client";

import { Quote, Users } from "lucide-react";

export function RetailTestimonial() {
  return (
    <section
      className="section-padding bg-white"
      aria-labelledby="testimonial-heading"
    >
      <div className="container-main">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" aria-hidden="true" />
              <span>From NNVA members</span>
            </div>
          </div>

          {/* DRAFT PLACEHOLDER */}
          <article className="bg-blush-50 rounded-2xl p-8 md:p-12 relative">
            <Quote className="w-12 h-12 text-highlight absolute top-6 left-6" aria-hidden="true" />

            <blockquote className="relative z-10">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                &ldquo;For years I masked just to get through the day, and finding care that
                understood me felt impossible. Through my NNVA membership I finally have real
                coverage for me and my family — in a space that honors how I think and work.&rdquo;
              </p>

              <footer className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-highlight flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <cite className="not-italic font-semibold text-foreground block">
                    Member testimonial
                  </cite>
                  <span className="text-sm text-gray-500">
                    Neurodivergent veterinary professional, NNVA member
                  </span>
                </div>
              </footer>
            </blockquote>
          </article>
        </div>
      </div>
    </section>
  );
}
