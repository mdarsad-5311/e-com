"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, Camera, Mic, X } from "lucide-react";

interface MobileSearchBarProps {
  initialQuery?: string;
  placeholder?: string;
}

export default function MobileSearchBar({
  initialQuery = "",
  placeholder = "Search for products, brands and more...",
}: MobileSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/products?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (SpeechRecognition as any)();
        recognition.lang = "en-US";
        recognition.start();
        setIsListening(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setQuery(speechResult);
          setIsListening(false);
          router.push(`/products?q=${encodeURIComponent(speechResult)}`);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
      } catch {
        setIsListening(false);
        router.push("/search");
      }
    } else {
      router.push("/search");
    }
  };

  return (
    <div className="al-mobile-searchbar-container">
      <form className="al-mobile-searchbar-form" onSubmit={handleSubmit}>
        <div className="al-mobile-search-icon-left">
          <Search size={18} />
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="al-mobile-search-input"
          aria-label="Search products"
        />

        <div className="al-mobile-search-actions-right">
          {query.trim().length > 0 ? (
            <button
              type="button"
              className="al-mobile-search-action-btn"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : null}

          <button
            type="button"
            className="al-mobile-search-action-btn"
            onClick={() => router.push("/search")}
            title="Scan & Search"
            aria-label="Visual product search"
          >
            <Camera size={18} />
          </button>

          <button
            type="button"
            className={`al-mobile-search-action-btn ${isListening ? "listening" : ""}`}
            onClick={handleVoiceSearch}
            title={isListening ? "Listening..." : "Voice Search"}
            aria-label="Voice Search"
          >
            <Mic size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
