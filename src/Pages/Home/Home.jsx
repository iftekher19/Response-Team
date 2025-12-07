import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FiHeart,
  FiUsers,
  FiSearch,
  FiDroplet,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiArrowRight,
  FiCheck,
  FiStar,
  FiActivity,
  FiShield,
  FiAward,
  FiSend,
  FiChevronRight,
} from "react-icons/fi";
import { FaQuoteLeft, FaHandHoldingHeart, FaHeartbeat } from "react-icons/fa";
import { BiDonateBlood } from "react-icons/bi";

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: FiDroplet, value: "10,000+", label: "Blood Units Collected" },
    { icon: FiUsers, value: "5,000+", label: "Active Donors" },
    { icon: FiHeart, value: "8,500+", label: "Lives Saved" },
    { icon: FiMapPin, value: "64", label: "Districts Covered" },
  ];

  const features = [
    {
      icon: FiHeart,
      title: "Save Lives",
      description:
        "Your donation can help accident victims, surgery patients, and those with blood disorders.",
      color: "from-red-500 to-rose-600",
    },
    {
      icon: FiUsers,
      title: "Community Impact",
      description:
        "Donating blood strengthens the bond within the community and shows compassion.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: FiSearch,
      title: "Easy to Find Donors",
      description:
        "Our platform helps match donors with people in need faster than ever.",
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: FiShield,
      title: "Safe & Secure",
      description:
        "All donations are handled by certified professionals with highest safety standards.",
      color: "from-red-600 to-rose-700",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Register",
      description: "Create your donor profile with blood type and location",
      icon: FiUsers,
    },
    {
      step: "02",
      title: "Get Matched",
      description: "Receive notifications when someone needs your blood type",
      icon: FiSearch,
    },
    {
      step: "03",
      title: "Donate",
      description: "Visit the nearest center and donate blood safely",
      icon: BiDonateBlood,
    },
    {
      step: "04",
      title: "Save Lives",
      description: "Your donation helps save up to 3 lives",
      icon: FiHeart,
    },
  ];

  const testimonials = [
    {
      name: "Iftekher Ahmed",
      role: "Regular Donor",
      image: "https://i.ibb.co.com/KpjXG1fw/akash.jpg",
      text: "Being a blood donor has been one of the most rewarding experiences of my life. Knowing that I can help save lives gives me immense joy.",
      bloodGroup: "O+",
    },
    {
      name: "Rahima Khatun",
      role: "Blood Recipient",
      image: "https://avatar.iran.liara.run/public/54",
      text: "After my accident, I needed 4 units of blood. Thanks to the donors, I'm alive today. This platform made finding donors incredibly easy.",
      bloodGroup: "O-",
    },
    {
      name: "Dr. Fatima Begum",
      role: "Medical Professional",
      image: "https://avatar.iran.liara.run/public/95",
      text: "Response Team has revolutionized how we connect patients with donors. The quick response time has saved countless lives in emergencies.",
      bloodGroup: "B+",
    },
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="w-full overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center bg-linear-to-br from-red-50 via-white to-rose-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating circles */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-red-200/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-r from-red-100/20 to-rose-100/20 rounded-full blur-3xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating Blood Drops */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-red-300/40"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <FiDroplet size={30 + i * 5} />
            </motion.div>
          ))}

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* TEXT CONTENT */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                Emergency Blood Needed • O- Blood Type
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
                <span className="text-gray-900">Donate Blood.</span>
                <br />
                <span className="relative">
                  <span className="bg-linear-to-r from-red-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                    Save Lives.
                  </span>
                  {/* Underline decoration */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    fill="none"
                  >
                    <motion.path
                      d="M2 8C50 2 100 2 150 8C200 14 250 10 298 4"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="gradient">
                        <stop stopColor="#dc2626" />
                        <stop offset="1" stopColor="#e11d48" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <motion.p
                className="text-gray-600 mt-6 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Join our mission to help people in need. Every drop of blood can
                bring hope and save someone's life.{" "}
                <span className="text-red-600 font-semibold">
                  Be a hero today.
                </span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to="/register"
                  className="group relative px-8 py-4 bg-linear-to-r from-red-600 to-rose-600 text-white rounded-xl text-lg font-bold shadow-xl shadow-red-200 hover:shadow-red-300 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <FiHeart className="group-hover:animate-pulse" />
                    Join as Donor
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <Link
                  to="/search"
                  className="group px-8 py-4 bg-white text-red-600 rounded-xl text-lg font-bold border-2 border-red-200 hover:border-red-600 hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiSearch />
                  Search Donors
                  <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-2 text-gray-600">
                  <FiShield className="text-green-500 text-xl" />
                  <span className="text-sm font-medium">100% Safe</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiAward className="text-yellow-500 text-xl" />
                  <span className="text-sm font-medium">Certified</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiClock className="text-blue-500 text-xl" />
                  <span className="text-sm font-medium">24/7 Available</span>
                </div>
              </motion.div>
            </motion.div>

            {/* HERO IMAGE / ILLUSTRATION */}
            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                {/* Main circular container */}
                <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto">
                  {/* Rotating border */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-dashed border-red-200"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* Inner circle with image */}
                  <div className="absolute inset-4 sm:inset-6 lg:inset-8 rounded-full bg-linear-to-br from-red-500 to-rose-600 p-1 shadow-2xl shadow-red-300">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <img
                        src="https://i.ibb.co.com/CpXFPyW8/bd-01.png"
                        alt="blood donation"
                        className="w-4/5 h-4/5 object-contain"
                      />
                    </div>
                  </div>

                  {/* Floating Cards */}
                  <motion.div
                    className="absolute -left-4 top-2/4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <FiDroplet className="text-red-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">A+</p>
                        <p className="text-xs text-gray-500">Available</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -right-4 top-1/3 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <FiCheck className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          Donor Found
                        </p>
                        <p className="text-xs text-gray-500">2 min ago</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute right-0 bottom-0/4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                        <FaHeartbeat className="text-rose-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          Life Saved!
                        </p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity, scale }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-red-300 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-3 bg-red-500 rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="relative py-16 bg-linear-to-r from-red-600 via-rose-600 to-red-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                  <stat.icon className="text-white text-3xl" />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-red-100 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BLOOD GROUPS SECTION ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              All Blood Types Welcome
            </h2>
            <p className="text-gray-600 mt-2">
              We need donors of every blood type
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {bloodGroups.map((group, index) => (
              <motion.div
                key={group}
                className="group relative"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-transparent group-hover:border-red-500 transition-all duration-300 cursor-pointer">
                  <span className="text-2xl font-bold text-red-600">
                    {group}
                  </span>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY DONATE SECTION ==================== */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-red-50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-linear-to-t from-rose-50 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              WHY DONATE BLOOD
            </motion.span>
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Make a Difference{" "}
              <span className="text-red-600">in Someone's Life</span>
            </motion.h2>
            <motion.p
              className="text-gray-600 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A life-saving act that takes only 10 minutes but can change
              someone's world forever.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-red-100 transition-all duration-500 border border-gray-100 hover:border-red-200"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div
                  className={`w-16 h-16 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="text-white text-2xl" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 to-rose-500 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <section className="py-24 px-4 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              HOW IT WORKS
            </motion.span>
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Simple Steps to <span className="text-red-600">Save Lives</span>
            </motion.h2>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-linear-to-r from-red-200 via-red-400 to-red-200 -translate-y-1/2" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="relative z-10 bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:border-red-200 transition-all duration-300 group hover:-translate-y-2">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-linear-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {item.step}
                    </div>

                    <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-100 transition-colors">
                      <item.icon className="text-red-600 text-3xl" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              TESTIMONIALS
            </motion.span>
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              What People <span className="text-red-600">Say About Us</span>
            </motion.h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className={`bg-linear-to-br from-red-50 to-rose-50 rounded-3xl p-8 md:p-12 shadow-xl border border-red-100 ${
                  activeTestimonial === index ? "block" : "hidden"
                }`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <FaQuoteLeft className="text-red-300 text-4xl mb-6" />

                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-block px-4 py-2 bg-red-600 text-white rounded-full font-bold">
                      {testimonial.bloodGroup}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Dots Navigation */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index
                      ? "bg-red-600 w-8"
                      : "bg-red-200 hover:bg-red-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-red-600 via-rose-600 to-red-700" />

        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-8">
              <FaHandHoldingHeart className="text-white text-4xl" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Save a Life?
            </h2>
            <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
              Every 2 seconds, someone needs blood. Your donation can make the
              difference between life and death.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group px-10 py-5 bg-white text-red-600 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <FiHeart className="group-hover:animate-pulse" />
                Become a Donor Today
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/donation-requests"
                className="px-10 py-5 bg-transparent text-white rounded-2xl text-lg font-bold border-2 border-white/50 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FiSearch />
                View Requests
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== CONTACT SECTION ==================== */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Have Questions? <br />
                <span className="text-red-600">We're Here to Help</span>
              </h2>
              <p className="text-gray-600 text-lg mb-10">
                Whether you need to find a donor, want to become one, or have
                any questions about blood donation, our team is ready to assist
                you.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                    <FiPhone className="text-red-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      24/7 Hotline
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      +880 1304535864
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                    <FiMail className="text-red-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Email Address
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      support@response-team.org
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                    <FiMapPin className="text-red-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Head Office
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      Merul Badda ,Dhaka, Bangladesh
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <form className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h3>

                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Iftekher Ahmed"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="iftekherakash6@gmail.com"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="How can we help?"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      placeholder="Write your message here..."
                      rows="5"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-linear-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-200 hover:shadow-red-300 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 group"
                  >
                    <FiSend className="group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;