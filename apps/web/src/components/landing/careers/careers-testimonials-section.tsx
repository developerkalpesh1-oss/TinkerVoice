"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior AI Engineer",
    image: "/images/company/team-1.png",
    quote: "Working at TinkerVoice has been incredible. I get to work on cutting-edge AI technology that's actually making a difference in how businesses operate. The team is brilliant and collaborative.",
    rating: 5,
    tenure: "2 years",
    achievement: "Led development of our flagship voice AI model",
    video: true
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager",
    image: "/images/company/team-2.png",
    quote: "The culture here is amazing. Everyone is passionate about what they do, and there's a real sense of mission. I've grown so much professionally in just two years.",
    rating: 5,
    tenure: "3 years",
    achievement: "Launched 5+ successful AI voice products",
    video: true
  },
  {
    name: "Priya Patel",
    role: "UX Designer",
    image: "/images/company/team-3.png",
    quote: "TinkerVoice values creativity and innovation. I have the freedom to experiment with new design approaches and the support to make them happen.",
    rating: 5,
    tenure: "1.5 years",
    achievement: "Designed award-winning voice interfaces",
    video: false
  }
];

export function CareersTestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-background/95 to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto max-w-2xl"
          >
            <div
              className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
              style={{
                background:
                  "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
              }}
            />
            <h2 className="relative z-10 font-geist text-3xl font-light tracking-tighter text-foreground sm:text-4xl lg:text-5xl mb-6">
              Hear From Our Team
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto"
          >
            Discover what it&apos;s really like to work at TinkerVoice from the people who know best.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                default: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
                y: { duration: 0.2, ease: "easeOut" }
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative transform-gpu overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-primary/10 backdrop-blur-sm p-8 transition-all duration-300 ease-out hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/10 hover:via-card hover:to-primary/15 hover:shadow-2xl hover:shadow-primary/20"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-300"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400 group-hover:text-amber-300 group-hover:fill-amber-300 transition-colors duration-300" />
                  ))}
                </div>
                <blockquote className="text-foreground mb-6 italic leading-relaxed text-base group-hover:text-foreground transition-colors duration-300 font-medium">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center space-x-4 pt-4 border-t border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary/60 transition-colors duration-300 ring-2 ring-primary/10 group-hover:ring-primary/20 shadow-lg shadow-primary/10">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 text-lg">{testimonial.name}</div>
                    <div className="text-sm text-primary/70 group-hover:text-primary/90 transition-colors duration-300 font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

