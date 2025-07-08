import React, { useState } from "react";
import {
  User,
  Settings,
  LogOut,
  Home,
  FileText,
  CheckSquare,
  BookOpen,
  MapPin,
  Badge,
  Phone,
  Users,
  Camera,
  Lock,
  Palette,
  Shield,
  Building,
  Bell,
  Search,
} from "lucide-react";
import TasksSection from "../components/TasksSection";
import RulesSection from "../components/RulesSection";
import SummarySection from "../components/SummarySection";
import DashboardStats from "../components/DashboardStats";
import ProfileModal from "../components/ProfileModal";
import { useNavigate } from 'react-router-dom';
const PoliceDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState("light");

  // ... keep existing code (tasks state and user data) the same ...

  const [tasks] = useState([
    {
      id: 1,
      taskName: "Deploy roadblock at Junction X",
      assignedBy: "Inspector Ramesh Kumar",
      assignedTo: "Constable Raj Patel",
      status: "in progress",
      deadline: "2025-06-27 14:00",
      priority: "high",
      location: "Junction X, Sector 12",
      description: "Set up vehicle checking point for security clearance",
      createdAt: "2025-06-26 10:30",
    },
    {
      id: 2,
      taskName: "Community patrol in Market Area",
      assignedBy: "Sub-Inspector Priya Sharma",
      assignedTo: "Head Constable Suresh Babu",
      status: "completed",
      deadline: "2025-06-26 18:00",
      priority: "medium",
      location: "Market Area, Zone 3",
      description: "Regular patrol and community engagement",
      createdAt: "2025-06-26 08:00",
      completedAt: "2025-06-26 17:45",
    },
    {
      id: 3,
      taskName: "Traffic management at School Zone",
      assignedBy: "Inspector Anil Reddy",
      assignedTo: "Constable Venkat Rao",
      status: "open",
      deadline: "2025-06-27 07:30",
      priority: "medium",
      location: "Government High School, Main Road",
      description: "Morning traffic control during school hours",
      createdAt: "2025-06-26 20:15",
    },
    {
      id: 4,
      taskName: "Investigation follow-up - Case #2025/156",
      assignedBy: "Circle Inspector Lakshmi Devi",
      assignedTo: "Sub-Inspector Ravi Kumar",
      status: "in progress",
      deadline: "2025-06-28 16:00",
      priority: "high",
      location: "Station Area",
      description: "Follow up on pending investigation case",
      createdAt: "2025-06-25 14:20",
    },
  ]);

  const handleLocalStorage = () => {
    localStorage.removeItem("memberId");
    localStorage.removeItem("officerName");
    localStorage.removeItem("phoneNo");
    navigate('/');
  };
  const user = {
    name: localStorage.getItem('officerName'),
    id: localStorage.getItem('memberId'),
    station: "Mangalagiri Police Station",
    rank: localStorage.getItem('Rank'),
    district: "Guntur",
    subDivision: "Mangalagiri Sub-Division",
    circle: "Guntur West Circle",
    unit: "Traffic Control Unit",
    phone: localStorage.getItem('phonNo'),
    email: "raj.patel@appolice.gov.in",
    dateOfJoining: "15-Jan-2020",
    serviceYears: "5 years",
    badgeNumber: "MGL001",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=face&w=100&h=100",
    attachedConstables: [
      { name: "Constable Suresh Kumar", mobile: "+91 9123456789" },
      { name: "Constable Priya Devi", mobile: "+91 9234567890" },
      { name: "Constable Ramesh Babu", mobile: "+91 9345678901" },
    ],
  };

  const getStatusCounts = () => {
    return {
      total: tasks.length,
      open: tasks.filter((t) => t.status === "open").length,
      inProgress: tasks.filter((t) => t.status === "in progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };
  };

  const statusCounts = getStatusCounts();

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setShowProfile(false);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleChangePassword = () => {
    alert("Password change functionality will be implemented");
  };

  const renderSidebarContent = () => {
    switch (activeSection) {
      case "rules":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Quick Guidelines
            </h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 text-sm">
                  Duty Hours
                </h4>
                <p className="text-xs text-blue-700 mt-1">
                  8 hours regular shift
                </p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-green-100 p-4 rounded-xl border-l-4 border-emerald-500">
                <h4 className="font-semibold text-emerald-900 text-sm">
                  Uniform Code
                </h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Mandatory during duty
                </p>
              </div>
            </div>
          </div>
        );
      case "summarize":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Quick Summary
            </h3>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h4 className="font-semibold text-slate-800 text-sm">Today</h4>
                <ul className="text-xs text-slate-600 mt-2 space-y-1">
                  <li>• {statusCounts.completed} completed</li>
                  <li>• {statusCounts.inProgress} in progress</li>
                  <li>• {statusCounts.open} pending</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center border shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {statusCounts.total}
                </div>
                <div className="text-xs text-blue-700 font-medium">
                  Total Tasks
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-4 rounded-xl text-center border shadow-sm">
                <div className="text-2xl font-bold text-emerald-600">
                  {statusCounts.completed}
                </div>
                <div className="text-xs text-emerald-700 font-medium">
                  Completed
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-4 rounded-xl text-center border shadow-sm">
                <div className="text-2xl font-bold text-amber-600">
                  {statusCounts.inProgress}
                </div>
                <div className="text-xs text-amber-700 font-medium">
                  In Progress
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl text-center border shadow-sm">
                <div className="text-2xl font-bold text-red-600">
                  {statusCounts.open}
                </div>
                <div className="text-xs text-red-700 font-medium">Pending</div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case "tasks":
        return (
          <TasksSection
            tasks={tasks}
            filter={filter}
            setFilter={setFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        );
      case "rules":
        return <RulesSection />;
      case "summarize":
        return <SummarySection tasks={tasks} />;
      default:
        return <DashboardStats tasks={tasks} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-slate-200/50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 relative">
                <img
                  src="/images/police_logo.png"
                  alt="AP Police Logo"
                  className="w-full h-full object-contain rounded-full shadow-lg ring-2 ring-blue-500/30"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AP Police Portal
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Professional Command Center
                </p>
              </div>
            </div>

            {/* Enhanced Profile Section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-3 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="h-6 w-6 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5  text-white text-xs rounded-full flex items-center justify-center">
                  
                </span>
              </button>

              {/* Search */}
              <div className="hidden md:flex items-center space-x-2 bg-slate-100 rounded-xl px-4 py-2">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfile(!showProfile);
                    setShowSettings(false);
                  }}
                  className="flex items-center space-x-3 text-sm bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-2 hover:shadow-lg transition-all duration-300 hover:bg-white"
                >
                  <div className="w-12 h-12 relative">
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover ring-2 ring-blue-500/30"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-slate-700 font-semibold text-sm">
                      {user.name}
                    </p>
                    <p className="text-slate-500 text-xs">{user.rank}</p>
                  </div>
                </button>

                {/* Enhanced Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 z-50">
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/20"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 text-lg">
                            {user.name}
                          </h3>
                          <p className="text-blue-600 font-semibold text-sm">
                            {user.rank}
                          </p>
                          <p className="text-slate-500 text-xs">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg flex items-center transition-all duration-200 font-medium"
                      >
                        <User className="h-5 w-5 mr-3 text-blue-600" />
                        View Full Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowSettings(true);
                          setShowProfile(false);
                        }}
                        className="w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 rounded-lg flex items-center transition-all duration-200"
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        Settings
                      </button>
                      <button
                        onClick={handleLocalStorage}
                        className="w-full text-left px-3 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-lg flex items-center transition-all duration-200"
                        // navigate('/')
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}

                {/* Enhanced Settings Modal */}
                {showSettings && (
                  <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 z-50">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-slate-800 text-lg flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        Settings
                      </h3>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Theme Settings */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-700 text-sm flex items-center">
                          <Palette className="h-4 w-4 mr-2" />
                          Theme Settings
                        </h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="theme"
                              value="light"
                              checked={theme === "light"}
                              onChange={(e) =>
                                handleThemeChange(e.target.value)
                              }
                              className="text-blue-600"
                            />
                            <span className="text-sm text-slate-600">
                              Light Mode
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="theme"
                              value="dark"
                              checked={theme === "dark"}
                              onChange={(e) =>
                                handleThemeChange(e.target.value)
                              }
                              className="text-blue-600"
                            />
                            <span className="text-sm text-slate-600">
                              Dark Mode
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="theme"
                              value="auto"
                              checked={theme === "auto"}
                              onChange={(e) =>
                                handleThemeChange(e.target.value)
                              }
                              className="text-blue-600"
                            />
                            <span className="text-sm text-slate-600">
                              Auto (System)
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Security Settings */}
                      <div className="pt-4 border-t border-slate-100">
                        <h4 className="font-semibold text-slate-700 text-sm flex items-center mb-3">
                          <Lock className="h-4 w-4 mr-2" />
                          Security
                        </h4>
                        <button
                          onClick={handleChangePassword}
                          className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg flex items-center transition-colors"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100">
                      <button
                        onClick={() => setShowSettings(false)}
                        className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <div className="w-72 bg-white/90 backdrop-blur-lg shadow-xl h-screen border-r border-slate-200/50">
          <nav className="p-6">
            <div className="space-y-3">
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 ${
                  activeSection === "dashboard"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                    : "text-slate-700 hover:bg-slate-100 hover:shadow-md hover:scale-102"
                }`}
              >
                <Home className="h-6 w-6" />
                <span className="font-semibold">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveSection("tasks")}
                className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 ${
                  activeSection === "tasks"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                    : "text-slate-700 hover:bg-slate-100 hover:shadow-md hover:scale-102"
                }`}
              >
                <CheckSquare className="h-6 w-6" />
                <span className="font-semibold">Tasks</span>
                {statusCounts.open > 0 && (
                  <span className="">
                    {/* {statusCounts.open} */}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveSection("rules")}
                className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 ${
                  activeSection === "rules"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                    : "text-slate-700 hover:bg-slate-100 hover:shadow-md hover:scale-102"
                }`}
              >
                <BookOpen className="h-6 w-6" />
                <span className="font-semibold">Rules</span>
              </button>
              <button
                onClick={() => setActiveSection("summarize")}
                className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 ${
                  activeSection === "summarize"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                    : "text-slate-700 hover:bg-slate-100 hover:shadow-md hover:scale-102"
                }`}
              >
                <FileText className="h-6 w-6" />
                <span className="font-semibold">Summarize</span>
              </button>
            </div>
          </nav>

          {/* Sidebar Content */}
          <div className="p-6 border-t border-slate-200">
            {renderSidebarContent()}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">{renderMainContent()}</div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
      />
    </div>
  );
};

export default PoliceDashboard;
