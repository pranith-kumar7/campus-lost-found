import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinkClass = (path, activeStyle, idleStyle) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
      location.pathname === path ? activeStyle : idleStyle
    }`;

  const isInboxRoute = location.pathname === "/inbox" || location.pathname === "/my-claims" || location.pathname === "/admin-dashboard";
  const isReportsRoute = location.pathname === "/my-reports";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/95 backdrop-blur-lg shadow-lg">
      <div className="mx-auto w-full px-4 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
            onClick={closeMenu}
          >
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                Campus Connect
              </span>
              <div className="text-xs text-slate-500 font-medium">Lost & Found</div>
            </div>
          </Link>

          <div className="hidden items-center gap-4 lg:gap-6 md:flex">
            <Link
              to="/"
              className={`rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 ${
                location.pathname === "/"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V19a1 1 0 001 1h3a1 1 0 001-1v-3h2v3a1 1 0 001 1h3a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
                </svg>
                Home
              </span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className={`rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    location.pathname === "/dashboard"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                    Dashboard
                  </span>
                </Link>

                <Link
                  to="/my-claims"
                  className={`rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    location.pathname === "/my-claims"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z" clipRule="evenodd" />
                    </svg>
                    My Claims
                  </span>
                </Link>

                <Link
                  to="/my-reports"
                  className={`rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    isReportsRoute
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" />
                    </svg>
                    My Reports
                  </span>
                </Link>

                <Link
                  to="/inbox"
                  aria-label="Open inbox"
                  className={`rounded-full p-3 transition-all duration-200 ${
                    isInboxRoute
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-blue-600"
                  }`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.121C2.493 12.806 2 11.451 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zm-11-1a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h5a1 1 0 100-2H8zm-1-6a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/verify-users"
                    className={`rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 ${
                      location.pathname === "/admin-dashboard"
                        ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                        : "text-slate-700 hover:bg-slate-100 hover:text-red-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                      Verify Users
                    </span>
                  </Link>
                )}

                <Link to="/admin-dashboard" className="rounded-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-red-600">Admin Dashboard</Link><div className="h-6 w-px bg-slate-300 mx-2"></div>

                <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {user.isVerified ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Verified"></div>
                    ) : (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Pending Verification"></div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-all duration-200 hover:bg-red-100 hover:border-red-300"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    location.pathname === "/login"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-xs font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors duration-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur py-4">
            <div className="space-y-2 px-2">
              <Link
                to="/"
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  location.pathname === "/" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
                onClick={closeMenu}
              >
                Home
              </Link>

              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === "/dashboard" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-claims"
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === "/my-claims" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={closeMenu}
                  >
                    My Claims
                  </Link>
                  <Link
                    to="/my-reports"
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === "/my-reports" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={closeMenu}
                  >
                    My Reports
                  </Link>
                  <Link
                    to="/inbox"
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isInboxRoute ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={closeMenu}
                  >
                    Inbox
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/verify-users"
                      className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        location.pathname === "/admin-dashboard" ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                      }`}
                      onClick={closeMenu}
                    >
                      Verify Users
                    </Link>
                  )}
                  <div className="border-t border-slate-200 pt-2 mt-4">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="w-full mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <Link
                    to="/login"
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === "/login" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-medium text-white text-center"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}















