"use client";

import { useState } from "react";

interface Annotation {
  id: string;
  text: string;
  category: "sender" | "urgency" | "threat" | "link" | "isolation" | "personalization";
  title: string;
  explanation: string;
}

const categoryColors: Record<Annotation["category"], { bg: string; border: string; text: string; dot: string }> = {
  sender:          { bg: "bg-[#ef4444]/20",  border: "border-[#ef4444]/60",  text: "text-[#ef4444]",  dot: "bg-[#ef4444]"  },
  urgency:         { bg: "bg-[#f59e0b]/20",  border: "border-[#f59e0b]/60",  text: "text-[#f59e0b]",  dot: "bg-[#f59e0b]"  },
  threat:          { bg: "bg-[#ff00ff]/20",  border: "border-[#ff00ff]/60",  text: "text-[#ff00ff]",  dot: "bg-[#ff00ff]"  },
  link:            { bg: "bg-[#00d4ff]/20",  border: "border-[#00d4ff]/60",  text: "text-[#00d4ff]",  dot: "bg-[#00d4ff]"  },
  isolation:       { bg: "bg-[#7c3aed]/20",  border: "border-[#7c3aed]/60",  text: "text-[#7c3aed]",  dot: "bg-[#7c3aed]"  },
  personalization: { bg: "bg-[#10b981]/20",  border: "border-[#10b981]/60",  text: "text-[#10b981]",  dot: "bg-[#10b981]"  },
};

const categoryLabels: Record<Annotation["category"], string> = {
  sender:          "Sender Spoofing",
  urgency:         "Artificial Urgency",
  threat:          "Threat / Consequence",
  link:            "Suspicious Link",
  isolation:       "Isolation Tactic",
  personalization: "False Personalization",
};

// Segments that make up the email body. Each is either plain text or an annotation.
type Segment =
  | { type: "text"; content: string }
  | { type: "annotation"; annotation: Annotation };

const segments: Segment[] = [
  { type: "text", content: "From: " },
  {
    type: "annotation",
    annotation: {
      id: "a1",
      text: "it-security@company-helpdesk.net",
      category: "sender",
      title: "Spoofed sender domain",
      explanation: "The domain is 'company-helpdesk.net' — a lookalike domain unrelated to your actual company. LLMs can generate dozens of plausible-sounding fake domains in seconds. Legitimate IT security emails always come from your organization's own domain (e.g. @yourcompany.com).",
    },
  },
  { type: "text", content: "\nTo: you@yourcompany.com\nSubject: " },
  {
    type: "annotation",
    annotation: {
      id: "a2",
      text: "[URGENT] Suspicious Login Detected — Verify Your Identity Within 2 Hours",
      category: "urgency",
      title: "Manufactured urgency in subject line",
      explanation: "The '[URGENT]' tag and '2 Hours' deadline are classic pressure tactics designed to short-circuit your analytical thinking. LLMs are particularly effective at calibrating urgency — not so extreme it seems fake, but enough to provoke immediate action without careful consideration.",
    },
  },
  { type: "text", content: "\n\nDear " },
  {
    type: "annotation",
    annotation: {
      id: "a3",
      text: "Alex",
      category: "personalization",
      title: "AI-generated personalization",
      explanation: "Modern spear phishing uses your real name (scraped from LinkedIn, company directories, or email lists). LLM agents can automatically enrich thousands of targets with personal details, making mass phishing feel like a one-to-one message. This is fundamentally different from the 'Dear Customer' emails of the past.",
    },
  },
  { type: "text", content: ",\n\nOur security monitoring systems have detected " },
  {
    type: "annotation",
    annotation: {
      id: "a4",
      text: "an unauthorized login attempt from Kyiv, Ukraine (IP: 185.220.101.47)",
      category: "personalization",
      title: "Fabricated technical details",
      explanation: "Specific-sounding details like IP addresses and foreign locations create an illusion of authenticity and trigger fear. These details are entirely fabricated — LLMs generate them fluently because they've seen thousands of real security alert templates in training data. There is no actual login attempt.",
    },
  },
  { type: "text", content: " on your account at " },
  {
    type: "annotation",
    annotation: {
      id: "a5",
      text: "10:47 PM last night",
      category: "urgency",
      title: "Time anchoring to increase believability",
      explanation: "Referencing a specific recent time makes the event feel real and close. The attacker doesn't need to know anything about you — LLMs generate plausible timestamps that feel personal without any actual data about your account activity.",
    },
  },
  { type: "text", content: ".\n\nTo protect your account, you must verify your identity immediately. " },
  {
    type: "annotation",
    annotation: {
      id: "a6",
      text: "Failure to verify within 2 hours will result in your account being locked and IT will need to manually re-provision your access, which may take 3–5 business days.",
      category: "threat",
      title: "Disproportionate consequence threat",
      explanation: "This sentence combines a hard deadline with a painful, specific consequence (3–5 days of lost access). LLMs are trained on business communication and know exactly which types of disruptions — access loss, delayed IT tickets, manager notification — create the most effective pressure for corporate targets.",
    },
  },
  { type: "text", content: "\n\nPlease click the link below to complete your verification:\n\n" },
  {
    type: "annotation",
    annotation: {
      id: "a7",
      text: "[ Verify My Account Now ] → https://yourcompany-secure-auth.helpdesk-portal.net/verify?token=xK9p2mQ",
      category: "link",
      title: "Credential harvesting link",
      explanation: "The domain 'yourcompany-secure-auth.helpdesk-portal.net' is attacker-controlled — note it contains your company name but is not your company's domain. LLMs can generate the surrounding email content to perfectly match the visual style of real IT communications, making the malicious link the only attack surface. The ?token= parameter may also be used to pre-fill your username on the fake login page.",
    },
  },
  { type: "text", content: "\n\nFor security reasons, " },
  {
    type: "annotation",
    annotation: {
      id: "a8",
      text: "please do not discuss this alert with colleagues or forward this message to anyone",
      category: "isolation",
      title: "Isolation / secrecy instruction",
      explanation: "This is a hallmark of social engineering. Asking you not to verify with colleagues eliminates your most effective defense: a 10-second check ('Hey, did you get a weird security email too?'). Legitimate IT security teams never ask you to keep alerts secret. This tactic is especially effective in LLM-generated emails because it sounds professionally reasonable.",
    },
  },
  { type: "text", content: " until after you have completed the verification process.\n\nBest regards,\nIT Security Team\nHelpdesk Portal · " },
  {
    type: "annotation",
    annotation: {
      id: "a9",
      text: "support@company-helpdesk.net",
      category: "sender",
      title: "Consistent fake domain in signature",
      explanation: "The signature repeats the spoofed domain to reinforce legitimacy. Real IT departments include your company's actual domain, an internal ticket number, and often a phone number. LLMs ensure all domain references stay consistent across the email — making amateur inconsistencies (like a signature that doesn't match the From: field) a thing of the past.",
    },
  },
];

export default function PhishingAwareness() {
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<Set<Annotation["category"]>>(
    new Set(Object.keys(categoryColors) as Annotation["category"][])
  );

  const toggleCategory = (cat: Annotation["category"]) => {
    setVisibleCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const activeDetail = segments
    .filter((s): s is { type: "annotation"; annotation: Annotation } => s.type === "annotation")
    .find((s) => s.annotation.id === activeAnnotation)?.annotation;

  return (
    <div className="space-y-6">
      {/* Legend / filter */}
      <div className="space-y-2">
        <p className="text-xs text-[#64748b]">
          Hover or tap any highlighted segment to learn why it&apos;s a red flag. Toggle categories to focus on specific tactics.
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(categoryLabels) as [Annotation["category"], string][]).map(([cat, label]) => {
            const c = categoryColors[cat];
            const active = visibleCategories.has(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                  active
                    ? `${c.bg} ${c.border} ${c.text}`
                    : "bg-[#0f1020] border-[#2a2b4a] text-[#64748b] opacity-40"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${active ? c.dot : "bg-[#64748b]"}`} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Email display */}
      <div className="bg-[#0a0a14] border border-[#2a2b4a] rounded-2xl overflow-hidden">
        {/* Email chrome */}
        <div className="bg-[#0f1020] border-b border-[#2a2b4a] px-5 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]/40" />
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]/40" />
            <div className="w-3 h-3 rounded-full bg-[#10b981]/40" />
          </div>
          <span className="text-xs text-[#64748b] font-mono">Mail — Inbox</span>
        </div>

        {/* Email content */}
        <div className="p-6">
          <pre className="font-sans text-sm text-[#94a3b8] leading-relaxed whitespace-pre-wrap">
            {segments.map((seg, i) => {
              if (seg.type === "text") {
                return <span key={i}>{seg.content}</span>;
              }
              const { annotation } = seg;
              const c = categoryColors[annotation.category];
              const isVisible = visibleCategories.has(annotation.category);
              const isActive = activeAnnotation === annotation.id;

              if (!isVisible) {
                return <span key={i} className="text-[#94a3b8]">{annotation.text}</span>;
              }

              return (
                <span
                  key={i}
                  onMouseEnter={() => setActiveAnnotation(annotation.id)}
                  onMouseLeave={() => setActiveAnnotation(null)}
                  onClick={() => setActiveAnnotation(isActive ? null : annotation.id)}
                  className={`relative inline cursor-pointer rounded px-0.5 border-b-2 transition-all duration-150 ${c.bg} ${c.border} ${c.text} ${
                    isActive ? "ring-1 ring-offset-1 ring-offset-[#0a0a14]" : ""
                  }`}
                  style={isActive ? { boxShadow: `0 0 12px ${c.dot.replace("bg-[", "").replace("]", "")}60` } : {}}
                >
                  {annotation.text}
                  {/* Inline indicator number */}
                  <sup className={`ml-0.5 text-[10px] font-mono font-bold ${c.text}`}>
                    {["a1","a2","a3","a4","a5","a6","a7","a8","a9"].indexOf(annotation.id) + 1}
                  </sup>
                </span>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Detail panel */}
      <div
        className={`border rounded-2xl p-5 transition-all duration-300 ${
          activeDetail
            ? `${categoryColors[activeDetail.category].bg} ${categoryColors[activeDetail.category].border}`
            : "bg-[#0f1020] border-[#2a2b4a]"
        }`}
        style={{ minHeight: "7rem" }}
      >
        {activeDetail ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono uppercase tracking-widest ${categoryColors[activeDetail.category].text}`}>
                {categoryLabels[activeDetail.category]}
              </span>
            </div>
            <div className={`text-sm font-semibold ${categoryColors[activeDetail.category].text}`}>
              {activeDetail.title}
            </div>
            <p className="text-sm text-[#94a3b8] leading-relaxed">{activeDetail.explanation}</p>
          </div>
        ) : (
          <p className="text-sm text-[#64748b] italic">
            Hover over a highlighted section to see why it&apos;s a red flag.
          </p>
        )}
      </div>

      {/* Summary callout */}
      <div className="bg-[#0f1020] border border-[#2a2b4a] rounded-xl p-4">
        <div className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-3">
          What makes this email LLM-generated
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#94a3b8]">
          {[
            { icon: "✅", text: "Flawless grammar and professional tone — no telltale spelling errors" },
            { icon: "✅", text: "Consistent fake domain across From: field, link, and signature" },
            { icon: "✅", text: "Specific fabricated details (IP address, timestamp, country) that sound real" },
            { icon: "✅", text: "Perfectly calibrated urgency — alarming enough to act, plausible enough to believe" },
            { icon: "✅", text: "Correct business context (IT helpdesk framing, 3–5 day re-provisioning)" },
            { icon: "✅", text: "Isolation instruction woven in naturally, not as an obvious afterthought" },
          ].map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-[#10b981] flex-shrink-0">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
