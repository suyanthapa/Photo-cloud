import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  Home,
  Upload,
  ImageIcon,
  Share2,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Logout from "../pages/profile/logout";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  //close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewProfile = () => {
    setOpen(false);
    navigate("/view-profile"); // redirect to profile page
  };

  const handleUpdatePassword = () => {
    setOpen(false);
    navigate("/update-password"); // redirect to the Change Password page
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Photo Cloud
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive("/dashboard")
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            to="/upload"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive("/upload")
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload
          </Link>
          <Link
            to="/allPhotos"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive("/allPhotos")
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            All Photos
          </Link>
          <Link
            to="/sharedWithMe"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive("/sharedWithMe")
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Share2 className="w-4 h-4" />
            Shared With Me
          </Link>
          <Link
            to="/sharedByYou"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive("/sharedByYou")
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Users className="w-4 h-4" />
            Shared By You
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,80H136V56h64ZM120,56v64H56V56ZM56,136h64v64H56Zm144,64H136V136h64v64Z" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all duration-200"
              onClick={() => setOpen(!open)}
            >
              <User className="w-5 h-5 text-white" />
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-lg border border-gray-200 z-50 py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Account</p>
                  <p className="text-xs text-gray-500">Manage your profile</p>
                </div>
                <button
                  onClick={handleViewProfile}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <User className="w-4 h-4" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={handleUpdatePassword}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <Settings className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Logout />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
