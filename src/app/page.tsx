"use client";

import "./globals.css";
import Image from "next/image";
import { Leaf, Map, Compass, Backpack, Trophy, ArrowRight, Send, Sparkles, Menu, X, ChevronUp, Check, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import { supabase } from "../lib/supabase";

export default function Home() {
  // Add state for mobile drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Add state for scroll to top button
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Add state for email input and form submission
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ message: string; isSuccess: boolean } | null>(null);

  // Add state for contact form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactFormStatus, setContactFormStatus] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  const features = [
    {
      icon: <Map className="w-7 h-7" />,
      title: "Smart TrailFinder",
      description: "Discover personalized trails based on your preferences, difficulty level, and environmental impact.",
      gradient: "from-[#E9F2E5] to-[#F2F9EF] dark:from-[#1E2A1C] dark:to-[#1A261F]",
      stats: "Coming Soon"
    },
    {
      icon: <Compass className="w-7 h-7" />,
      title: "AI Trail Assistant",
      description: "Get real-time guidance and essential survival tips about local ecosystems during your adventure.",
      gradient: "from-[#E3F4F1] to-[#EDF8F6] dark:from-[#1A2826] dark:to-[#1A2420]",
      stats: "Coming Soon"
    },
    {
      icon: <Leaf className="w-7 h-7" />,
      title: "Trip Planner",
      description: "Plan your outdoor adventure with weather-aware routing, viewpoints, and sustainable campsite options.",
      gradient: "from-[#E5F5EB] to-[#F0FAF5] dark:from-[#1A2820] dark:to-[#1A2622]",
      stats: "Coming Soon"
    },
    {
      icon: <Backpack className="w-7 h-7" />,
      title: "Smart Eco Packing",
      description: "Receive minimalist packing lists with environmentally friendly alternatives for your journey.",
      gradient: "from-[#E9F2E5] to-[#F2F9EF] dark:from-[#1E2A1C] dark:to-[#1A261F]",
      stats: "Coming Soon"
    },
    {
      icon: <Trophy className="w-7 h-7" />,
      title: "Eco Missions",
      description: "Complete environmental challenges, earn rewards, and track your positive impact on nature.",
      gradient: "from-[#E3F4F1] to-[#EDF8F6] dark:from-[#1A2826] dark:to-[#1A2420]",
      stats: "Coming Soon"
    }
  ];

  // Add function to handle waitlist form submission
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setFormStatus({ message: "Please enter a valid email address", isSuccess: false });
      return;
    }

    setIsSubmitting(true);
    setFormStatus(null);

    try {
      // Insert email into Supabase waitlist_users table
      const { error } = await supabase
        .from('waitlist_users')
        .insert([{ email }]);

      if (error) {
        console.error('Supabase Error:', error);

        if (error.code === '23505') { // Postgres unique constraint error code
          setFormStatus({ message: "You're already on our waitlist!", isSuccess: true });
        } else if (error.code === '42P01') {
          // Table doesn't exist
          setFormStatus({ message: "Configuration error: Waitlist table not found", isSuccess: false });
        } else if (error.message.includes('permission denied')) {
          setFormStatus({ message: "Configuration error: Permission denied", isSuccess: false });
        } else {
          setFormStatus({
            message: `Error: ${error.message || "Something went wrong. Please try again later."}`,
            isSuccess: false
          });
        }
      } else {
        setFormStatus({ message: "Thank you for joining our waitlist!", isSuccess: true });
        setEmail(""); // Clear the input on success
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setFormStatus({
        message: err instanceof Error ? `Error: ${err.message}` : "An unexpected error occurred. Please try again.",
        isSuccess: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!contactName.trim()) {
      setContactFormStatus({ message: "Please enter your name", isSuccess: false });
      return;
    }
    if (!contactEmail || !/\S+@\S+\.\S+/.test(contactEmail)) {
      setContactFormStatus({ message: "Please enter a valid email address", isSuccess: false });
      return;
    }
    if (!contactMessage.trim()) {
      setContactFormStatus({ message: "Please enter a message", isSuccess: false });
      return;
    }

    setIsContactSubmitting(true);
    setContactFormStatus(null);

    try {
      // Insert contact data into Supabase contactUs table
      const { error } = await supabase
        .from('contactUs')
        .insert([{
          name: contactName,
          email: contactEmail,
          message: contactMessage
        }]);

      if (error) {
        console.error('Supabase Error:', error);

        if (error.code === '42P01') {
          // Table doesn't exist
          setContactFormStatus({ message: "Configuration error: Contact table not found", isSuccess: false });
        } else if (error.message.includes('permission denied')) {
          setContactFormStatus({ message: "Configuration error: Permission denied", isSuccess: false });
        } else {
          setContactFormStatus({
            message: `Error: ${error.message || "Something went wrong. Please try again later."}`,
            isSuccess: false
          });
        }
      } else {
        setContactFormStatus({ message: "Thank you for your message! We'll get back to you soon.", isSuccess: true });
        // Clear form on success
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setContactFormStatus({
        message: err instanceof Error ? `Error: ${err.message}` : "An unexpected error occurred. Please try again.",
        isSuccess: false
      });
    } finally {
      setIsContactSubmitting(false);
    }
  };

  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Smooth scroll function
  const handleScrollTo = (elementId: string) => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const element = document.getElementById(elementId);
    if (element) {
      // Add active class to links
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => link.classList.remove('active'));
      document.querySelector(`[href="#${elementId}"]`)?.classList.add('active');

      // Smooth scroll to element
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for the sticky header
        behavior: 'smooth'
      });

      // Close drawer if open (for mobile)
      setIsDrawerOpen(false);
    }
  };

  // Animation observer setup
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(element => {
      observer.observe(element);
    });

    // Track scroll position for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isDrawerOpen]);

  return (
    <main className="min-h-screen bg-[#FCFCFC] dark:bg-[#0F1419] relative overflow-hidden font-sans transition-colors duration-300">
      {/* Subtle Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D0E8D4]/20 dark:bg-[#2A4E31]/10 rounded-full blur-[150px] opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#C7E6E1]/20 dark:bg-[#25483D]/10 rounded-full blur-[150px] opacity-50"></div>
      </div>

      {/* Mobile Side Drawer */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsDrawerOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 w-[80%] max-w-[300px] h-full bg-white dark:bg-[#111722] shadow-xl transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#3A7D44]/20 dark:bg-[#5AAE71]/20 rounded-full blur-md"></div>
                  <Image src="/logo.svg" alt="TrailMate Logo" width={28} height={28} className="relative" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-[#1E1E1E] to-[#3A7D44] dark:from-white dark:to-[#5AAE71] bg-clip-text text-transparent">TrailMate</span>
              </div>
              <button
                className="text-[#333333] dark:text-gray-200 hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-colors"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col space-y-6 text-lg">
              <a
                href="#waitlist"
                className="nav-link font-medium text-[#333333] dark:text-gray-200 hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-all duration-300 relative group"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('waitlist');
                }}
              >
                Get Early Access
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#3A7D44] dark:bg-[#5AAE71] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#features"
                className="nav-link font-medium text-[#333333] dark:text-gray-200 hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-all duration-300 relative group"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('features');
                }}
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#3A7D44] dark:bg-[#5AAE71] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#contact"
                className="nav-link font-medium text-[#333333] dark:text-gray-200 hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-all duration-300 relative group"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('contact');
                }}
              >
                Contact Us
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#3A7D44] dark:bg-[#5AAE71] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - changed from sticky to fixed */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#FCFCFC]/90 dark:bg-[#0F1419]/90 backdrop-blur-xl border-b border-[#E5E7EB]/50 dark:border-gray-800/50 transition-colors duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 hover:scale-105 transition-all duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-[#3A7D44]/20 dark:bg-[#5AAE71]/20 rounded-full blur-md"></div>
              <Image src="/logo.svg" alt="TrailMate Logo" width={32} height={32} className="relative hover:opacity-90 transition-opacity" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-[#1E1E1E] to-[#3A7D44] dark:from-white dark:to-[#5AAE71] bg-clip-text text-transparent tracking-tight">TrailMate</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-12">
              <a
                href="#waitlist"
                className="nav-link text-[15px] font-medium text-[#333333] dark:text-gray-200 hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-all duration-300 hover:scale-105 relative group"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('waitlist');
                }}
              >
                Get Early Access
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#3A7D44] dark:bg-[#5AAE71] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#features"
                className="nav-link text-[15px] font-medium text-[#333333] dark:text-gray-200 hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-all duration-300 hover:scale-105 relative group"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('features');
                }}
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#3A7D44] dark:bg-[#5AAE71] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#contact"
                className="nav-link text-[15px] font-medium text-[#333333] dark:text-gray-200 hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-all duration-300 hover:scale-105 relative group"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('contact');
                }}
              >
                Contact Us
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#3A7D44] dark:bg-[#5AAE71] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-[#333333] dark:text-gray-200 hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Add padding to body to offset fixed navbar */}
      <div className="pt-[72px]">
        {/* Hero Section with Waitlist */}
        <section className="container mx-auto px-6 pt-10 pb-16 md:pt-14 md:pb-20 flex flex-col md:flex-row items-center gap-16 relative">
          <div className="md:w-1/2 space-y-8 relative z-10 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3A7D44]/10 dark:bg-[#3A7D44]/20 text-[#3A7D44] dark:text-[#5AAE71] text-sm font-medium backdrop-blur-sm border border-[#3A7D44]/20 dark:border-[#5AAE71]/20">
              <Sparkles className="w-4 h-4" />
              <span>Coming Soon - Beta Access Available</span>
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl text-[#1E1E1E] dark:text-white  md:text-6xl font-bold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-[#1E1E1E] to-[#3A7D44] dark:from-white dark:to-[#5AAE71] bg-clip-text text-transparent">Explore Nature</span>
                <br />
                <span className="text-[#3A7D44] dark:text-[#5AAE71]">Sustainably</span> with TrailMate
              </h1>
              <p className="text-lg text-[#555555] dark:text-gray-300 leading-relaxed max-w-xl tracking-wide">
                Be among the first to experience the next generation of eco-friendly trail exploration. Help shape the future of sustainable outdoor adventures.
              </p>
            </div>

            <div id="waitlist" className="w-full space-y-4 scroll-mt-24">
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col md:flex-row group relative md:rounded-full">
                <div className="absolute inset-0 shadow-lg bg-gradient-to-r from-[#3A7D44]/20 to-[#5AAE71]/20 dark:from-[#3A7D44]/10 dark:to-[#5AAE71]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative w-full px-7 py-5 rounded-full border border-[#E5E7EB] dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A7D44]/30 dark:focus:ring-[#5AAE71]/30 focus:border-[#3A7D44]/50 dark:focus:border-[#5AAE71]/50 transition-all duration-300 bg-white/90 dark:bg-gray-800/90 dark:text-white backdrop-blur-sm text-base shadow-sm"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full md:w-auto shadow-lg bg-[#3A7D44] dark:bg-[#2D6235] text-white font-medium px-8 py-5 rounded-full mt-4 md:mt-0 md:ml-4 transition-all duration-300 text-base hover:bg-[#2D6235] dark:hover:bg-[#3A7D44] hover:shadow-lg hover:shadow-[#3A7D44]/20 dark:hover:shadow-[#5AAE71]/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 group-hover:shadow-[#3A7D44]/20 dark:group-hover:shadow-[#5AAE71]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="whitespace-nowrap">
                    {isSubmitting ? "Submitting..." : "Get Early Access"}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {formStatus && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${formStatus.isSuccess ? 'bg-[#3A7D44]/10 text-[#3A7D44] dark:bg-[#3A7D44]/20 dark:text-[#5AAE71]' : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                  {formStatus.isSuccess ?
                    <Check className="w-4 h-4" /> :
                    <AlertCircle className="w-4 h-4" />
                  }
                  <span className="text-sm font-medium">{formStatus.message}</span>
                </div>
              )}

              {!formStatus && (
                <p className="text-sm text-[#777777] dark:text-gray-400 flex items-center gap-2 pl-2">
                  <span className="w-2 h-2 rounded-full bg-[#5AAE71] dark:bg-[#5AAE71] animate-pulse"></span>
                  Selected users will receive beta access
                </p>
              )}
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center relative fade-in">
            <div className="absolute -inset-10 bg-gradient-to-br from-[#3A7D44]/5 via-[#5AAE71]/5 to-[#E3F4F1]/10 dark:from-[#3A7D44]/5 dark:via-[#5AAE71]/5 dark:to-[#25483D]/5 rounded-full blur-3xl opacity-70"></div>
            <div className="relative w-[700px] h-[800px] transform hover:scale-[1.02] transition-all duration-700 ease-in-out">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44]/10 to-[#5AAE71]/10 dark:from-[#3A7D44]/5 dark:to-[#5AAE71]/5 rounded-3xl blur-2xl"></div>
              <Image
                src="/heroImg.png"
                alt="TrailMate App Screenshot"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'contain' }}
                priority
                className="relative drop-shadow-2xl dark:brightness-90"
              />

              {/* Launch Badge */}
              <div className="absolute bottom-10 right-40 md:-right-6 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-[0_20px_50px_rgba(58,125,68,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#E5E7EB] dark:border-gray-700 backdrop-blur-sm transition-colors duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#3A7D44]/10 dark:bg-[#5AAE71]/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#3A7D44] dark:text-[#5AAE71]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#555555] dark:text-gray-300">Launch Status</p>
                    <p className="text-xl font-bold text-[#3A7D44] dark:text-[#5AAE71]">Beta Access Soon</p>
                  </div>
                </div>
              </div>

              {/* Mission Badge */}
              <div className="absolute -top-4 left-40 md:-left-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-[0_20px_50px_rgba(58,125,68,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#E5E7EB] dark:border-gray-700 backdrop-blur-sm transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5AAE71]/10 dark:bg-[#5AAE71]/10 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-[#5AAE71] dark:text-[#5AAE71]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#555555] dark:text-gray-300">Our Mission</p>
                    <p className="text-lg font-bold text-[#5AAE71] dark:text-[#5AAE71]">Eco-Friendly Trails</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 relative scroll-mt-24">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FCFCFC] to-[#F7F9F8] dark:from-[#0F1419] dark:to-[#111722] transition-colors duration-300"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 space-y-5 fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3A7D44]/10 dark:bg-[#3A7D44]/20 text-[#3A7D44] dark:text-[#5AAE71] text-sm font-medium backdrop-blur-sm border border-[#3A7D44]/20 dark:border-[#5AAE71]/20">
                <Leaf className="w-4 h-4" />
                <span>Planned Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-[#1E1E1E] to-[#3A7D44] dark:from-white dark:to-[#5AAE71] bg-clip-text text-transparent">Features that will make a difference</span>
              </h2>
              <p className="text-lg text-[#555555] dark:text-gray-300 max-w-2xl mx-auto">
                Here&apos;s what we&apos;re building - a platform that combines technology with environmental consciousness to enhance your outdoor adventures
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${feature.gradient} p-8 rounded-3xl shadow-[0_10px_40px_rgba(58,125,68,0.06)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(58,125,68,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 transform hover:-translate-y-2 border border-[#E5E7EB]/50 dark:border-gray-700/30 relative group fade-in`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 dark:from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-[#3A7D44] dark:text-[#5AAE71] mb-7 shadow-sm group-hover:shadow-md transition-shadow group-hover:scale-105 transition-transform duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-[#1E1E1E] dark:text-white tracking-tight">{feature.title}</h3>
                    <p className="text-[#555555] dark:text-gray-300 leading-relaxed mb-6">{feature.description}</p>
                    <div className="flex items-center gap-2 text-[#3A7D44] dark:text-[#5AAE71] font-medium">
                      <span>{feature.stats}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 relative scroll-mt-24">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F7F9F8] to-[#FCFCFC] dark:from-[#111722] dark:to-[#0F1419] transition-colors duration-300"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16 space-y-5 fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3A7D44]/10 dark:bg-[#3A7D44]/20 text-[#3A7D44] dark:text-[#5AAE71] text-sm font-medium backdrop-blur-sm border border-[#3A7D44]/20 dark:border-[#5AAE71]/20">
                  <Send className="w-4 h-4" />
                  <span>Get in Touch</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-[#1E1E1E] to-[#3A7D44] dark:from-white dark:to-[#5AAE71] bg-clip-text text-transparent">Let&apos;s Connect</span>
                </h2>
                <p className="text-lg text-[#555555] dark:text-gray-300">
                  Have questions about TrailMate? We&apos;d love to hear from you.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-10 rounded-3xl shadow-[0_20px_60px_rgba(58,125,68,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-[#E5E7EB]/70 dark:border-gray-700/30 relative group fade-in transition-colors duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44]/5 to-[#5AAE71]/5 dark:from-[#3A7D44]/5 dark:to-[#5AAE71]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#555555] dark:text-gray-300">Your Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl border border-[#E5E7EB] dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A7D44]/30 dark:focus:ring-[#5AAE71]/30 focus:border-[#3A7D44]/50 dark:focus:border-[#5AAE71]/50 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 dark:text-white backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#555555] dark:text-gray-300">Your Email</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl border border-[#E5E7EB] dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A7D44]/30 dark:focus:ring-[#5AAE71]/30 focus:border-[#3A7D44]/50 dark:focus:border-[#5AAE71]/50 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 dark:text-white backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-6">
                    <label className="text-sm font-medium text-[#555555] dark:text-gray-300">Your Message</label>
                    <textarea
                      placeholder="Tell us what's on your mind..."
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl border border-[#E5E7EB] dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A7D44]/30 dark:focus:ring-[#5AAE71]/30 focus:border-[#3A7D44]/50 dark:focus:border-[#5AAE71]/50 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 dark:text-white backdrop-blur-sm"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isContactSubmitting}
                    className="w-full mt-8 bg-[#3A7D44] dark:bg-[#2D6235] hover:bg-[#2D6235] dark:hover:bg-[#3A7D44] text-white font-medium px-12 py-5 rounded-full transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#3A7D44]/20 dark:hover:shadow-[#5AAE71]/20 transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 group-hover:shadow-[#3A7D44]/20 dark:group-hover:shadow-[#5AAE71]/20"
                  >
                    <span>
                      {isContactSubmitting ? "Sending..." : "Send Message"}
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {contactFormStatus && (
                    <div className={`mt-6 flex items-center gap-2 px-4 py-3 rounded-xl ${contactFormStatus.isSuccess
                      ? 'bg-[#3A7D44]/10 text-[#3A7D44] dark:bg-[#3A7D44]/20 dark:text-[#5AAE71]'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                      {contactFormStatus.isSuccess ?
                        <Check className="w-5 h-5 flex-shrink-0" /> :
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      }
                      <span className="text-sm font-medium">{contactFormStatus.message}</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-14 bg-white dark:bg-[#0F1419] border-t border-[#E5E7EB]/50 dark:border-gray-800/50 relative transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FCFCFC] to-white dark:from-[#0F1419] dark:to-[#0A0E14] transition-colors duration-300"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#3A7D44]/20 dark:bg-[#5AAE71]/20 rounded-full blur-md"></div>
                  <Image src="/logo.svg" alt="TrailMate Logo" width={24} height={24} className="relative" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-[#1E1E1E] to-[#3A7D44] dark:from-white dark:to-[#5AAE71] bg-clip-text text-transparent">TrailMate</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex flex-wrap justify-center md:justify-start space-x-6 md:space-x-10">
                  <a
                    href="#waitlist"
                    className="nav-link text-[#555555] dark:text-gray-400 hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-colors relative group py-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollTo('waitlist');
                    }}
                  >
                    Get Early Access
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3A7D44] dark:bg-[#5AAE71] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a
                    href="#features"
                    className="nav-link text-[#555555] dark:text-gray-400 hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-colors relative group py-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollTo('features');
                    }}
                  >
                    Features
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3A7D44] dark:bg-[#5AAE71] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a
                    href="#contact"
                    className="nav-link text-[#555555] dark:text-gray-400 hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-colors relative group py-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollTo('contact');
                    }}
                  >
                    Contact
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3A7D44] dark:bg-[#5AAE71] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </div>
                <div className="text-[#777777] dark:text-gray-500 text-sm">
                  © 2025 TrailMate. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-[#3A7D44] dark:bg-[#2D6235] text-white shadow-lg hover:bg-[#2D6235] dark:hover:bg-[#3A7D44] transform hover:-translate-y-1 transition-all duration-300 z-50 ${showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* CSS for animations */}
      <style jsx global>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </main>
  );
}
