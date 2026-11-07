"use client";

import { motion } from "framer-motion";
import { Star, Quote, GraduationCap, Users, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Siraj Patel",
    role: "CTO",
    company: "ADIB",
    content: "ChatBanking is a step in the direction of ADIB's overall vision of ensuring customers can bank anywhere, anytime, in the language of their choice without any hassles.",
    rating: 5,
    metrics: {
      icon: GraduationCap,
      value: "85%",
      label: "Student Engagement"
    }
  },
  {
    name: "Fady Jabrah",
    role: "Customer Experience Manager",
    company: "Flyin",
    content: "Of course, the first response time has improved. So have the handling time for chats. I also have more visibility of all interactions between agents and customers.",
    rating: 5,
    metrics: {
      icon: Users,
      value: "60%",
      label: "Faster Response Time"
    }
  },
  {
    name: "Anuj Sharma",
    role: "Product Manager",
    company: "Nykaa",
    content: "More and more customers prefer self-serve over calls to agents. We have been collaborating with TinkerVoice to drive this mission and have come a long way.",
    rating: 5,
    metrics: {
      icon: TrendingUp,
      value: "3x",
      label: "Self-Service Adoption"
    }
  },
  {
    name: "Suryanarayanan N",
    role: "Vice President, Marketing and Growth",
    company: "EduTech Solutions",
    content: "TinkerVoice stood out to us for its user-friendly interface, seamless integrations, and direct WhatsApp business service. We have also utilised their AI future to train the solution with frequently asked questions and relevant answers.",
    rating: 5,
    metrics: {
      icon: GraduationCap,
      value: "40%",
      label: "Admission Conversion"
    }
  },
  {
    name: "Alok Sulakhe",
    role: "Team Lead",
    company: "Ninjacart",
    content: "This feature is a great add-on to the tool. The value it brings in terms of time-saving and effective writing is simply amazing and super helpful. With this feature, we were able to save time and increase productivity.",
    rating: 5,
    metrics: {
      icon: Users,
      value: "30%",
      label: "Cost Reduction"
    }
  },
  {
    name: "Anika Wadhera",
    role: "Head - Marketing",
    company: "Sirona",
    content: "With the help of team TinkerVoice, we were able to create India's first Period Tracker on WhatsApp. It was a challenging ask as the platform had never been used to offer such a service before. However, the team took up the brief openly, worked through the challenges and delivered an efficient service.",
    rating: 5,
    metrics: {
      icon: TrendingUp,
      value: "2.5x",
      label: "Parent Engagement"
    }
  }
];

export function EducationTestimonialsSection() {
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
            Driving Support Efficiency for 500+ Brands Globally
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="h-8 w-8 text-primary/20" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                &quot;{testimonial.content}&quot;
              </blockquote>

              {/* Metrics */}
              <div className="flex items-center justify-between mb-6 p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                    <testimonial.metrics.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {testimonial.metrics.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.metrics.label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-base font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
