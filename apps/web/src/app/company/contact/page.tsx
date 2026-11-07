import { Metadata } from "next";
import {
  ContactUsHeroSection,
  ContactUsFormSection,
  ContactUsFaqSection,
} from "@/components/landing/contact-us";

export const metadata: Metadata = {
  title: "Contact TinkerVoice — Book a Demo or Send an Enquiry",
  description:
    "Book a TinkerVoice demo or contact the team about pricing, implementation, and support for your calling workflow.",
  keywords:
    "contact TinkerVoice, voice technology support, AI voice agents contact, business consultation, voice automation support",
  authors: [{ name: "TinkerVoice Team" }],
  creator: "TinkerVoice",
  publisher: "TinkerVoice",
  robots: "index, follow",
  openGraph: {
    title: "Contact TinkerVoice",
    description:
      "Book a demo or send the TinkerVoice team an enquiry about your calling workflow.",
    type: "website",
    url: "https://tinkervoice.co/company/contact",
    siteName: "TinkerVoice",
    images: [
      {
        url: "/images/analytics-dashboard.png",
        width: 1200,
        height: 630,
        alt: "TinkerVoice AI-powered voice automation contact page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact TinkerVoice",
    description:
      "Book a demo or send the TinkerVoice team an enquiry about your calling workflow.",
    images: ["/images/analytics-dashboard.png"],
  },
  alternates: {
    canonical: "https://tinkervoice.co/company/contact",
  },
};

export default function ContactUsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Us - TinkerVoice",
    description:
      "Book a demo or contact the TinkerVoice team about your calling workflow.",
    url: "https://tinkervoice.co/company/contact",
    mainEntity: {
      "@type": "Organization",
      name: "TinkerVoice",
      description: "Voice agent software for business calling workflows",
      url: "https://tinkervoice.co",
      logo: "https://tinkervoice.co/logo.svg",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        url: "https://tinkervoice.co/company/contact",
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ContactUsHeroSection />
      <ContactUsFormSection />
      <ContactUsFaqSection />
    </div>
  );
}
