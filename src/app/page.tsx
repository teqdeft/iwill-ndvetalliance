import { RetailAnnouncementBar } from "@/components/retail/RetailAnnouncementBar";
import { RetailHeader } from "@/components/retail/RetailHeader";
import { RetailHero } from "@/components/retail/RetailHero";
import { TrustBadges } from "@/components/TrustBadges";
import { Features } from "@/components/Features";
import { RetailPricing } from "@/components/retail/RetailPricing";
import { RetailTestimonial } from "@/components/retail/RetailTestimonial";
import { RetailFAQ } from "@/components/retail/RetailFAQ";
import { NewsletterForm } from "@/components/retail/NewsletterForm";
import { RetailFooter } from "@/components/retail/RetailFooter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <RetailAnnouncementBar />
      <RetailHeader />
      <main className="flex-1">
        <RetailHero />
        <TrustBadges />
        <Features />
        <NewsletterForm />
        <RetailPricing />
        <RetailTestimonial />
        <RetailFAQ />
      </main>
      <RetailFooter />
    </div>
  );
}
