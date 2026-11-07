"use client";

import { motion } from "framer-motion";
import { Quote, Building } from "lucide-react";

export function HrRecruitingTestimonialsSection() {
  const testimonials = [
    {
      quote: "The aha moment for the team is that this actually means less work. It means my recruiters have the opportunity to do the things they want to do, to work on more value, and spend less time doing administrative tasks.",
      author: "Sarah Johnson",
      title: "Head of Talent Acquisition",
      company: "TechCorp Solutions"
    },
    {
      quote: "Why wouldn't you give your recruiters that personal assistant to get things scheduled? It's about freeing up time to have conversations, not sending emails and trying to get things booked.",
      author: "Seema Shah",
      title: "Global Talent Acquisition Operations Manager",
      company: "Johnson Controls"
    }
  ];

  return (
    <section className="relative py-20 bg-background">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center mb-16">
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-geist mt-4 text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl"
            >
              What Our Clients Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-geist text-foreground/60 mt-3 max-w-3xl mx-auto"
            >
              Discover how leading organizations are transforming their recruitment processes with TinkerVoice
            </motion.p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}></div>
        </div>
        <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />

        <div className="relative mt-12">
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  default: { duration: 0.6, delay: index * 0.2, ease: "easeOut" },
                  y: { duration: 0.2, ease: "easeOut" }
                }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group relative transform-gpu space-y-4 rounded-xl border border-border bg-transparent p-8 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="text-primary w-fit transform-gpu rounded-full border p-4 mb-6 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                    <Quote className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                  </div>

                  <blockquote className="text-lg text-foreground mb-6 leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/90">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <div className="flex items-center">
                    <div className="text-primary w-fit transform-gpu rounded-full border p-3 mr-4 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                      <Building className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                        {testimonial.title}
                      </div>
                      <div className="text-sm text-primary font-medium transition-colors duration-200 ease-out group-hover:text-primary/80">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="text-4xl font-bold text-primary mb-2 transition-colors duration-300 group-hover:text-primary/80">85%</div>
              <div className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                of recruiters more likely to stay with AI
              </div>
            </motion.div>
            <motion.div
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="text-4xl font-bold text-primary mb-2 transition-colors duration-300 group-hover:text-primary/80">75%</div>
              <div className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                reduction in administrative tasks
              </div>
            </motion.div>
            <motion.div
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="text-4xl font-bold text-primary mb-2 transition-colors duration-300 group-hover:text-primary/80">90%</div>
              <div className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                of hiring processes automated
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
