import type { Metadata, Viewport } from "next";
import { Work_Sans, Poppins } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "iWILL 'til I'm Well × NNVA | Honoring how you think, learn, and live.",
  description:
    "In partnership with the National Neurodivergent Veterinary Alliance (NNVA). Negotiated member pricing on virtual medical and behavioral healthcare for neurodivergent veterinary professionals — care that honors how you think, learn, and live.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${workSans.variable} ${poppins.variable} h-full antialiased`}
    >
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to
          <body> before React loads; ignore those attribute-only mismatches here. */}
      <body className="min-h-screen flex flex-col bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
