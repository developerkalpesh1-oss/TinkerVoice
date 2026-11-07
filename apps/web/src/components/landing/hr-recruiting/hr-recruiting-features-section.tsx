"use client";

import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  CheckCircle,
  Star
} from "lucide-react";
import Image from "next/image";
import hrRecruitingImages from "@/data/industries/hr-recruiting-images.json";

export function HrRecruitingFeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Screen Candidates Instantly",
      description: "Mobile apply, conversational screening, and resume matching create consistency at scale and increase conversion rates.",
      image: hrRecruitingImages.screenCandidates.url,
      imageAlt: hrRecruitingImages.screenCandidates.alt,
      benefits: [
        "Mobile-first application process",
        "Conversational screening interviews",
        "AI-powered resume matching",
        "Consistent evaluation criteria",
        "Increased candidate conversion rates"
      ]
    },
    {
      icon: Calendar,
      title: "Schedule Interviews Automatically",
      description: "Olivia syncs with Outlook and Gmail, handles reminders and rescheduling, and coordinates multi-person, multi-location interviews, reducing time spent on recruiting administrative tasks by up to 75%.",
      image: hrRecruitingImages.scheduleInterviews.url,
      imageAlt: hrRecruitingImages.scheduleInterviews.alt,
      benefits: [
        "Outlook and Gmail integration",
        "Automated reminders and rescheduling",
        "Multi-person interview coordination",
        "Multi-location scheduling support",
        "75% reduction in admin tasks"
      ]
    },
    {
      icon: Star,
      title: "Provide a Magical Candidate Experience",
      description: "Every candidate gets a high-touch experience, regardless of the volume of applications.",
      image: hrRecruitingImages.candidateExperience.url,
      imageAlt: hrRecruitingImages.candidateExperience.alt,
      benefits: [
        "Personalized candidate interactions",
        "24/7 availability for candidates",
        "Consistent high-quality experience",
        "Real-time status updates",
        "Seamless communication flow"
      ]
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
              className="font-geist mt-4 text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl mb-4"
            >
              Streamline Your Recruitment Process with Olivia
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-geist text-foreground/60 mt-3 max-w-3xl mx-auto"
            >
              Olivia, TinkerVoice&apos;s AI-powered recruiting assistant, is designed to handle the tasks that take up most of your time. With Olivia, you can:
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
          <div className="space-y-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl p-8 transition-all duration-300 ease-out border border-transparent hover:border-primary/20 hover:bg-gradient-to-br hover:from-primary/5 hover:via-transparent hover:to-primary/5 hover:shadow-xl hover:shadow-primary/10 ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="text-primary w-fit transform-gpu rounded-full border p-4 mr-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                      <feature.icon className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110" />
                    </div>
                    <h3 className="font-geist text-2xl font-bold tracking-tighter text-foreground transition-colors duration-300 ease-out group-hover:text-primary">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed transition-colors duration-300 ease-out group-hover:text-foreground/90">
                    {feature.description}
                  </p>

                  <div className="space-y-3">
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-110" />
                          <span className="text-muted-foreground transition-colors duration-300 ease-out group-hover:text-foreground/90">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ease-out group-hover:shadow-primary/20 group-hover:scale-[1.02]">
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt || `${feature.title} illustration`}
                      width={600}
                      height={400}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
