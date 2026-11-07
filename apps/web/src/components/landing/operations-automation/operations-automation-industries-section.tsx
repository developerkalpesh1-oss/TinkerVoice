"use client";

import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Heart, 
  DollarSign, 
  Home, 
  Car, 
  Plane, 
  GraduationCap, 
  Wrench,
  Building,
  Truck,
  Users,
  Cog
} from "lucide-react";
import Image from "next/image";

export function OperationsAutomationIndustriesSection() {
  const industries = [
    {
      icon: ShoppingCart,
      title: "Retail & E-commerce",
      description: "Automate inventory checks and supplier coordination",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Heart,
      title: "Healthcare",
      description: "Manage patient intake, appointment routing, and report updates",
      color: "from-green-500 to-green-600"
    },
    {
      icon: DollarSign,
      title: "Financial Services",
      description: "Handle KYC verification, policy renewals, or compliance reminders",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Home,
      title: "Real Estate",
      description: "Track property listings and client follow-ups",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Car,
      title: "Automotive",
      description: "Automate service scheduling and parts ordering",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Plane,
      title: "Travel & Hospitality",
      description: "Confirm bookings, cancellations, and customer requests",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Manage enrollment updates and exam notifications",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Wrench,
      title: "Home Services",
      description: "Assign technicians and track job completions",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Building,
      title: "SaaS",
      description: "Automate subscription workflows and customer onboarding",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: Truck,
      title: "Logistics",
      description: "Track shipments and coordinate delivery schedules",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Users,
      title: "HR",
      description: "Schedule interviews and manage recruitment processes",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Cog,
      title: "Manufacturing",
      description: "Automate production alerts and maintenance scheduling",
      color: "from-gray-500 to-gray-600"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Drive Operations Automation Across Industries
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            TinkerVoice can drive operations automation by deploying voice agents that streamline backend workflows and reduce manual intervention across industries, including:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${industry.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <industry.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {industry.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {industry.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              Industry-Specific Solutions
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Each industry has unique operational challenges. TinkerVoice&apos;s AI agents are designed to understand and automate industry-specific workflows, ensuring maximum efficiency and compliance.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Customized automation workflows</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Industry compliance standards</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Specialized terminology and processes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Integration with industry-specific tools</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full h-[400px]">
              <Image
                src="/images/solutions.png"
                alt="Industry-specific operations automation solutions showing various business sectors and their automated workflows"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain rounded-2xl"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
