import React, { useState } from "react";
import {
  Shield,
  MessageCircle,
  Users,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const APPoliceHomepage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetMessageOpen, setIsResetMessageOpen] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const [officerName, setOfficerName] = useState("");
  // const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: officerName }),
      });

      const data = await res.json();

      if (!res.ok) {
        // setLoginError(data.error || "Login failed");
        return;
      }

      setIsLoginOpen(false);
      console.log("Logged in as:", data.officer);
      localStorage.setItem('officerName',data.officer.Officer_Name);
      localStorage.setItem('memberId',data.officer.mem_id);
      localStorage.setItem('phoneNo',data.officer.Mobile_no);
      localStorage.setItem('preferences',data.officer.Preferences)
      localStorage.setItem('Rank',data.officer.Rank)
      navigate("/PoliceDashboard", { state: { officer: data.officer } });
    } catch (err) {
      // setLoginError("Server error");
      console.error(err);
    }
  };

  // const handleLogin = () => {
  //   setIsLoginOpen(false);

  //   navigate('/PoliceDashboard');
  // };

  const handleForgotPassword = () => {
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(true);
  };

  const handleResetPassword = () => {
    if (email.trim()) {
      setIsForgotPasswordOpen(false);
      setIsResetMessageOpen(true);
      setEmail("");
    }
  };

  const closeForgotPassword = () => {
    setIsForgotPasswordOpen(false);
    setEmail("");
  };

  const closeResetMessage = () => {
    setIsResetMessageOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden scrollbar-hide">
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 w-full">
        <div className="w-full px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center py-2 sm:py-3">
            {/* Logo Section */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex-shrink-0">
                <img
                  src="/images/police_logo.png"
                  alt="AP Police Logo"
                  className="w-full h-full object-contain rounded-full shadow-md"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-blue-800 truncate">
                  AP Police
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  WhatsApp Summary Portal
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-blue-800 text-white px-4 lg:px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors font-medium shadow-md text-sm lg:text-base"
              >
                Login
              </button>
            </nav>

            {/* Mobile Login Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-blue-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-900 transition-colors font-medium text-xs sm:text-sm shadow-md"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-8 sm:py-12 lg:py-16 xl:py-24"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight text-white">
                Andhra Pradesh Police
              </h2>
              <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-blue-200 font-medium mb-4 sm:mb-6">
                WhatsApp Summary & Intelligence Portal
              </h3>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Empowering police personnel with AI-powered analysis of WhatsApp
                group chats to flag critical updates, track task progress, and
                support multi-district coordination. Built for efficiency,
                security, and real-time responsiveness.
              </p>
            </div>

            {/* Right: Feature Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-xl order-1 lg:order-2">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-semibold text-white">
                  Portal Capabilities
                </h4>
              </div>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base text-blue-100">
                <li className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>AI-Powered WhatsApp Chat Analysis</span>
                </li>
                <li className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Real-time Key Point Extraction</span>
                </li>
                <li className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Early Warning Detection System</span>
                </li>
                <li className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Multi-Level Access for CO/SP/PS Roles</span>
                </li>
                <li className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Secure Data Storage & District Segmentation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Our Mission
            </h3>
            <div className="w-16 sm:w-20 h-1 bg-blue-800 mx-auto mb-6 sm:mb-8"></div>
          </div>
          <div className="bg-blue-50 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border-l-4 border-blue-800">
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed text-center">
              At Andhra Pradesh Police, our mission is to harness the power of
              technology to enhance communication, coordination, and
              decision-making across law enforcement agencies. Through the
              WhatsApp Summary Portal, we aim to streamline internal
              communication by leveraging AI to extract key insights from group
              chats, flag potential risks early, and ensure timely action. This
              platform empowers officers at every level — from Police Stations
              to Circle Offices and District Headquarters — to access critical
              information securely, respond swiftly, and uphold public safety
              with transparency and accountability.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Our Services
            </h3>
            <div className="w-16 sm:w-20 h-1 bg-blue-800 mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-2 sm:px-4">
              Comprehensive digital solutions for modern policing and community
              engagement
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-800" />
              </div>
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                WhatsApp Summaries
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                Automated generation and distribution of daily operational
                summaries through WhatsApp integration.
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-800" />
              </div>
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Community Policing
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                Building stronger community partnerships through effective
                communication and transparency.
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-red-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-red-800" />
              </div>
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Emergency Response
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                24/7 emergency response coordination and real-time incident
                management across districts.
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-purple-800" />
              </div>
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Crime Prevention
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                Proactive crime prevention through data analytics and community
                engagement initiatives.
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-yellow-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-800" />
              </div>
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Real-time Updates
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                Instant notifications and updates on ongoing operations and
                security measures.
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-indigo-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-800" />
              </div>
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                District Coordination
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                Seamless coordination between different police districts and
                specialized units.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                26
              </div>
              <div className="text-blue-200 text-xs sm:text-sm lg:text-base">
                Police Districts
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                900+
              </div>
              <div className="text-blue-200 text-xs sm:text-sm lg:text-base">
                Police Stations
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                24/7
              </div>
              <div className="text-blue-200 text-xs sm:text-sm lg:text-base">
                Service Available
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                100
              </div>
              <div className="text-blue-200 text-xs sm:text-sm lg:text-base">
                Emergency Helpline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Contact Information
            </h3>
            <div className="w-16 sm:w-20 h-1 bg-blue-800 mx-auto mb-6 sm:mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-blue-800" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Address
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                AP-DGP Office
                <br />
                Mangalagiri, Guntur District
                <br />
                Andhra Pradesh - 522503
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-green-800" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Emergency
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Emergency: 100
                <br />
                Police Control Room: 0863-2340100
                <br />
                Women Helpline: 181
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-red-800" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Email
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                mail-slprb@ap.gov.in
                <br />
                dgp@appolice.gov.in
                <br />
                info@appolice.gov.in
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                <div>
                  <h4 className="text-lg sm:text-xl font-bold">AP Police</h4>
                  <p className="text-gray-400 text-sm">
                    WhatsApp Summary Portal
                  </p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                Committed to providing professional law enforcement services
                with integrity, diversity, and quality to enhance community
                safety and security.
              </p>
            </div>

            <div>
              <h5 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Quick Links
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm sm:text-base"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm sm:text-base"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm sm:text-base"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm sm:text-base"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Emergency
              </h5>
              <ul className="space-y-2">
                <li className="text-gray-400 text-sm sm:text-base">
                  Police: 100
                </li>
                <li className="text-gray-400 text-sm sm:text-base">
                  Fire: 101
                </li>
                <li className="text-gray-400 text-sm sm:text-base">
                  Ambulance: 108
                </li>
                <li className="text-gray-400 text-sm sm:text-base">
                  Women Helpline: 181
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2025 Andhra Pradesh Police Department. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal
      <div className="p-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Officer Name
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          value={officerName}
          onChange={(e) => setOfficerName(e.target.value)}
          placeholder="Enter your name"
        />
        {loginError && (
          <p className="text-red-500 mt-2 text-sm">{loginError}</p>
        )}
        <button
          onClick={handleLogin}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div> */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 max-w-md w-full mx-3 sm:mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Officer Login
              </h3>
              <button
                onClick={() => setIsLoginOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl font-bold p-1"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Officer ID
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter your Officer ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter your password"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-blue-800 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-900 transition-colors font-medium text-sm sm:text-base"
              >
                Login
              </button>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={handleForgotPassword}
                className="text-xs sm:text-sm text-blue-800 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 max-w-md w-full mx-3 sm:mx-4">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Reset Password
              </h3>
              <button
                onClick={closeForgotPassword}
                className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl font-bold p-1"
              >
                ×
              </button>
            </div>

            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Enter your registered email address and we'll send you a password
              reset link.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter your email address"
                />
              </div>

              <button
                onClick={handleResetPassword}
                className="w-full bg-blue-800 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-900 transition-colors font-medium text-sm sm:text-base"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Message Modal */}
      {isResetMessageOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 max-w-md w-full mx-3 sm:mx-4">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                Email Sent!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                A password reset email has been sent to your registered email
                address. Please check your inbox and follow the instructions to
                reset your password.
              </p>
              <button
                onClick={closeResetMessage}
                className="w-full bg-blue-800 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-900 transition-colors font-medium text-sm sm:text-base"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APPoliceHomepage;
