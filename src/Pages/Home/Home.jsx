import React, { useEffect } from "react";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FiHeart, FiUsers, FiSearch } from "react-icons/fi";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <div className="w-full">

      <section className="bg-red-50 py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">

          {/* TEXT */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-red-700 leading-tight">
              Donate Blood. <br /> Save Lives. ❤️
            </h1>

            <p className="text-gray-700 mt-4 text-lg">
              Join our mission to help people in need. Every drop of blood can bring hope and save someone’s life.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-red-600 text-white rounded-md text-lg font-semibold hover:bg-red-700 transition"
              >
                Join as Donor
              </Link>

              <Link
                to="/search"
                className="px-6 py-3 border border-red-600 text-red-600 rounded-md text-lg font-semibold hover:bg-red-50 transition"
              >
                Search Donors
              </Link>
            </div>
          </motion.div>

          {/* IMAGE / ILLUSTRATION */}
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://i.ibb.co/G32Yf31/blood-donation-illustration.png"
              alt="blood donation"
              className="w-[350px] md:w-[420px]"
            />
          </motion.div>
        </div>
      </section>


      {/* ------------------ FEATURED SECTION ------------------ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-2">
            Why Donate Blood?
          </h2>
          <p className="text-gray-600 mb-12">
            A life-saving act that takes only 10 minutes but can change someone’s world.
          </p>

          <div className="grid md:grid-cols-3 gap-8">

            {/* CARD 1 */}
            <div
              className="p-8 border rounded-xl shadow hover:shadow-lg transition bg-red-50"
              data-aos="fade-up"
            >
              <FiHeart className="text-red-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-700">Save Lives</h3>
              <p className="text-gray-600 mt-2">
                Your donation can help accident victims, surgery patients, and those with blood disorders.
              </p>
            </div>

            {/* CARD 2 */}
            <div
              className="p-8 border rounded-xl shadow hover:shadow-lg transition bg-red-50"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <FiUsers className="text-red-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-700">Community Impact</h3>
              <p className="text-gray-600 mt-2">
                Donating blood strengthens the bond within the community and shows compassion.
              </p>
            </div>

            {/* CARD 3 */}
            <div
              className="p-8 border rounded-xl shadow hover:shadow-lg transition bg-red-50"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <FiSearch className="text-red-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-700">Easy to Find Donors</h3>
              <p className="text-gray-600 mt-2">
                Our platform helps match donors with people in need faster than ever.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ------------------ CONTACT SECTION ------------------ */}
      <section className="py-20 px-4 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h2>
          <p className="mb-6">Have questions or need help? We're here for you.</p>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Form */}
            <form className="space-y-4 bg-white text-gray-800 p-6 rounded-xl">
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="input input-bordered w-full"
              />
              <textarea
                placeholder="Your Message"
                className="textarea textarea-bordered w-full"
                rows="4"
              ></textarea>
              <button className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 w-full transition">
                Send Message
              </button>
            </form>

            {/* Contact Info */}
            <div className="flex flex-col justify-center text-left md:text-left">
              <h3 className="font-semibold text-xl mb-2">Hotline</h3>
              <p className="mb-4 text-lg">📞 +880 1234-567890</p>

              <h3 className="font-semibold text-xl mb-2">Email</h3>
              <p className="mb-4 text-lg">support@response-team.org</p>

              <h3 className="font-semibold text-xl mb-2">Address</h3>
              <p className="text-lg">Dhaka, Bangladesh</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
