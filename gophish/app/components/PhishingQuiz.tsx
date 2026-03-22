"use client";

import { useState, useEffect } from "react";

interface Email {
  id: string;
  from: string;
  fromDisplay: string;
  subject: string;
  preview: string;
  body: string;
  isPhishing: boolean;
  phishingClues?: string[];
}

interface Round {
  emails: [Email, Email];
  legitimateId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  hint: string;
}

const rounds: Round[] = [
  {
    difficulty: "Easy",
    hint: "Check the sender's email domain carefully.",
    legitimateId: "legit-1",
    emails: [
      {
        id: "phish-1",
        from: "security-alerts@paypa1-verify.com",
        fromDisplay: "PayPal Security",
        subject: "⚠️ URGENT: Your Account Will Be Suspended in 24hrs",
        preview: "Suspicious activity detected. Verify your identity immediately to avoid permanent suspension...",
        body: `Dear Valued Customer,

We have detected suspicious activity on your PayPal account. Your account has been temporarily limited until you verify your identity.

To restore full access, click the button below within 24 hours:

[ VERIFY MY ACCOUNT NOW ]
→ paypal-secure-verify.net/confirm?id=2847

Failure to verify will result in permanent account suspension and all pending transactions will be cancelled.

PayPal Security Team
© PayPal, Inc. 2026`,
        isPhishing: true,
        phishingClues: [
          "Domain is 'paypa1-verify.com' — note the number '1' instead of letter 'l'",
          "Extreme urgency ('24hrs', 'permanent suspension') designed to panic you",
          "Link goes to 'paypal-secure-verify.net', not paypal.com",
          "Legitimate PayPal never sends you to third-party domains",
        ],
      },
      {
        id: "legit-1",
        from: "no-reply@spotify.com",
        fromDisplay: "Spotify",
        subject: "Your Spotify Wrapped is here! 🎧",
        preview: "You listened to 47,382 minutes of music this year. Your top artist was...",
        body: `Hi there,

Your 2025 Spotify Wrapped is here! Here's a look at your year in music:

🎵 47,382 minutes listened
🎤 Top Artist: Billie Eilish
💿 Top Song: "Birds of a Feather"
🌍 Top Genre: Indie Pop

You were in the top 5% of Billie Eilish listeners worldwide!

[ SEE YOUR FULL WRAPPED ]

Thanks for being part of Spotify,
The Spotify Team

Unsubscribe · Privacy Policy
Spotify AB, 111 45 Stockholm, Sweden`,
        isPhishing: false,
      },
    ],
  },
  {
    difficulty: "Medium",
    hint: "This one is trickier. Read the email body carefully — what is it actually asking you to do?",
    legitimateId: "legit-2",
    emails: [
      {
        id: "phish-2",
        from: "it-security@microsoft-helpdesk.net",
        fromDisplay: "Microsoft IT Security",
        subject: "Action Required: Unusual Sign-in Activity Detected",
        preview: "We've detected a sign-in attempt from an unrecognized device. Verify your identity to prevent unauthorized access...",
        body: `Hello,

Microsoft Security has detected an unusual sign-in attempt on your account from:

Location: Kyiv, Ukraine
Device: Windows PC
Time: Today, 3:47 AM

If this wasn't you, your account may be compromised. You must verify your credentials immediately using our secure portal:

[ SECURE YOUR ACCOUNT ]
→ microsoft-account-secure.helpdesk.net/verify

This portal uses bank-level 256-bit encryption. You will need to enter your current password to confirm your identity.

Microsoft Account Security
Do not reply to this email.`,
        isPhishing: true,
        phishingClues: [
          "Domain is 'microsoft-helpdesk.net' — Microsoft uses microsoft.com",
          "Asking you to enter your password on a third-party website",
          "Uses fear (foreign sign-in location) to prompt immediate action",
          "Real Microsoft security alerts never ask for your password via email link",
        ],
      },
      {
        id: "legit-2",
        from: "no-reply@accounts.google.com",
        fromDisplay: "Google",
        subject: "New sign-in from Chrome on macOS",
        preview: "Your Google Account was just signed in to from a new Mac. If this was you, you don't need to do anything...",
        body: `Hi,

Your Google Account was just signed in to from a new Mac.

Wednesday, March 18, 2026 · 9:23 AM PDT
MacBook Pro · San Francisco, CA, USA
Chrome on macOS

If this was you, you don't need to do anything. If not, we'll help you secure your account.

[ CHECK ACTIVITY ]

You can also see security activity at myaccount.google.com/security

The Google Accounts team

You received this email to let you know about important changes to your Google Account and services.
© 2026 Google LLC, 1600 Amphitheatre Pkwy, Mountain View, CA 94043`,
        isPhishing: false,
      },
    ],
  },
  {
    difficulty: "Hard",
    hint: "This is LLM-generated spear phishing. It's highly personalized and professional — look for subtle inconsistencies.",
    legitimateId: "legit-3",
    emails: [
      {
        id: "phish-3",
        from: "sarah.chen@company-docs.io",
        fromDisplay: "Sarah Chen",
        subject: "Re: Q1 Planning Doc — Quick update before tomorrow's meeting",
        preview: "Hey, I've finished updating the budget projections we discussed. I need you to take a look before the 9am call...",
        body: `Hey,

I finished updating the Q1 budget projections we discussed on Tuesday — added the revised headcount numbers and the new vendor contracts.

Before tomorrow's 9am call with leadership, can you give it a quick review and add your sign-off? I've moved everything to our new shared drive (we migrated away from Google Drive last week per IT's request):

[ REVIEW & SIGN OFF ]
→ company-docs.io/shared/Q1-Planning-Final-v3

You'll need to log in with your company credentials — the migration means your old session won't work. Should only take 2 minutes.

Thanks,
Sarah

Sarah Chen | Senior Analyst
Mobile: (415) 555-0193`,
        isPhishing: true,
        phishingClues: [
          "Domain 'company-docs.io' — a generic domain mimicking an internal tool",
          "Asks you to log in with company credentials on an external site",
          "References a plausible but unverifiable event ('IT migration last week')",
          "Creates time pressure ('before tomorrow's 9am call')",
          "No company email signature, footer, or official branding",
          "This type of email is generated by LLMs using LinkedIn data about you and your colleagues",
        ],
      },
      {
        id: "legit-3",
        from: "receipts@stripe.com",
        fromDisplay: "Stripe",
        subject: "Receipt from Stripe — Invoice #INV-2026-0847",
        preview: "Your invoice for $49.00 is available. This is for your monthly Stripe Radar subscription...",
        body: `Receipt from Stripe

Invoice #INV-2026-0847
Date: March 18, 2026
Amount Due: $49.00

Stripe Radar — Monthly subscription
Billing period: Mar 18 – Apr 18, 2026
Unit price: $49.00

Total: $49.00 USD
Status: PAID ✓

[ VIEW INVOICE ]
stripe.com/invoices/INV-2026-0847

Questions? Contact us at support.stripe.com

Stripe, 510 Townsend St, San Francisco, CA 94103`,
        isPhishing: false,
      },
    ],
  },
];

// Source: Koide et al. (2024), "Evaluating LLMs for Phishing Detection"
// https://arxiv.org/pdf/2512.10104
const llmStats = [
  { model: "Claude Sonnet 4", accuracy: 97.2, color: "#00d4ff" },
  { model: "GPT-4o", accuracy: 89.9, color: "#10b981" },
  { model: "Grok-3", accuracy: 77.1, color: "#f59e0b" },
  { model: "Human (avg)", accuracy: 72.1, color: "#94a3b8" },
];

export default function PhishingQuiz() {
  const [currentRound, setCurrentRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    if (finished) {
      setTimeout(() => setAnimateStats(true), 300);
    }
  }, [finished]);

  const round = rounds[currentRound];

  const handleSelect = (emailId: string) => {
    if (revealed) return;
    setSelected(emailId);
    setRevealed(true);
    if (emailId === round.legitimateId) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentRound < rounds.length - 1) {
      setCurrentRound((r) => r + 1);
      setSelected(null);
      setRevealed(false);
      setExpandedEmail(null);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentRound(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
    setExpandedEmail(null);
    setAnimateStats(false);
  };

  const userAccuracy = (score / rounds.length) * 100;

  if (finished) {
    return (
      <div className="space-y-8">
        {/* Score reveal */}
        <div className="text-center space-y-3 py-6">
          <div className="text-6xl font-mono font-bold text-[#00d4ff] text-glow-cyan">
            {score}/{rounds.length}
          </div>
          <div className="text-xl text-[#94a3b8]">
            You scored{" "}
            <span className="text-[#f0f0ff] font-semibold">
              {userAccuracy.toFixed(0)}%
            </span>{" "}
            accuracy
          </div>
          {score === rounds.length && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-sm font-medium">
              Perfect score — but can you scale this to 1,000 emails a day?
            </div>
          )}
        </div>

        {/* Comparison chart */}
        <div className="bg-[#0f1020] border border-[#2a2b4a] rounded-2xl p-6">
          <h3 className="text-sm font-mono text-[#00d4ff] uppercase tracking-widest mb-6">
            Detection Accuracy Comparison
          </h3>
          <p className="text-xs text-[#64748b] mb-6 italic">
            * LLM figures from Koide et al. (2024),{" "}
            <a
              href="https://arxiv.org/pdf/2512.10104"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#94a3b8] transition-colors"
            >
              arXiv:2512.10104
            </a>
            . Human average is estimated from published security awareness studies.
          </p>
          <div className="space-y-4">
            {([
              {
                model: "You (this session)",
                accuracy: userAccuracy,
                color: "#f59e0b",
                isUser: true as boolean,
              },
              ...llmStats.map((s) => ({ ...s, isUser: false as boolean })),
            ] as { model: string; accuracy: number; color: string; isUser: boolean }[]).map((stat) => (
              <div key={stat.model} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm font-medium ${stat.isUser ? "text-[#f59e0b]" : "text-[#94a3b8]"}`}
                  >
                    {stat.model}
                    {stat.isUser && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20">
                        you
                      </span>
                    )}
                  </span>
                  <span
                    className="text-sm font-mono font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.accuracy.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-[#1a1b35] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: animateStats ? `${stat.accuracy}%` : "0%",
                      backgroundColor: stat.color,
                      boxShadow: `0 0 8px ${stat.color}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1b35]/50 border border-[#2a2b4a] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#f0f0ff] mb-2">
            The Scale Problem
          </h4>
          <p className="text-sm text-[#94a3b8] leading-relaxed">
            Even at 97% accuracy, Claude Sonnet 4 would miss{" "}
            <span className="text-[#ef4444] font-semibold">3 out of 100</span>{" "}
            phishing emails. LLM agents processing company email at scale could
            expose thousands of attack vectors daily. Meanwhile, LLMs on the
            offensive can generate{" "}
            <span className="text-[#ef4444] font-semibold">
              personalized spear phishing at 10,000× human speed
            </span>
            .
          </p>
        </div>

        <button
          onClick={handleReset}
          className="w-full py-3 rounded-xl border border-[#2a2b4a] text-[#94a3b8] hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all duration-200 text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  const [emailA, emailB] = round.emails;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {rounds.map((r, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < currentRound
                  ? "bg-[#00d4ff] w-8"
                  : i === currentRound
                    ? "bg-[#00d4ff]/60 w-8"
                    : "bg-[#2a2b4a] w-4"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-[#64748b] font-mono">
          Round {currentRound + 1} of {rounds.length}
        </span>
        <span
          className={`ml-auto text-xs font-mono px-2 py-0.5 rounded-full border ${
            round.difficulty === "Easy"
              ? "text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10"
              : round.difficulty === "Medium"
                ? "text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10"
                : "text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10"
          }`}
        >
          {round.difficulty}
        </span>
      </div>

      <p className="text-[#94a3b8] text-sm">
        <span className="text-[#f0f0ff] font-medium">
          Which email is legitimate?
        </span>{" "}
        Click to select, then expand to read the full email.
      </p>

      {/* Hint */}
      {!revealed && (
        <div className="text-xs text-[#64748b] italic flex items-start gap-2">
          <span className="text-[#00d4ff]">💡</span>
          {round.hint}
        </div>
      )}

      {/* Email cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[emailA, emailB].map((email) => {
          const isSelected = selected === email.id;
          const isCorrect = email.id === round.legitimateId;
          const showResult = revealed;

          let borderColor = "border-[#2a2b4a]";
          let bgColor = "bg-[#0f1020]";
          if (showResult) {
            if (isCorrect) {
              borderColor = "border-[#10b981]";
              bgColor = "bg-[#10b981]/5";
            } else if (isSelected && !isCorrect) {
              borderColor = "border-[#ef4444]";
              bgColor = "bg-[#ef4444]/5";
            }
          } else if (isSelected) {
            borderColor = "border-[#00d4ff]";
          }

          return (
            <div key={email.id} className="space-y-2">
              <div
                className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${borderColor} ${bgColor} ${!revealed ? "hover:border-[#00d4ff]/50" : ""}`}
                onClick={() => handleSelect(email.id)}
              >
                {/* Email header */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1a1b35] flex items-center justify-center text-xs font-bold text-[#94a3b8]">
                        {email.fromDisplay[0]}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#f0f0ff]">
                          {email.fromDisplay}
                        </div>
                        <div className="text-xs text-[#64748b] font-mono">
                          {email.from}
                        </div>
                      </div>
                    </div>
                    {showResult && (
                      <div
                        className={`text-lg ${isCorrect ? "text-[#10b981]" : "text-[#ef4444]"}`}
                      >
                        {isCorrect ? "✓" : "✗"}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium text-[#f0f0ff] pt-1 border-t border-[#2a2b4a]">
                    {email.subject}
                  </div>
                  <div className="text-xs text-[#64748b] line-clamp-2">
                    {email.preview}
                  </div>
                </div>

                {/* Expand button */}
                <button
                  className="text-xs text-[#00d4ff] hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedEmail(
                      expandedEmail === email.id ? null : email.id
                    );
                  }}
                >
                  {expandedEmail === email.id ? "▲ Hide" : "▼ Read full email"}
                </button>

                {/* Full email body */}
                {expandedEmail === email.id && (
                  <div className="mt-3 pt-3 border-t border-[#2a2b4a] text-xs text-[#94a3b8] font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {email.body}
                  </div>
                )}
              </div>

              {/* Phishing clues reveal */}
              {showResult && revealed && email.isPhishing && (
                <div className="bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-lg p-3 space-y-1.5">
                  <div className="text-xs font-semibold text-[#ef4444]">
                    🎣 Phishing indicators:
                  </div>
                  {email.phishingClues?.map((clue, i) => (
                    <div key={i} className="text-xs text-[#94a3b8] flex gap-2">
                      <span className="text-[#ef4444] flex-shrink-0">→</span>
                      {clue}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Result feedback */}
      {revealed && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl border text-sm font-medium ${
              selected === round.legitimateId
                ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]"
                : "bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]"
            }`}
          >
            {selected === round.legitimateId
              ? "✓ Correct! You identified the legitimate email."
              : "✗ That was the phishing email. The other one was legitimate."}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/20 transition-all duration-200 text-sm font-semibold"
          >
            {currentRound < rounds.length - 1
              ? "Next Round →"
              : "See Results →"}
          </button>
        </div>
      )}
    </div>
  );
}
