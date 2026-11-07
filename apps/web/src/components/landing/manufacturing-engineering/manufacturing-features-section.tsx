"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Package,
  Users,
  Database
} from "lucide-react";
import Image from "next/image";
import manufacturingImages from "@/data/industries/manufacturing-engineering-images.json";

export function ManufacturingFeaturesSection() {
  const challenges = [
    {
      title: "Delayed Order Communication",
      description: "Customers and suppliers often face delays in order confirmations or shipment updates due to manual communication gaps."
    },
    {
      title: "Missed Maintenance Reminders",
      description: "Critical equipment servicing is overlooked when teams rely on manual tracking, leading to downtime."
    },
    {
      title: "Slow Workforce Query Handling",
      description: "Employees spend extra time seeking answers on processes, safety, or schedules, reducing productivity."
    },
    {
      title: "Inefficient Inventory Follow-ups",
      description: "Suppliers and warehouse teams miss timely restock or dispatch alerts, causing stockouts and delays."
    }
  ];


  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Gradient blur effect */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        style={{
          background: `radial-gradient(circle at 20% 50%, rgba(var(--primary-rgb), 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(var(--primary-rgb), 0.1) 0%, transparent 50%)`,
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Challenges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="font-geist text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl mb-4">
              The Challenges of Modern Manufacturing
            </h2>
            <p className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto">
              In today&apos;s fast-paced manufacturing landscape, companies face unprecedented complexity:
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                default: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
                y: { duration: 0.2, ease: "easeOut" }
              }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group relative transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>
              <div className="relative z-10 flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-3"></div>
                <div>
                  <p className="text-foreground font-semibold text-left mb-2 transition-colors duration-200 ease-out group-hover:text-primary">{challenge.title}</p>
                  <p className="text-muted-foreground text-left transition-colors duration-200 ease-out group-hover:text-foreground/80">{challenge.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <hr className="bg-foreground/30 mx-auto mb-12 h-px w-1/2" />

        {/* Solutions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="font-geist text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl mb-4">
              How TinkerVoice Can Help
            </h2>
            <p className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto">
              Transform your manufacturing operations with AI-powered voice assistants that automate critical processes and enhance productivity.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}></div>
        </motion.div>
        <hr className="bg-foreground/30 mx-auto mb-12 h-px w-1/2" />

        {/* Solutions with 2 images, 2 cards per image */}
        {[
          {
            image: manufacturingImages.realTimeIntelligence,
            imageAlt: "Manufacturing AI solutions and automation",
            solutions: [
              {
                icon: Bell,
                title: "Automated Maintenance Alerts",
                description: "Proactively notify teams about upcoming equipment servicing to prevent downtime.",
                tags: ["Downtime reduction", "Predictive maintenance", "Operational efficiency"]
              },
              {
                icon: Package,
                title: "Order Status Updates",
                description: "Provide instant voice-based order confirmations, shipment updates, and delivery reminders.",
                tags: ["Customer satisfaction", "Reduced delays", "Supply chain visibility"]
              }
            ]
          },
          {
            image: manufacturingImages.howTinkerVoiceCanHelp,
            imageAlt: "Manufacturing operations and workforce management",
            solutions: [
              {
                icon: Users,
                title: "Onboarding & Training Support",
                description: "Offer real-time voice guidance for workers during onboarding and upskilling tasks.",
                tags: ["Faster training cycles", "Reduced skill gaps", "Workforce productivity"]
              },
              {
                icon: Database,
                title: "Inventory & Stock Reminders",
                description: "Automate low-stock alerts and reorder follow-ups with suppliers.",
                tags: ["Inventory accuracy", "Reduced stockouts", "Seamless operations"]
              }
            ]
          }
        ].map((group, groupIndex) => {
          const isEven = groupIndex % 2 === 0;

          return (
            <motion.div
              key={groupIndex}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: groupIndex * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-start gap-12 mb-16 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
            >
              {/* Content Column - 2 Cards */}
              <div className="flex-1 space-y-6">
                {group.solutions.map((solution, solutionIndex) => {
                  const Icon = solution.icon;
                  return (
                    <motion.div
                      key={solution.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        default: { duration: 0.6, delay: groupIndex * 0.2 + solutionIndex * 0.1, ease: "easeOut" },
                        y: { duration: 0.2, ease: "easeOut" }
                      }}
                      viewport={{ once: true }}
                      whileHover={{ y: -4 }}
                      className="group relative transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-8 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                      <div className="relative z-10">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="text-primary w-fit transform-gpu rounded-full border p-3 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                              <Icon className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-3">
                              {solution.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {solution.description}
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                              {solution.tags.map((tag, tagIndex) => (
                                <div key={tagIndex} className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  <span className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">{tag}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Image Column */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: groupIndex * 0.2 + 0.2 }}
                viewport={{ once: true }}
                className="flex-1 relative group"
              >
                <div className="relative aspect-[5/4] w-full overflow-hidden rounded-xl shadow-2xl">
                  <Image
                    src={group.image.url}
                    alt={group.imageAlt}
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}

      </div>
    </section>
  );
}
