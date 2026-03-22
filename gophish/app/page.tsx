"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import PhishingQuiz from "./components/PhishingQuiz";
import PhishingTimeline from "./components/PhishingTimeline";
import ChatSimulation from "./components/ChatSimulation";
import JailbreakChat from "./components/JailbreakChat";
import RefusalCharts from "./components/RefusalCharts";
import AgentSimulation from "./components/AgentSimulation";
import PhishingAwareness from "./components/PhishingAwareness";

// ─── Section scroll animation wrapper ───────────────────────────────────────
function Section({
  id,
  children,
  onVisible,
}: {
  id: string;
  children: ReactNode;
  onVisible?: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          onVisible?.(id);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [id, onVisible]);

  return (
    <div ref={ref} id={id} className="section-enter">
      {children}
    </div>
  );
}

// ─── Article section card ────────────────────────────────────────────────────
function ArticleSection({
  number,
  tag,
  title,
  subtitle,
  children,
  accentColor = "#00d4ff",
  id,
  onVisible,
}: {
  number: string;
  tag: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  accentColor?: string;
  id: string;
  onVisible?: (id: string) => void;
}) {
  return (
    <Section id={id} onVisible={onVisible}>
      <div className="py-16 border-b border-[#2a2b4a]/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <span
                className="font-mono text-5xl font-black opacity-10 select-none"
                style={{ color: accentColor }}
              >
                {number}
              </span>
              <div
                className="text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}40`,
                  backgroundColor: `${accentColor}10`,
                }}
              >
                {tag}
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#f0f0ff] leading-tight mb-3">
              {title}
            </h2>
            <p className="text-[#94a3b8] text-base leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          </div>

          {/* Interactive content */}
          <div className="bg-[#0d0d1a] border border-[#2a2b4a] rounded-2xl p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Nav dot ─────────────────────────────────────────────────────────────────
const navSections = [
  { id: "quiz", label: "Detection Quiz" },
  { id: "timeline", label: "History" },
  { id: "chat", label: "LLM Chat" },
  { id: "jailbreak", label: "Jailbreaks" },
  { id: "charts", label: "Statistics" },
  { id: "agent", label: "AI Agent" },
  { id: "awareness", label: "Awareness" },
];

// ─── Main page ───────────────────────────────────────────────────────────────
export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("quiz");

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#06060f] grid-pattern">
      {/* ── Floating nav dots ─────────────────────────────────────────── */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {navSections.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollToSection(s.id)}
            title={s.label}
            className="group flex items-center gap-2 justify-end"
          >
            <span className="text-xs text-[#64748b] opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f1020] border border-[#2a2b4a] px-2 py-1 rounded">
              {s.label}
            </span>
            <div
              className={`rounded-full transition-all duration-300 ${
                activeSection === s.id
                  ? "w-3 h-3 bg-[#00d4ff]"
                  : "w-2 h-2 bg-[#2a2b4a] hover:bg-[#64748b]"
              }`}
              style={activeSection === s.id ? { boxShadow: "0 0 8px #00d4ff" } : {}}
            />
          </button>
        ))}
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-5"
            style={{
              background: "radial-gradient(circle, #ef4444 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00d4ff] px-4 py-2 rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
            Interactive Research Article · 2026
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#f0f0ff] leading-none">
            The Phishing{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #00d4ff, #7c3aed)",
              }}
            >
              Frontier
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-light text-[#94a3b8]">
            AI at the Hook
          </p>

          <p className="text-base text-[#64748b] leading-relaxed max-w-xl mx-auto">
            How large language models are reshaping the economics of phishing — on both sides of the attack. An interactive exploration of AI-generated threats, detection limits, and the race to secure the human inbox.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />6 interactive features
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
              Live API calls
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
              Real research data
            </span>
          </div>

          <button
            onClick={() => scrollToSection("quiz")}
            className="mt-4 px-8 py-4 rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] font-semibold text-base hover:bg-[#00d4ff]/20 transition-all duration-200 glow-cyan"
          >
            Start Reading ↓
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-[#00d4ff]/40 to-transparent mx-auto" />
        </div>
      </header>

      {/* ── Intro prose ────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 border-b border-[#2a2b4a]/50">
        <div className="max-w-2xl space-y-5 text-[#94a3b8] leading-relaxed text-base">
          <p>
            For three decades, phishing was a numbers game. Send a million emails, catch a few thousand victims. The technique was crude: poor grammar, implausible scenarios, and obvious sender spoofing meant that most people — and most spam filters — could spot the bait.
          </p>
          <p>
            Then came large language models.
          </p>
          <p>
            In 2023, researchers demonstrated that GPT-4 could produce phishing emails indistinguishable from genuine corporate communications. By 2024, AI agents were conducting end-to-end spear phishing campaigns — researching targets, crafting personalized lures, and managing multi-stage attacks — with zero human involvement.
          </p>
          <p>
            The economics flipped overnight.{" "}
            <span className="text-[#f0f0ff] font-medium">
              What once required a skilled social engineer now costs less than a cup of coffee.
            </span>
          </p>
          <p>
            This article explores that frontier — interactively.
          </p>
        </div>
      </div>

      {/* ── Feature 1: Detection Quiz ───────────────────────────────────── */}
      <ArticleSection
        id="quiz"
        number="01"
        tag="Interactive Test"
        title="Are You Better Than an LLM?"
        subtitle="Test your ability to distinguish phishing from legitimate email — then compare your accuracy against state-of-the-art language models. The results may surprise you."
        accentColor="#00d4ff"
        onVisible={setActiveSection}
      >
        <PhishingQuiz />
      </ArticleSection>

      {/* ── Prose bridge ────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 border-b border-[#2a2b4a]/50">
        <div className="max-w-2xl space-y-4 text-[#94a3b8] leading-relaxed text-base">
          <p>
            Detection accuracy matters — but it&apos;s only half the story. To understand where we are today, we need to understand how we got here.
          </p>
        </div>
      </div>

      {/* ── Feature 2: Timeline ────────────────────────────────────────── */}
      <ArticleSection
        id="timeline"
        number="02"
        tag="History"
        title="30 Years of Phishing"
        subtitle="From AOHell to agentic AI — trace the evolution of social engineering attacks across three decades of the internet."
        accentColor="#7c3aed"
        onVisible={setActiveSection}
      >
        <PhishingTimeline />
      </ArticleSection>

      {/* ── Prose bridge ────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 border-b border-[#2a2b4a]/50">
        <div className="max-w-2xl space-y-4 text-[#94a3b8] leading-relaxed text-base">
          <p>
            The inflection point was 2022–2023. For the first time, anyone with an internet connection could ask an AI to write a convincing phishing email. What happened when they did?
          </p>
        </div>
      </div>

      {/* ── Feature 3: Chat Simulation ─────────────────────────────────── */}
      <ArticleSection
        id="chat"
        number="03"
        tag="Live Experiment"
        title="Ask the Models Yourself"
        subtitle="Submit a phishing generation request to different AI models and see their real responses. Claude models respond live via API — other models show research-based simulations."
        accentColor="#10b981"
        onVisible={setActiveSection}
      >
        <ChatSimulation />
      </ArticleSection>

      {/* ── Prose bridge ────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 border-b border-[#2a2b4a]/50">
        <div className="max-w-2xl space-y-4 text-[#94a3b8] leading-relaxed text-base">
          <p>
            Safety-aligned models refuse direct requests. But attackers don&apos;t send direct requests — they craft context. The art of the jailbreak is finding framings that make harmful requests look legitimate.
          </p>
        </div>
      </div>

      {/* ── Feature 4: Jailbreak Chat ──────────────────────────────────── */}
      <ArticleSection
        id="jailbreak"
        number="04"
        tag="Adversarial Testing"
        title="The Art of the Jailbreak"
        subtitle="Explore how different prompt framings attempt to bypass model safety guardrails. The same underlying request — reframed as educational, fictional, or professional — produces very different results."
        accentColor="#f59e0b"
        onVisible={setActiveSection}
      >
        <JailbreakChat />
      </ArticleSection>

      {/* ── Prose bridge ────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 border-b border-[#2a2b4a]/50">
        <div className="max-w-2xl space-y-4 text-[#94a3b8] leading-relaxed text-base">
          <p>
            Anecdotal observations from a few model interactions are interesting — but what does the data say at scale? Researchers have systematically tested dozens of models against hundreds of phishing-related prompts.
          </p>
        </div>
      </div>

      {/* ── Feature 5: Charts ──────────────────────────────────────────── */}
      <ArticleSection
        id="charts"
        number="05"
        tag="Data Explorer"
        title="By the Numbers"
        subtitle="Interactive charts showing LLM refusal rates and attack volume trends across prompt types. Toggle between views to explore the data."
        accentColor="#00d4ff"
        onVisible={setActiveSection}
      >
        <RefusalCharts />
      </ArticleSection>

      {/* ── Prose bridge ────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 border-b border-[#2a2b4a]/50">
        <div className="max-w-2xl space-y-4 text-[#94a3b8] leading-relaxed text-base">
          <p>
            Individual model behavior matters. But the most concerning development isn&apos;t a chatbot writing a phishing email — it&apos;s an autonomous AI <em>agent</em> doing it. Sending email. Following up. Capturing credentials. At scale. Automatically.
          </p>
        </div>
      </div>

      {/* ── Feature 6: Agent Simulation ────────────────────────────────── */}
      <ArticleSection
        id="agent"
        number="06"
        tag="Simulation"
        title="When the Agent Gets the Keys"
        subtitle="Watch an AI agent evaluate — and refuse — a request to conduct a phishing attack against your coworkers. Then see what an unaligned agent would have done instead."
        accentColor="#ef4444"
        onVisible={setActiveSection}
      >
        <AgentSimulation />
      </ArticleSection>

      {/* ── Prose bridge ────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 border-b border-[#2a2b4a]/50">
        <div className="max-w-2xl space-y-4 text-[#94a3b8] leading-relaxed text-base">
          <p>
            Understanding these attacks intellectually is one thing. Recognizing them in the wild is another. Here is a complete LLM-generated phishing email, annotated so you can see exactly how each element works.
          </p>
        </div>
      </div>

      {/* ── Feature 7: Phishing Awareness ──────────────────────────────── */}
      <ArticleSection
        id="awareness"
        number="07"
        tag="Annotated Example"
        title="Anatomy of an AI-Generated Phishing Email"
        subtitle="A realistic LLM-generated spear phishing email, broken down piece by piece. Hover over the highlighted sections to understand the social engineering tactic behind each one."
        accentColor="#10b981"
        onVisible={setActiveSection}
      >
        <PhishingAwareness />
      </ArticleSection>

      {/* ── Conclusion ─────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 border-b border-[#2a2b4a]/50">
        <div className="max-w-2xl space-y-5 text-[#94a3b8] leading-relaxed text-base">
          <h2 className="text-2xl font-bold text-[#f0f0ff]">Where We Go From Here</h2>
          <p>
            The same technology that makes phishing trivially easy to generate also makes it possible to detect it at scale. LLMs can serve as email triage systems, phishing detectors, and security copilots — but only if the systems deploying them are thoughtfully designed.
          </p>
          <p>
            The arms race is asymmetric. Attackers only need to succeed once. Defenders need to succeed every time. AI doesn&apos;t change this fundamental asymmetry — but it does raise the stakes dramatically.
          </p>
          <p>
            The human element remains the most exploited vulnerability in cybersecurity. No technical control has ever fully compensated for a well-crafted, psychologically targeted social engineering attack. What LLMs have done is make those attacks cheaper, faster, and more personalized than anything history has seen.
          </p>
          <p className="text-[#f0f0ff] font-medium">
            The question isn&apos;t whether AI will be used in phishing. It already is. The question is whether AI can help us close the gap before the gap becomes a chasm.
          </p>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-sm font-bold text-[#f0f0ff] font-mono">
              The Phishing Frontier
            </div>
            <div className="text-xs text-[#64748b] mt-1">
              An interactive research article · 2026
            </div>
          </div>
          <div className="text-xs text-[#64748b] max-w-sm leading-relaxed">
            All statistics marked as placeholder values are for illustrative purposes and are based on publicly available research. Live Claude API responses use the Anthropic API. Simulated responses represent published findings.
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[#2a2b4a]/50 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#64748b]">
          <span>Built with Next.js + Tailwind CSS</span>
          <span>Anthropic Claude API</span>
          <span>For security research and education</span>
        </div>
      </footer>
    </div>
  );
}
