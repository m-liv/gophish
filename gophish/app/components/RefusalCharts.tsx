"use client";

import { useState, useEffect, useRef } from "react";

type ChartView = "refusal" | "detection" | "trend";

interface ModelRefusal {
  model: string;
  provider: string;
  direct: number;
  educational: number;
  fictional: number;
  pentest: number;
  color: string;
}

const refusalData: ModelRefusal[] = [
  {
    model: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    direct: 97,
    educational: 89,
    fictional: 85,
    pentest: 81,
    color: "#00d4ff",
  },
  {
    model: "GPT-4o",
    provider: "OpenAI",
    direct: 94,
    educational: 76,
    fictional: 71,
    pentest: 68,
    color: "#10b981",
  },
  {
    model: "Gemini 1.5 Pro",
    provider: "Google",
    direct: 91,
    educational: 74,
    fictional: 69,
    pentest: 65,
    color: "#7c3aed",
  },
  {
    model: "Llama 3.1 70B",
    provider: "Meta",
    direct: 73,
    educational: 45,
    fictional: 38,
    pentest: 32,
    color: "#f59e0b",
  },
  {
    model: "Mistral Large",
    provider: "Mistral AI",
    direct: 68,
    educational: 41,
    fictional: 35,
    pentest: 29,
    color: "#ec4899",
  },
  {
    model: "WormGPT",
    provider: "Criminal (dark web)",
    direct: 2,
    educational: 1,
    fictional: 1,
    pentest: 0,
    color: "#ef4444",
  },
];

interface DetectionStat {
  label: string;
  value: number;
  color: string;
  note: string;
}

const detectionData: DetectionStat[] = [
  {
    label: "Human (untrained)",
    value: 72,
    color: "#64748b",
    note: "Average person, no security awareness training",
  },
  {
    label: "Human (trained)",
    value: 84,
    color: "#94a3b8",
    note: "After standard corporate security awareness training",
  },
  {
    label: "GPT-4o as detector",
    value: 87,
    color: "#10b981",
    note: "Using GPT-4 as a binary phishing classifier",
  },
  {
    label: "Claude 3.5 as detector",
    value: 91,
    color: "#00d4ff",
    note: "Using Claude 3.5 with structured analysis prompt",
  },
  {
    label: "Specialized ML model",
    value: 94,
    color: "#7c3aed",
    note: "Fine-tuned BERT classifier on phishing datasets",
  },
  {
    label: "LLM-generated (detected)",
    value: 61,
    color: "#ef4444",
    note: "Detection rate for AI-generated spear phishing (harder to detect)",
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

type PromptKey = "direct" | "educational" | "fictional" | "pentest";

const promptLabels: Record<PromptKey, string> = {
  direct: "Direct Request",
  educational: "Educational Framing",
  fictional: "Fictional Framing",
  pentest: "Pen Test Framing",
};

const promptColors: Record<PromptKey, string> = {
  direct: "#10b981",
  educational: "#f59e0b",
  fictional: "#ef4444",
  pentest: "#ff00ff",
};

function AnimatedBar({
  value,
  max,
  color,
  animate,
  label,
  subLabel,
}: {
  value: number;
  max: number;
  color: string;
  animate: boolean;
  label?: string;
  subLabel?: string;
}) {
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-[#94a3b8]">{label}</span>
          {subLabel && (
            <span className="text-xs text-[#64748b] italic">{subLabel}</span>
          )}
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-5 bg-[#1a1b35] rounded overflow-hidden relative">
          <div
            className="h-full rounded transition-all duration-1000 ease-out flex items-center pl-2"
            style={{
              width: animate ? `${(value / max) * 100}%` : "0%",
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}40`,
              minWidth: animate ? "2rem" : "0",
            }}
          >
            <span className="text-xs font-mono font-bold text-[#06060f] whitespace-nowrap">
              {value}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
            { id: "detection", label: "Detection Accuracy", icon: "🔍" },
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
              * Placeholder values based on published safety benchmarks
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
              As prompt sophistication increases, refusal rates drop significantly — even for safety-aligned models. The gap between direct requests (high refusal) and pen test framing (lower refusal) represents the attack surface that adversarial prompt engineers exploit.
            </p>
          </div>
        </div>
      )}

      {/* Detection accuracy view */}
      {activeView === "detection" && (
        <div className="space-y-4">
          <p className="text-xs text-[#64748b] italic">
            * Placeholder values. Actual accuracy varies significantly by dataset and evaluation methodology.
          </p>
          <div className="bg-[#0f1020] border border-[#2a2b4a] rounded-xl p-5 space-y-5">
            <div className="text-sm font-semibold text-[#f0f0ff]">
              Phishing Detection Accuracy by Detector Type
            </div>
            {detectionData.map((stat) => (
              <div key={stat.label} className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-medium text-[#94a3b8]">
                    {stat.label}
                  </span>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}%
                  </span>
                </div>
                <div className="h-2 bg-[#1a1b35] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: animate ? `${stat.value}%` : "0%",
                      backgroundColor: stat.color,
                      boxShadow: `0 0 8px ${stat.color}40`,
                    }}
                  />
                </div>
                <div className="text-xs text-[#64748b] italic">{stat.note}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl p-4">
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              <span className="text-[#ef4444] font-semibold">The detection gap:</span>{" "}
              LLM-generated spear phishing is detected at only <span className="text-[#ef4444] font-bold">61%</span> — far below the 91–94% rates for generic phishing. This is because AI-generated emails are grammatically perfect, contextually personalized, and free from the spelling errors that traditional filters rely on.
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
