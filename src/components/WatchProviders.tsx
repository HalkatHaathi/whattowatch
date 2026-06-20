"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getWatchProviders } from "@/app/actions";
import { ExternalLink, Play, AlertCircle } from "lucide-react";

interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

interface WatchProvidersResponse {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
}

interface WatchProvidersProps {
  mediaId: string;
  type: "movie" | "show";
  title: string;
  fallbackLink: string;
}

const COMMON_COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "BR", name: "Brazil" },
];

function getProviderSearchUrl(providerName: string, title: string): string {
  const query = encodeURIComponent(title);
  const name = providerName.toLowerCase();

  if (name.includes("netflix")) {
    return `https://www.netflix.com/search?q=${query}`;
  }
  if (name.includes("prime video") || name.includes("amazon video") || name.includes("amazon prime")) {
    return `https://www.amazon.com/s?k=${query}&i=instant-video`;
  }
  if (name.includes("disney")) {
    return `https://www.disneyplus.com/search?q=${query}`;
  }
  if (name.includes("apple tv")) {
    return `https://tv.apple.com/search?term=${query}`;
  }
  if (name.includes("hulu")) {
    return `https://www.hulu.com/search?q=${query}`;
  }
  if (name.includes("max") || name.includes("hbo")) {
    return `https://www.max.com/search?q=${query}`;
  }
  if (name.includes("google play")) {
    return `https://play.google.com/store/search?q=${query}&c=movies`;
  }
  if (name.includes("peacock")) {
    return `https://www.peacocktv.com/`;
  }
  if (name.includes("youtube")) {
    return `https://www.youtube.com/results?search_query=${query}+movie`;
  }
  if (name.includes("crunchyroll")) {
    return `https://www.crunchyroll.com/search?q=${query}`;
  }
  if (name.includes("paramount")) {
    return `https://www.paramountplus.com/`;
  }
  // Fallback: Google search for watching the title on that platform
  return `https://www.google.com/search?q=watch+${encodeURIComponent(title)}+on+${encodeURIComponent(providerName)}`;
}

export default function WatchProviders({ mediaId, type, title, fallbackLink }: WatchProvidersProps) {
  const [results, setResults] = useState<Record<string, WatchProvidersResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("US");

  useEffect(() => {
    // Attempt auto-detection of country on client side
    try {
      const locale = navigator.language || "";
      if (locale.includes("-")) {
        const countryPart = locale.split("-")[1].toUpperCase();
        if (countryPart && countryPart.length === 2) {
          setSelectedCountry(countryPart);
        }
      } else {
        // Fallback checks using common timezones
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz.includes("Kolkata") || tz.includes("Calcutta")) {
          setSelectedCountry("IN");
        } else if (tz.includes("London")) {
          setSelectedCountry("GB");
        }
      }
    } catch (e) {
      console.error("Failed to auto-detect country", e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getWatchProviders(mediaId, type)
      .then((res) => {
        setResults(res);
        
        // Smart fallback logic: if detected country has no streaming data,
        // switch to the first country in results that does, or fallback to US
        if (res && (!res[selectedCountry] || (!res[selectedCountry].flatrate && !res[selectedCountry].free))) {
          const availableCountries = Object.keys(res);
          const firstCountryWithStreaming = availableCountries.find(
            (c) => res[c]?.flatrate?.length || res[c]?.free?.length
          );
          if (firstCountryWithStreaming) {
            setSelectedCountry(firstCountryWithStreaming);
          } else if (availableCountries.length > 0) {
            setSelectedCountry(availableCountries[0]);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching watch providers", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [mediaId, type]);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2 w-full max-w-[320px] mx-auto animate-pulse">
        <div className="h-3 w-24 bg-white/10 rounded-full" />
        <div className="flex gap-2 justify-center mt-1">
          <div className="w-9 h-9 rounded-xl bg-white/10" />
          <div className="w-9 h-9 rounded-xl bg-white/10" />
          <div className="w-9 h-9 rounded-xl bg-white/10" />
        </div>
      </div>
    );
  }

  // Return null if API key not present/failed or no results at all (main card handles generic Watch Now button)
  if (!results || Object.keys(results).length === 0) {
    return null;
  }

  const countryData = results[selectedCountry];
  const streamingProviders = [
    ...(countryData?.flatrate || []),
    ...(countryData?.free || []),
  ];

  // Remove duplicate providers if any
  const uniqueProviders = streamingProviders.filter(
    (value, index, self) => self.findIndex((p) => p.provider_id === value.provider_id) === index
  );

  // Available countries from results
  const availableCountryCodes = Object.keys(results).sort();
  const countryOptions = COMMON_COUNTRIES.filter((c) => availableCountryCodes.includes(c.code));
  
  // Include other detected countries not in COMMON_COUNTRIES
  availableCountryCodes.forEach((code) => {
    if (!countryOptions.some((c) => c.code === code)) {
      countryOptions.push({ code, name: code });
    }
  });

  return (
    <div className="flex flex-col items-center gap-2.5 w-full">
      <div className="flex items-center justify-between gap-4 w-full px-2">
        <span className="text-[11px] tracking-[0.15em] font-bold text-white/50 uppercase leading-none">
          Stream On
        </span>
        {countryOptions.length > 1 && (
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="appearance-none bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full px-3 py-1 pr-6 text-[10px] font-semibold text-white/80 outline-none transition-all cursor-pointer"
            >
              {countryOptions.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#0f0f0f] text-white">
                  {c.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white/50 text-[8px]">
              ▼
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex flex-wrap justify-center items-center gap-3">
        {uniqueProviders.length > 0 ? (
          uniqueProviders.map((provider) => {
            const searchUrl = getProviderSearchUrl(provider.provider_name, title);
            return (
              <motion.a
                key={provider.provider_id}
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center justify-center w-11 h-11 rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all cursor-pointer"
                title={`Watch on ${provider.provider_name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                  alt={provider.provider_name}
                  className="w-full h-full object-cover"
                />
                
                {/* Sleek Tooltip */}
                <span className="absolute bottom-full mb-2 hidden group-hover:block bg-black/90 border border-white/10 text-white text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap z-50 shadow-xl pointer-events-none tracking-tight">
                  {provider.provider_name}
                </span>
              </motion.a>
            );
          })
        ) : (
          <div className="flex flex-col items-center gap-1 w-full pt-1 text-center justify-center">
            <span className="text-[12px] text-white/40 flex items-center gap-1.5 justify-center">
              <AlertCircle size={13} /> Not available to stream in {COMMON_COUNTRIES.find(c => c.code === selectedCountry)?.name || selectedCountry}.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
