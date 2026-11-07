"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Play, BookOpen, Mic } from "lucide-react";

const resources = [
  {
    type: "Case Study",
    title: "Streamlining Customer Interaction: Jar's Success Story with TinkerVoice on WhatsApp Business",
    description: "Discover how Jar transformed their customer interaction process and achieved remarkable results using AI-powered educational assistants.",
    icon: FileText,
    link: "#",
    category: "Case Studies"
  },
  {
    type: "Podcast",
    title: "S2E07 – Personalisation at Scale in Customer Support – Arun Jagannathan, CrackVerbal",
    description: "Listen to industry experts discuss how AI and voice technology are reshaping the education landscape and personalized learning experiences.",
    icon: Mic,
    link: "#",
    category: "Podcasts"
  },
  {
    type: "eBook",
    title: "How Voice AI is Revolutionising Travel & Hospitality",
    description: "Learn everything you need to know about implementing conversational AI in your educational institution, from setup to optimization strategies.",
    icon: BookOpen,
    link: "#",
    category: "eBooks"
  },
  {
    type: "Webinar",
    title: "Why Customer Support Today is All About Self-Service",
    description: "Watch our comprehensive webinar on how AI-powered customer support can transform your educational business and drive sustainable growth.",
    icon: Play,
    link: "#",
    category: "Webinars"
  }
];

export function EducationResourcesSection() {
  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            What is cooking in TinkerVoice?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Gain insights on how we are helping educational institutions improve their efficiency and productivity.
          </p>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Category Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                {resource.category}
              </div>

              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <resource.icon className="h-6 w-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-300">
                {resource.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {resource.description}
              </p>

              {/* CTA */}
              <div className="flex items-center text-primary font-semibold group-hover:underline">
                {resource.type === "Case Study" && "READ MORE"}
                {resource.type === "Podcast" && "LISTEN NOW"}
                {resource.type === "eBook" && "READ MORE"}
                {resource.type === "Webinar" && "WATCH NOW"}
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
