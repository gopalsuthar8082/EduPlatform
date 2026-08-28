import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineAcademicCap } from 'react-icons/hi2';

/**
 * Footer Component
 * Public layout footer with branding, navigation links, and copyright
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <HiOutlineAcademicCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-gray-900 text-base">
            Edu<span className="text-indigo-600">Platform</span>
          </span>
          <span className="text-gray-400 text-sm hidden sm:inline">|</span>
          <span className="text-xs text-gray-500 hidden sm:inline">
            Digital Education & Exam Preparation
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600" aria-label="Footer Links">
          <Link to="/about" className="hover:text-indigo-600 transition-colors">
            About Us
          </Link>
          <Link to="/courses" className="hover:text-indigo-600 transition-colors">
            Courses
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 transition-colors">
            Contact
          </Link>
          <Link to="/terms" className="hover:text-indigo-600 transition-colors">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-indigo-600 transition-colors">
            Privacy Policy
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-gray-400 text-center md:text-right">
          &copy; {currentYear} EduPlatform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
