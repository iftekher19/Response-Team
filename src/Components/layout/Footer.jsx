import { FiDroplet, FiChevronRight, FiSend, FiHeart } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                <FiDroplet className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Response Team</h3>
                <p className="text-xs text-gray-400">Save Lives Today</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting blood donors with those in need. Every drop counts,
              every donor matters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "About Us", "Find Donors", "Donation Requests"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                      <FiChevronRight className="text-sm" />
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-3">
              {["FAQs", "Contact Us", "Privacy Policy", "Terms of Service"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                      <FiChevronRight className="text-sm" />
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get updates on blood donation drives.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
              >
                <FiSend />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            © 2025 Response Team. Made with{" "}
            <FiHeart className="inline text-red-500" /> for humanity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;