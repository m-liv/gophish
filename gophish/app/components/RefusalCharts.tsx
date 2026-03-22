"use client";

import { useState, useEffect, useRef } from "react";

type ChartView = "refusal" | "trend";

interface ModelRefusal {
  model: string;
  provider: string;
  direct: number;
  jailbreak: number;
  color: string;
}

const refusalData: ModelRefusal[] = [
  {
    model: "Claude Sonnet 4.6",
    provider: "Anthropic",
    direct: 97,
    jailbreak: 9,
    color: "#00d4ff",
  },
  {
    model: "Llama 3.3 70B Instruct Turbo",
    provider: "Meta",
    direct: 78,
    jailbreak: 0,
    color: "#f59e0b",
  },
  {
    model: "GPT-4o",
    provider: "OpenAI",
    direct: 64,
    jailbreak: 0,
    color: "#10b981",
  },
  {
    model: "Gemini 2.5 Pro",
    provider: "Google",
    direct: 0,
    jailbreak: 0,
    color: "#7c3aed",
  },
];


interface TrendPoint {
  year: string;
  volume: number;
  successRate: number;
}

const trendData: TrendPoint[] = [
  { year: "2015", volume: 12, successRate: 18 },
  { year: "2016", volume: 18, successRate: 22 },
  { year: "2017", volume: 23, successRate: 20 },
  { year: "2018", volume: 31, successRate: 19 },
  { year: "2019", volume: 40, successRate: 17 },
  { year: "2020", volume: 75, successRate: 28 },
  { year: "2021", volume: 82, successRate: 25 },
  { year: "2022", volume: 95, successRate: 24 },
  { year: "2023", volume: 140, successRate: 31 },
  { year: "2024", volume: 220, successRate: 41 },
];

type PromptKey = "direct" | "jailbreak";

const promptLabels: Record<PromptKey, string> = {
  direct: "Direct Request",
  jailbreak: "Jailbreak Request",
};

const promptColors: Record<PromptKey, string> = {
  direct: "#10b981",
  jailbreak: "#ef4444",
};


export default function RefusalCharts() {
  const [activeView, setActiveView] = useState<ChartView>("refusal");
  const [activePrompt, setActivePrompt] = useState<PromptKey>("direct");
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimate(true);
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 100);
  }, [activeView, activePrompt]);

  return (
    <div ref={containerRef} className="space-y-6">
      {/* View tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "refusal", label: "Refusal Rates", icon: "🛡️" },
            { id: "trend", label: "Attack Trends", icon: "📈" },
          ] as { id: ChartView; label: string; icon: string }[]
        ).map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
              activeView === view.id
                ? "bg-[#00d4ff]/10 border-[#00d4ff]/30 text-[#00d4ff]"
                : "bg-[#0f1020] border-[#2a2b4a] text-[#64748b] hover:border-[#94a3b8]"
            }`}
          >
            <span>{view.icon}</span>
            {view.label}
          </button>
        ))}
      </div>

      {/* Refusal rates view */}
      {activeView === "refusal" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#64748b] italic">
              * Results from the GoPhish benchmark (36 direct / 108 jailbreak prompts, Claude Opus 4.6 as judge)
            </p>
          </div>

          {/* Prompt type selector */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(promptLabels) as PromptKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActivePrompt(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200"
                style={
                  activePrompt === key
                    ? {
                        backgroundColor: `${promptColors[key]}15`,
                        borderColor: `${promptColors[key]}50`,
                        color: promptColors[key],
                      }
                    : {
                        backgroundColor: "#0f1020",
                        borderColor: "#2a2b4a",
                        color: "#64748b",
                      }
                }
              >
                {promptLabels[key]}
              </button>
            ))}
          </div>

          {/* Bar chart */}
          <div className="bg-[#0f1020] border border-[#2a2b4a] rounded-xl p-5 space-y-4">
            <div className="text-sm font-semibold text-[#f0f0ff]">
              Refusal Rate:{" "}
              <span style={{ color: promptColors[activePrompt] }}>
                {promptLabels[activePrompt]}
              </span>
            </div>
            {refusalData.map((model) => (
              <div
                key={model.model}
                className="space-y-1 cursor-pointer"
                onMouseEnter={() => setHoveredModel(model.model)}
                onMouseLeave={() => setHoveredModel(null)}
              >
                <div className="flex justify-between items-baseline">
                  <span
                    className={`text-xs font-medium transition-colors ${hoveredModel === model.model ? "text-[#f0f0ff]" : "text-[#94a3b8]"}`}
                  >
                    {model.model}
                  </span>
                  <span className="text-xs text-[#64748b]">
                    {model.provider}
                  </span>
                </div>
                <div className="h-6 bg-[#1a1b35] rounded overflow-hidden relative">
                  <div
                    className="h-full rounded transition-all duration-1000 ease-out flex items-center pl-2"
                    style={{
                      width: animate
                        ? `${(model[activePrompt] / 100) * 100}%`
                        : "0%",
                      backgroundColor: model.color,
                      boxShadow: `0 0 12px ${model.color}40`,
                      minWidth: animate && model[activePrompt] > 5 ? "3rem" : "0",
                    }}
                  >
                    <span className="text-xs font-mono font-bold text-[#06060f]">
                      {model[activePrompt]}%
                    </span>
                  </div>
                </div>
                {hoveredModel === model.model && model.model === "WormGPT" && (
                  <div className="text-xs text-[#ef4444] italic">
                    Purpose-built criminal LLM with no safety restrictions
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Insight */}
          <div className="bg-[#1a1b35]/50 border border-[#2a2b4a] rounded-xl p-4">
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              <span className="text-[#f0f0ff] font-semibold">Key insight:</span>{" "}
              Jailbreak prompts collapse refusal rates to near zero across all models — including Claude, which dropped from 97% to 9%. Gemini 2.5 Pro complied with every direct phishing request in our benchmark. Only Claude showed meaningful resistance on direct prompts; no model held under jailbreak pressure.
            </p>
          </div>
        </div>
      )}

      {/* Trend view */}
      {activeView === "trend" && (
        <div className="space-y-4">
          <p className="text-xs text-[#64748b] italic">
            * Relative scale. Source: APWG, FBI IC3, Verizon DBIR (composite)
          </p>
          <div className="bg-[#0f1020] border border-[#2a2b4a] rounded-xl p-5">
            <div className="text-sm font-semibold text-[#f0f0ff] mb-6">
              Phishing Volume & Success Rate 2015–2024
            </div>

            {/* SVG chart */}
            <div className="relative">
              <svg viewBox="0 0 600 200" className="w-full" style={{ height: "200px" }}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((pct) => (
                  <line
                    key={pct}
                    x1="40"
                    y1={180 - (pct / 100) * 160}
                    x2="580"
                    y2={180 - (pct / 100) * 160}
                    stroke="#2a2b4a"
                    strokeWidth="1"
                  />
                ))}

                {/* Volume bars */}
                {trendData.map((d, i) => {
                  const x = 40 + (i * 540) / (trendData.length - 1);
                  const maxVol = Math.max(...trendData.map((t) => t.volume));
                  const barH = animate ? (d.volume / maxVol) * 140 : 0;
                  return (
                    <rect
                      key={d.year}
                      x={x - 15}
                      y={180 - barH}
                      width={22}
                      height={barH}
                      fill="#00d4ff"
                      fillOpacity={0.2}
                      rx={2}
                      style={{ transition: "all 1s ease-out" }}
                    />
                  );
                })}

                {/* Success rate line */}
                {animate && (
                  <polyline
                    points={trendData
                      .map((d, i) => {
                        const x = 40 + (i * 540) / (trendData.length - 1);
                        const y = 180 - (d.successRate / 50) * 160;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data points */}
                {animate &&
                  trendData.map((d, i) => {
                    const x = 40 + (i * 540) / (trendData.length - 1);
                    const y = 180 - (d.successRate / 50) * 160;
                    return (
                      <circle
                        key={d.year}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#ef4444"
                        stroke="#06060f"
                        strokeWidth="1.5"
                      />
                    );
                  })}

                {/* Year labels */}
                {trendData.map((d, i) => {
                  const x = 40 + (i * 540) / (trendData.length - 1);
                  return (
                    <text
                      key={d.year}
                      x={x}
                      y={198}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#64748b"
                    >
                      {d.year}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded bg-[#00d4ff]/20 border border-[#00d4ff]/40" />
                <span className="text-xs text-[#94a3b8]">Phishing volume (relative)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-[#ef4444]" />
                <span className="text-xs text-[#94a3b8]">Success rate %</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-xl p-4">
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              <span className="text-[#f59e0b] font-semibold">2020 & 2023 spikes:</span>{" "}
              COVID-19 created the 2020 surge in both volume and success rate. The 2023–2024 inflection point corresponds with widespread LLM availability — both attack volume and success rate climbed simultaneously, driven by AI-generated, personalized attacks at scale.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
