"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface StaticPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function StaticPageLayout({ title, subtitle, children }: StaticPageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white/80 overflow-x-hidden selection:bg-white/20">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/5 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Floating Back Button */}
      <div className="fixed top-6 left-6 md:top-8 md:left-8 z-50">
        <Link 
          href="/"
          className="flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all duration-300 group shadow-lg"
        >
          <ArrowLeft size={20} className="text-white/60 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-[800px] mx-auto px-6 pt-32 pb-24 min-h-screen flex flex-col">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 uppercase">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/50 font-medium tracking-wide">
              {subtitle}
            </p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-white/40 to-transparent mt-8 rounded-full" />
        </motion.header>

        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:text-yellow-300 prose-p:leading-relaxed prose-p:text-white/70 prose-li:text-white/70 flex-grow"
        >
          {children}
        </motion.main>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-24 pt-8 border-t border-white/10 text-center text-sm text-white/30 uppercase tracking-widest"
        >
          © {new Date().getFullYear()} WhatToWatch. All rights reserved.
        </motion.footer>
      </div>
    </div>
  );
}
