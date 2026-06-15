import { Metadata } from "next";
import StaticPageLayout from "@/components/StaticPageLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | What To Watch",
  description: "Learn more about the team behind What To Watch and our mission to cure decision fatigue.",
};

export default function AboutPage() {
  return (
    <StaticPageLayout title="About Us" subtitle="Curing the paradox of choice.">
      <p className="lead text-xl text-white">
        We built <strong>WhatToWatch</strong> because we were tired of spending more time searching for a movie than actually watching it.
      </p>

      <h2>Our Mission</h2>
      <p>
        In the era of infinite streaming services, the paradox of choice is real. You sit down with a hot meal, open your favorite streaming app, and spend 45 minutes scrolling through endless grids of thumbnails. By the time you finally pick something, your food is cold and you&apos;re too tired to pay attention.
      </p>
      <p>
        Our mission is to act as your ultimate <em>online ruler</em> for entertainment—a precision tool designed to cut through the noise. We believe that technology should do the heavy lifting of decision-making, allowing you to focus on the experience of great cinema and television.
      </p>

      <h2>How It Works</h2>
      <p>
        We&apos;ve curated a database of the highest-rated, most critically acclaimed, and culturally significant movies and TV shows. Instead of bombarding you with choices, our engine uses a simple, intuitive wizard:
      </p>
      <ul>
        <li><strong>Mood:</strong> Tell us how you feel. We map complex emotions to genres and pacing.</li>
        <li><strong>Time:</strong> Only have 20 minutes? We&apos;ll recommend a quick sitcom. Have 3 hours? We&apos;ll give you an epic.</li>
        <li><strong>Roulette:</strong> For the truly indecisive, our Roulette feature leaves your evening up to the cinematic gods.</li>
      </ul>

      <h2>The Design Philosophy</h2>
      <p>
        We intentionally designed WhatToWatch to be immersive, cinematic, and incredibly fast. No logins, no paywalls, no bloated features. Just a sleek, distraction-free environment that gets you from &quot;I don&apos;t know what to watch&quot; to pressing play in under 30 seconds.
      </p>

      <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-2xl text-center">
        <h3 className="text-2xl font-bold text-white mb-4 mt-0">Ready to find your next favorite?</h3>
        <Link 
          href="/" 
          className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors no-underline"
        >
          Start Exploring
        </Link>
      </div>
    </StaticPageLayout>
  );
}
