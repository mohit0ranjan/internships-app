"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  type NavLink = {
    href: string;
    label: string;
    badge?: string;
    dropdown?: boolean;
  };

  const navLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/apply", label: "Apply", badge: "New" },
    { href: "#domains", label: "Domains" },
    { href: "#announcements", label: "Announcements" },
    { href: "/help", label: "Help" },
  ];

  return (
    <header className="flex flex-col w-full z-50 relative">
      {/* Top Utility Bar */}
      <div className="bg-navy-50 border-b border-gray-200 hidden md:block">
        <div className="container mx-auto px-6 lg:px-10 py-2 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-transparent">Independent</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4 border-r border-gray-300 pr-5">
              <img src="/assets/img/G20Logo.png" alt="G20" className="h-6 w-auto object-contain" />
              <img src="/assets/img/wblLogo.png" alt="WBL" className="h-6 w-auto object-contain" />
              <img src="/assets/img/cdacLogo.png" alt="CSDAC" className="h-6 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-2 pl-1 font-medium">
              <button className="hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded px-1">A-</button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded px-1">A</button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded px-1 font-bold text-sm">A+</button>
            </div>
          </div>
        </div>
      </div>

      <nav 
        className={`bg-white transition-all duration-300 ${
          isScrolled ? "shadow-md py-3 sticky top-0" : "border-b border-gray-100 py-4"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-10 flex items-center justify-between">
          
          {/* Main Logo */}
          <Link href="/" className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-lg">
            <img 
              src="/assets/img/csdac-navbar.png" 
              alt="CSDAC" 
              className={`w-auto object-contain transition-all duration-300 ${
                isScrolled ? "h-[42px]" : "h-[50px]"
              }`} 
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden xl:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <li key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className="px-4 py-2 rounded-full text-[13px] font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                >
                  {link.label}
                  {link.dropdown && <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-primary-600 transition-colors" />}
                </Link>
                {link.badge && (
                  <span className="absolute -top-1 -right-1 bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-amber-200">
                    {link.badge}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <Link
              href="https://internship.csdac.in/login"
              className="hidden md:flex items-center justify-center bg-primary-600 text-white px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-primary-700 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              Login
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="xl:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full bg-background border-b border-gray-200 shadow-lg py-4 px-6 z-40 max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 rounded-lg text-[14px] font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    {link.label}
                    {link.badge && (
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  {link.dropdown && <ChevronDown className="w-4 h-4 text-gray-400" />}
                </Link>
              </li>
            ))}
            <li className="mt-4 pt-4 border-t border-gray-100 md:hidden">
              <Link
                href="https://internship.csdac.in/login"
                className="block text-center w-full bg-primary-600 text-white px-6 py-3 rounded-xl text-[14px] font-bold hover:bg-primary-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
