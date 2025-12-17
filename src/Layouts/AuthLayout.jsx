import React from "react";
import { Outlet, Link } from "react-router";
import Navbar from "../Components/layout/Navbar";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <Navbar />

      {/* Top thin navbar with logo (keeps consistent brand) */}
      {/* <header className="w-full py-4 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
              🩸
            </div>
            <span className="text-lg font-semibold text-red-600">Response Team</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-red-600">Home</Link>
            <Link to="/donation-requests" className="text-gray-600 hover:text-red-600">Requests</Link>
            <Link to="/search" className="text-gray-600 hover:text-red-600">Search Donors</Link>
          </nav>
        </div>
      </header> */}

      {/* Main content area */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Left Illustration / marketing panel (hidden on small screens) */}
          <aside className="hidden md:flex flex-col justify-center px-6">
            <h2 className="text-3xl font-extrabold text-red-700 mb-4">
              Join the life-saving movement
            </h2>
            <p className="text-gray-700 mb-6">
              Become a donor or help others find donors. Register quickly to start making an impact.
            </p>

            <div className="bg-red-50 rounded-lg p-4 shadow-inner">
              <p className="text-sm text-gray-600">
                Already a member?
                <Link to="/login" className="text-red-600 font-semibold ml-2">Sign in</Link>
              </p>
            </div>

            <div className="mt-8">
              <img
                src="https://i.ibb.co.com/dskybwD2/Pngtree-happy-red-blood-drop-character-20945249.png"
                alt="blood donation"
                className="w-full max-w-sm"
              />
            </div>
          </aside>

          {/* Right: Auth card */}
          <section className="flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">Welcome</h3>
                <p className="text-sm text-gray-500">Sign in or create an account to continue</p>
              </div>

              {/* Outlet will render Login or Register */}
              <div>
                <Outlet />
              </div>

              {/* small footer note */}
              <p className="text-xs text-gray-400 mt-6">
                By creating an account you agree to our terms and privacy policy.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Simple footer (small) */}
      <footer className="py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Response Team — Built for blood donation & community care.
      </footer>
    </div>
  );
}
