"use client";

import React, { useState } from "react";
import StaticPageLayout from "@/components/StaticPageLayout";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate network request
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <StaticPageLayout title="Contact Us" subtitle="We'd love to hear from you.">
      <p>
        Have a question, a feature request, or just want to tell us about an amazing movie you discovered through our platform? Drop us a message below!
      </p>

      <div className="mt-12 bg-[#0a0a0a] border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            <CheckCircle2 size={64} className="text-green-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2 mt-0">Message Sent!</h3>
            <p className="text-white/60 mb-8">
              Thank you for reaching out. We&apos;ll get back to you as soon as possible.
            </p>
            <button 
              onClick={() => setStatus("idle")}
              className="px-6 py-2 border border-white/20 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-white/5 transition-colors"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-widest text-white/50 pl-2">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/20"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-white/50 pl-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/20"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-[11px] font-bold uppercase tracking-widest text-white/50 pl-2">Subject</label>
              <select 
                id="subject"
                className="bg-[#111] border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 transition-all appearance-none"
              >
                <option value="feedback">General Feedback</option>
                <option value="bug">Report a Bug</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-widest text-white/50 pl-2">Message</label>
              <textarea 
                id="message" 
                required
                rows={5}
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/20 resize-none"
                placeholder="How can we help you?"
              />
            </div>

            <button 
              type="submit" 
              disabled={status === "sending"}
              className="mt-4 flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl text-[14px] font-bold tracking-widest uppercase transition-all duration-300 shadow-xl hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Sending..." : (
                <>Send Message <Send size={16} /></>
              )}
            </button>
          </form>
        )}
      </div>
    </StaticPageLayout>
  );
}
