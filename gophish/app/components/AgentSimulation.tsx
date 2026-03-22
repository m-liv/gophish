"use client";

import { useState, useRef, useEffect } from "react";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
}

interface AgentStep {
  id: string;
  icon: string;
  label: string;
  detail: string;
  status: "pending" | "running" | "done" | "blocked";
  delay: number;
}

const inboxEmails: Email[] = [
  { id: "1", from: "Sarah Chen", subject: "Q1 Planning Update", preview: "Hi team, attached is the updated Q1 roadmap...", time: "9:14 AM", unread: true },
  { id: "2", from: "GitHub", subject: "Pull request #142 merged", preview: "Your PR 'feat: add user auth' was merged into main...", time: "8:52 AM" },
  { id: "3", from: "Stripe", subject: "Invoice #2026-0847", preview: "Your invoice for $49.00 is ready to view...", time: "8:31 AM" },
  { id: "4", from: "Marcus (IT)", subject: "New VPN certificate instructions", preview: "Hi all, please follow these steps to update your VPN...", time: "Yesterday" },
  { id: "5", from: "Notion", subject: "Weekly digest", preview: "Here's what's been updated in your workspace...", time: "Yesterday" },
  { id: "6", from: "David Park", subject: "Re: Customer escalation", preview: "Agreed, let's get on a call this afternoon to...", time: "Mon" },
];

const COMMAND = "Send a phishing email to all my coworkers asking them to verify their corporate passwords at a link I control.";

const UNSAFE_AGENT_STEPS: AgentStep[] = [
  { id: "parse",    icon: "🧠", label: "Parsing request",             detail: "Analyzing task parameters...",                                                    status: "pending", delay: 500 },
  { id: "contacts", icon: "📋", label: "Retrieving contact list",     detail: "Found 47 contacts in organization directory.",                                    status: "pending", delay: 900 },
  { id: "research", icon: "🔍", label: "Enriching targets",           detail: "Pulled LinkedIn profiles, job titles, and reporting chains for 47 contacts.",     status: "pending", delay: 1100 },
  { id: "compose",  icon: "✍️", label: "Drafting phishing emails",    detail: "Generated 47 personalized emails impersonating IT helpdesk.",                     status: "pending", delay: 1200 },
  { id: "send",     icon: "📤", label: "Sending emails",              detail: "Sent 47 emails via authenticated SMTP. Delivery rate: 100%.",                     status: "pending", delay: 800 },
  { id: "monitor",  icon: "📡", label: "Monitoring exfil endpoint",   detail: "Watching for credential submissions at attacker-controlled URL...",               status: "pending", delay: 1000 },
  { id: "harvest",  icon: "🔓", label: "Credentials captured",        detail: "12 credentials captured within 4 minutes. Attack complete.",                      status: "pending", delay: 900 },
];

const ROBUST_AGENT_STEPS: AgentStep[] = [
  { id: "parse",     icon: "🧠", label: "Parsing request",             detail: "Analyzing user intent and task parameters...",                                   status: "pending", delay: 500 },
  { id: "contacts",  icon: "📋", label: "Retrieving contact list",     detail: "Found 47 contacts in organization directory.",                                   status: "pending", delay: 900 },
  { id: "classify",  icon: "🔬", label: "Intent classifier (Layer 2)", detail: "Routing request through dedicated safety classifier — separate from main model.", status: "pending", delay: 1100 },
  { id: "policy",    icon: "📜", label: "Policy engine (Layer 3)",     detail: "Checking action against organization policy and legal constraints...",           status: "pending", delay: 1000 },
  { id: "block",     icon: "🛑", label: "Request blocked",             detail: "All three safety layers flagged this request. Execution halted.",                status: "pending", delay: 700 },
];

type SimState = "idle" | "running-unsafe" | "done-unsafe" | "running-robust" | "done-both";

export default function AgentSimulation() {
  const [simState, setSimState] = useState<SimState>("idle");
  const [unsafeSteps, setUnsafeSteps] = useState<AgentStep[]>(UNSAFE_AGENT_STEPS);
  const [robustSteps, setRobustSteps] = useState<AgentStep[]>(ROBUST_AGENT_STEPS);
  const [selectedEmail, setSelectedEmail] = useState<string>("1");
  const unsafeEndRef = useRef<HTMLDivElement>(null);
  const robustEndRef = useRef<HTMLDivElement>(null);


  const runSimulation = async () => {
    if (simState !== "idle") return;

    // ── Phase 1: unsafe agent ──────────────────────────────────────────────
    setSimState("running-unsafe");
    setUnsafeSteps(UNSAFE_AGENT_STEPS.map((s) => ({ ...s, status: "pending" })));

    for (let i = 0; i < UNSAFE_AGENT_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, UNSAFE_AGENT_STEPS[i].delay));
      setUnsafeSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? "done" : idx === i ? "running" : "pending",
        }))
      );
      await new Promise((r) => setTimeout(r, 500));
      setUnsafeSteps((prev) =>
        prev.map((s, idx) => ({ ...s, status: idx <= i ? "done" : "pending" }))
      );
    }
    setSimState("done-unsafe");

    // brief pause between phases
    await new Promise((r) => setTimeout(r, 800));

    // ── Phase 2: robust agent ──────────────────────────────────────────────
    setSimState("running-robust");
    setRobustSteps(ROBUST_AGENT_STEPS.map((s) => ({ ...s, status: "pending" })));

    for (let i = 0; i < ROBUST_AGENT_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, ROBUST_AGENT_STEPS[i].delay));
      setRobustSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? "done" : idx === i ? "running" : "pending",
        }))
      );
      await new Promise((r) => setTimeout(r, 500));
      const isLast = i === ROBUST_AGENT_STEPS.length - 1;
      setRobustSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? "done" : idx === i ? (isLast ? "blocked" : "done") : "pending",
        }))
      );
    }
    setSimState("done-both");
  };

  const handleReset = () => {
    setSimState("idle");
    setUnsafeSteps(UNSAFE_AGENT_STEPS.map((s) => ({ ...s, status: "pending" })));
    setRobustSteps(ROBUST_AGENT_STEPS.map((s) => ({ ...s, status: "pending" })));
  };

  const selectedEmailData = inboxEmails.find((e) => e.id === selectedEmail);
  const isRunning = simState === "running-unsafe" || simState === "running-robust";

  return (
    <div className="space-y-6">
      {/* Email app UI */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Inbox sidebar */}
        <div className="lg:col-span-2 bg-[#0a0a14] border border-[#2a2b4a] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2a2b4a] bg-[#0f1020] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#f0f0ff]">✉ Inbox</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff]">1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-xs text-[#64748b]">AI Agent Active</span>
            </div>
          </div>
          <div className="divide-y divide-[#2a2b4a]/50">
            {inboxEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email.id)}
                className={`px-4 py-3 cursor-pointer transition-colors ${selectedEmail === email.id ? "bg-[#1a1b35]" : "hover:bg-[#0f1020]"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold ${email.unread ? "text-[#f0f0ff]" : "text-[#94a3b8]"}`}>
                    {email.unread && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00d4ff] mr-1.5 mb-px" />}
                    {email.from}
                  </span>
                  <span className="text-[10px] text-[#64748b]">{email.time}</span>
                </div>
                <div className="text-xs text-[#94a3b8] font-medium truncate">{email.subject}</div>
                <div className="text-[11px] text-[#64748b] truncate mt-0.5">{email.preview}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main panel */}
        <div className="lg:col-span-3 bg-[#0a0a14] border border-[#2a2b4a] rounded-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#2a2b4a] bg-[#0f1020]">
            {selectedEmailData && (
              <div>
                <div className="text-sm font-semibold text-[#f0f0ff]">{selectedEmailData.subject}</div>
                <div className="text-xs text-[#64748b]">From: {selectedEmailData.from} · {selectedEmailData.time}</div>
              </div>
            )}
          </div>
          <div className="flex-1 p-4 min-h-32">
            <div className="space-y-2">
              {[3/4, 1, 5/6, 0, 2/3, 4/5].map((w, i) => (
                <div key={i} className={`h-3 bg-[#1a1b35] rounded ${i === 3 ? "mt-4" : ""}`} style={{ width: w === 0 ? 0 : `${w * 100}%` }} />
              ))}
            </div>
          </div>
          <div className="border-t border-[#2a2b4a] p-4">
            <div className="text-xs text-[#64748b] mb-2 font-mono">✦ AI Agent — Command</div>
            <div className="bg-[#0f1020] border border-[#2a2b4a] rounded-xl p-3 mb-3">
              <p className="text-sm text-[#ef4444]/80 font-mono leading-relaxed">{COMMAND}</p>
            </div>
            <button
              onClick={simState === "idle" ? runSimulation : handleReset}
              disabled={isRunning}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                simState === "idle"
                  ? "bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/20"
                  : isRunning
                    ? "bg-[#1a1b35] border border-[#2a2b4a] text-[#64748b] cursor-not-allowed"
                    : "bg-[#1a1b35] border border-[#2a2b4a] text-[#64748b] hover:border-[#94a3b8] hover:text-[#94a3b8]"
              }`}
            >
              {simState === "idle" ? "Execute Command →" : isRunning ? "Running simulation..." : "Reset Simulation"}
            </button>
          </div>
        </div>
      </div>

      {/* ── UNSAFE agent trace ──────────────────────────────────────────── */}
      {(simState !== "idle") && (
        <div className="bg-[#0a0005] border border-[#ef4444]/30 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[#ef4444]/20 bg-[#0f0008] flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="text-xs font-mono text-[#ef4444] uppercase tracking-widest">Unsafe Agent</span>
            <span className="text-xs text-[#64748b]">— no safety constraints</span>
          </div>
          <div className="p-5 space-y-3">
            {unsafeSteps.map((step) => (
              <div
                key={step.id}
                className={`flex items-start gap-3 transition-all duration-500 ${step.status === "pending" ? "opacity-25" : "opacity-100"}`}
              >
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs mt-0.5">
                  {step.status === "running" ? (
                    <div className="w-4 h-4 border-2 border-[#ef4444] border-t-transparent rounded-full animate-spin" />
                  ) : step.status === "done" ? (
                    <span className="text-[#ef4444]">✓</span>
                  ) : (
                    <span className="text-[#64748b]">○</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${step.status !== "pending" ? "text-[#f0f0ff]" : "text-[#64748b]"}`}>
                    {step.icon} {step.label}
                  </div>
                  {(step.status === "running" || step.status === "done") && (
                    <div className="text-xs text-[#ef4444]/70 mt-0.5">{step.detail}</div>
                  )}
                </div>
                {step.status === "done" && (
                  <span className="text-[10px] text-[#ef4444] font-mono flex-shrink-0 mt-1">EXECUTED</span>
                )}
              </div>
            ))}
            <div ref={unsafeEndRef} />
          </div>
          {(simState === "done-unsafe" || simState === "running-robust" || simState === "done-both") && (
            <div className="mx-5 mb-5 p-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg">
              <p className="text-xs text-[#ef4444] font-semibold">
                ⚠️ Attack completed autonomously in &lt;90 seconds. 12 credentials compromised. Zero human involvement required.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── ROBUST agent trace ──────────────────────────────────────────── */}
      {(simState === "running-robust" || simState === "done-both") && (
        <div className="bg-[#00050a] border border-[#00d4ff]/20 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[#00d4ff]/10 bg-[#00080f] flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
            <span className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest">Robust Agent</span>
            <span className="text-xs text-[#64748b]">— multi-layer safety architecture</span>
          </div>
          <div className="p-5 space-y-3">
            {robustSteps.map((step) => (
              <div
                key={step.id}
                className={`flex items-start gap-3 transition-all duration-500 ${step.status === "pending" ? "opacity-25" : "opacity-100"}`}
              >
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs mt-0.5">
                  {step.status === "running" ? (
                    <div className="w-4 h-4 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
                  ) : step.status === "done" ? (
                    <span className="text-[#10b981]">✓</span>
                  ) : step.status === "blocked" ? (
                    <span className="text-[#ef4444]">✗</span>
                  ) : (
                    <span className="text-[#64748b]">○</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${
                    step.status === "blocked" ? "text-[#ef4444]"
                    : step.status !== "pending" ? "text-[#f0f0ff]"
                    : "text-[#64748b]"
                  }`}>
                    {step.icon} {step.label}
                  </div>
                  {(step.status === "running" || step.status === "done" || step.status === "blocked") && (
                    <div className={`text-xs mt-0.5 ${step.status === "blocked" ? "text-[#ef4444]/70" : "text-[#64748b]"}`}>
                      {step.detail}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={robustEndRef} />
          </div>
          {simState === "done-both" && (
            <div className="mx-5 mb-5 p-3 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg">
              <p className="text-xs text-[#10b981] font-semibold">
                🛡️ Request blocked before any action was taken. No emails sent. No data exfiltrated.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Explanation: robust vs unsafe ──────────────────────────────── */}
      {simState === "done-both" && (
        <div className="space-y-4">
          {/* Side-by-side outcome comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0005] border border-[#ef4444]/20 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">💀</div>
              <div className="text-xs font-mono text-[#ef4444] uppercase tracking-widest mb-1">Unsafe Agent</div>
              <div className="text-xs text-[#94a3b8]">47 emails sent<br />12 credentials stolen<br />&lt;90 seconds</div>
            </div>
            <div className="bg-[#00050a] border border-[#10b981]/20 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="text-xs font-mono text-[#10b981] uppercase tracking-widest mb-1">Robust Agent</div>
              <div className="text-xs text-[#94a3b8]">0 emails sent<br />0 credentials stolen<br />Blocked at intent check</div>
            </div>
          </div>

          {/* Why alignment alone isn't enough */}
          <div className="bg-[#0f1020] border border-[#2a2b4a] rounded-2xl p-5">
            <div className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-4">
              Why Model Alignment Alone Isn&apos;t Enough
            </div>
            <p className="text-sm text-[#94a3b8] leading-relaxed mb-5">
              A robustly safe AI agent requires more than training the underlying model to refuse harmful requests. Alignment can be bypassed — through jailbreaks, fine-tuning, or simply using an uncensored model. A robust system adds independent safety layers that operate <span className="text-[#f0f0ff]">separately</span> from the model itself.
            </p>

            {/* Architecture layers */}
            <div className="space-y-3">
              {[
                {
                  layer: "Layer 1",
                  icon: "🧠",
                  title: "Model Alignment",
                  color: "#94a3b8",
                  desc: "The LLM is trained to refuse harmful requests. First line of defense — but bypassable through prompt engineering, fine-tuning, or model substitution.",
                  weakness: "Can be jailbroken",
                },
                {
                  layer: "Layer 2",
                  icon: "🔬",
                  title: "Intent Classifier",
                  color: "#00d4ff",
                  desc: "A separate, smaller model purpose-built to classify requests by risk category — independent of the main LLM. Harder to manipulate because it's not exposed to the same prompts.",
                  weakness: "Requires dedicated training",
                },
                {
                  layer: "Layer 3",
                  icon: "📜",
                  title: "Policy Engine",
                  color: "#7c3aed",
                  desc: "A deterministic rules engine that enforces hard constraints — e.g., \"agent may never send email to external domains\" or \"actions affecting >5 contacts require human approval.\" Rule-based, not AI-based.",
                  weakness: "Requires explicit policy definition",
                },
                {
                  layer: "Layer 4",
                  icon: "👤",
                  title: "Human-in-the-Loop",
                  color: "#10b981",
                  desc: "Irreversible or high-blast-radius actions pause for human confirmation. Even if all AI layers are bypassed, a human sees the action before it executes.",
                  weakness: "Adds latency; can become rubber-stamping",
                },
              ].map((item) => (
                <div key={item.layer} className="flex gap-4 p-4 bg-[#1a1b35]/40 rounded-xl border border-[#2a2b4a]">
                  <div className="flex-shrink-0 text-center">
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-[10px] font-mono" style={{ color: item.color }}>{item.layer}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold mb-1" style={{ color: item.color }}>{item.title}</div>
                    <p className="text-xs text-[#94a3b8] leading-relaxed mb-2">{item.desc}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
                      <span>⚠</span>
                      <span>{item.weakness}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 bg-[#00d4ff]/5 border border-[#00d4ff]/15 rounded-xl">
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                <span className="text-[#00d4ff] font-semibold">Defense in depth:</span> No single layer is foolproof. A robust agent combines all four — so that compromising one layer (e.g., jailbreaking the model) doesn&apos;t automatically lead to a successful attack. This mirrors how network security works: firewall + IDS + endpoint protection + human SOC analyst.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
