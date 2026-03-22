"use client";

import { useRef, useState, useEffect } from "react";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  icon: string;
  category: "origin" | "technique" | "scale" | "ai";
  severity: "low" | "medium" | "high" | "critical";
  detail: string;
}

const events: TimelineEvent[] = [
  {
    year: 1994,
    title: "AOHell & the Birth of Phishing",
    icon: "☎️",
    category: "origin",
    severity: "low",
    description:
      "A teenager creates AOHell, a toolkit for harassing AOL users. Phishers steal credit card numbers to create fake AOL accounts.",
    detail:
      "The term 'phishing' was coined on Usenet newsgroups, deliberately misspelling 'fishing' — hackers were fishing for victims. The AOL attacks were primitive by today's standards but established the playbook: impersonate a trusted authority, create urgency, steal credentials.",
  },
  {
    year: 1996,
    title: "The Word 'Phishing' Is Coined",
    icon: "🪝",
    category: "origin",
    severity: "low",
    description:
      "Hackers on alt.online-service.america-online document the technique. The 'ph' prefix (from phone phreaking) becomes standard.",
    detail:
      "Phone phreakers had long used 'ph' to replace 'f' — phile, phreaking, phishing. The same anti-authority hacker culture that cracked phone systems turned its attention to the nascent internet. It was playful. It was dangerous.",
  },
  {
    year: 2003,
    title: "Nigerian Prince Goes Mainstream",
    icon: "👑",
    category: "technique",
    severity: "medium",
    description:
      "419 advance-fee fraud reaches email inboxes worldwide. The FBI estimates $100M in losses from mass email scams.",
    detail:
      'The Nigerian Prince scam predates the internet — it\'s an evolution of 18th century "Spanish Prisoner" con letters. But email let criminals send millions of messages for free. The deliberately poor writing was intentional: only the most gullible would respond, pre-qualifying high-value targets.',
  },
  {
    year: 2004,
    title: "Spear Phishing Emerges",
    icon: "🎯",
    category: "technique",
    severity: "medium",
    description:
      "Attackers begin crafting targeted emails using personal data harvested from early social networks. Generic attacks evolve into precision strikes.",
    detail:
      "Early spear phishing targeted financial institutions and defense contractors. Attackers would research their victims on LinkedIn and early social networks, then craft emails that referenced their employer, colleagues, and projects. Hit rates skyrocketed compared to mass phishing.",
  },
  {
    year: 2007,
    title: "HTML Email Spoofing Perfected",
    icon: "🖥️",
    category: "technique",
    severity: "medium",
    description:
      "Phishing emails become indistinguishable from legitimate corporate communications. Pixel-perfect PayPal and bank clones proliferate.",
    detail:
      "HTML email support in mail clients became a double-edged sword. Legitimate companies used it for branded communications — so did criminals. Full CSS styling, proper logos, and convincing layouts made spotting fakes nearly impossible for average users.",
  },
  {
    year: 2011,
    title: "RSA Security Breach via Spear Phishing",
    icon: "🔐",
    category: "scale",
    severity: "high",
    description:
      "Nation-state actors compromise RSA Security with a single spear phishing email containing a malicious Excel attachment. SecurID tokens are compromised.",
    detail:
      'The subject line was "2011 Recruitment Plan." An employee opened the Excel file. A zero-day Flash exploit silently installed a Remote Access Trojan. The attack compromised the seeds of RSA\'s SecurID tokens — hardware used by defense contractors and intelligence agencies worldwide. One email. Global consequences.',
  },
  {
    year: 2016,
    title: "BEC Scams: $5 Billion Lost",
    icon: "💸",
    category: "scale",
    severity: "high",
    description:
      "Business Email Compromise (BEC) emerges as the most costly cybercrime. CEO fraud tricks finance teams into wiring millions to attacker accounts.",
    detail:
      "BEC required no malware, no exploits — just social engineering. Attackers would compromise or spoof an executive's email, then request urgent wire transfers. The FBI reported $5.3B in losses by 2016. Companies like Ubiquiti lost $46.7M in a single BEC attack.",
  },
  {
    year: 2020,
    title: "COVID-19: Phishing Surges 600%",
    icon: "🦠",
    category: "scale",
    severity: "high",
    description:
      "The pandemic creates perfect phishing conditions: fear, uncertainty, remote work, and reduced security oversight. Attacks surge 600% in weeks.",
    detail:
      "Attackers pivoted to pandemic themes within days of WHO announcements: fake PPE suppliers, vaccine registration portals, stimulus check notifications, health organization impersonations. The shift to remote work created millions of new attack surfaces — home networks, personal devices, overwhelmed IT teams.",
  },
  {
    year: 2022,
    title: "FraudGPT & WormGPT: AI Goes Criminal",
    icon: "🤖",
    category: "ai",
    severity: "critical",
    description:
      "Purpose-built uncensored LLMs appear on dark web forums for $200/month. They generate convincing phishing content without safety restrictions.",
    detail:
      "FraudGPT and WormGPT were fine-tuned on criminal data — phishing templates, malware code, fraud scripts. Advertised on Telegram and dark web forums, they democratized sophisticated social engineering. No programming knowledge required. \"Just describe your target and get a personalized phishing email in seconds.\"",
  },
  {
    year: 2024,
    title: "Agentic AI Phishing at Scale",
    icon: "🕸️",
    category: "ai",
    severity: "critical",
    description:
      "AI agents autonomously conduct end-to-end phishing campaigns: researching targets, crafting personalized emails, managing responses, and executing credential harvesting.",
    detail:
      "Modern agentic AI systems can browse the web, read LinkedIn profiles, craft personalized emails, send follow-ups, manage multi-stage campaigns, and exfiltrate credentials — all autonomously. What once required a team of skilled social engineers now requires a $20 API key. The asymmetry between attack cost and defense cost has never been greater.",
  },
];

const categoryColors = {
  origin: { text: "text-[#94a3b8]", bg: "bg-[#94a3b8]/10", border: "border-[#94a3b8]/30" },
  technique: { text: "text-[#00d4ff]", bg: "bg-[#00d4ff]/10", border: "border-[#00d4ff]/30" },
  scale: { text: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/30" },
  ai: { text: "text-[#ef4444]", bg: "bg-[#ef4444]/10", border: "border-[#ef4444]/30" },
};

const severityLine = {
  low: "bg-[#94a3b8]",
  medium: "bg-[#00d4ff]",
  high: "bg-[#f59e0b]",
  critical: "bg-[#ef4444]",
};

export default function PhishingTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(el.scrollLeft / max);

    const cards = Array.from(el.querySelectorAll(":scope > div")) as HTMLElement[];
    const viewportCenter = el.scrollLeft + el.clientWidth / 2;
    let closest = 0, minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - viewportCenter);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIndex(closest);
  };

  const scrollTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll(":scope > div")) as HTMLElement[];
    const card = cards[idx];
    if (!card) return;
    const left = card.offsetLeft - el.clientWidth / 2 + card.offsetWidth / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(categoryColors).map(([cat, colors]) => (
          <div key={cat} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${colors.bg} ${colors.border} ${colors.text}`}>
            <span className="capitalize">{cat === "ai" ? "AI Era" : cat}</span>
          </div>
        ))}
      </div>

      {/* Scroll progress bar */}
      <div className="relative">
        <div className="h-1 bg-[#1a1b35] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#94a3b8] via-[#00d4ff] to-[#ef4444] rounded-full transition-all duration-100"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-[#64748b] font-mono">1994</span>
          <span className="text-xs text-[#64748b] font-mono">2024</span>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-4 timeline-scroll snap-x snap-mandatory"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {events.map((event, i) => {
          const colors = categoryColors[event.category];
          const isActive = activeIndex === i;

          return (
            <div
              key={i}
              className="flex-shrink-0 w-72 snap-center"
              onClick={() => setActiveIndex(i)}
            >
              {/* Year marker */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`h-px flex-1 ${severityLine[event.severity]} opacity-40`}
                />
                <div
                  className={`text-sm font-mono font-bold transition-all duration-300 ${isActive ? "text-[#f0f0ff]" : "text-[#64748b]"}`}
                >
                  {event.year}
                </div>
                <div
                  className={`h-px flex-1 ${severityLine[event.severity]} opacity-40`}
                />
              </div>

              {/* Card */}
              <div
                className={`border rounded-xl p-5 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? `${colors.bg} ${colors.border} shadow-lg`
                    : "bg-[#0f1020] border-[#2a2b4a] hover:border-[#2a2b4a]/80"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{event.icon}</span>
                  <div>
                    <div className={`text-xs font-mono uppercase tracking-wider mb-1 ${colors.text}`}>
                      {event.category === "ai" ? "AI Era" : event.category}
                    </div>
                    <h3 className="text-sm font-bold text-[#f0f0ff] leading-tight">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#94a3b8] leading-relaxed mb-3">
                  {event.description}
                </p>

                {isActive && (
                  <div className={`mt-3 pt-3 border-t ${colors.border}`}>
                    <p className="text-xs text-[#64748b] leading-relaxed italic">
                      {event.detail}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${severityLine[event.severity]}`}
                  />
                  <span className="text-xs text-[#64748b] capitalize">
                    {event.severity} severity
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dot navigation */}
      <div className="flex items-center justify-center gap-2">
        {events.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              activeIndex === i
                ? "w-6 h-2 bg-[#00d4ff]"
                : "w-2 h-2 bg-[#2a2b4a] hover:bg-[#94a3b8]"
            }`}
          />
        ))}
      </div>

      {/* Active event detail panel */}
      <div className="bg-[#0f1020] border border-[#2a2b4a] rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{events[activeIndex].icon}</span>
          <div>
            <div className="text-xs text-[#64748b] font-mono">
              {events[activeIndex].year}
            </div>
            <div className="text-base font-bold text-[#f0f0ff]">
              {events[activeIndex].title}
            </div>
          </div>
        </div>
        <p className="text-sm text-[#94a3b8] leading-relaxed">
          {events[activeIndex].detail}
        </p>
      </div>
    </div>
  );
}
