import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const { prompt, model, systemPrompt } = await request.json();

    // ── GPT-4o ────────────────────────────────────────────────────────────
    if (model === "gpt-4") {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: prompt });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 4096,
        messages,
      });
      const content = completion.choices[0]?.message?.content || "";
      return Response.json({ content, model, simulated: false });
    }

    // ── Gemini 2.5 Pro (via OpenRouter) ──────────────────────────────────
    if (model === "gemini") {
      const openrouter = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: prompt });

      const completion = await openrouter.chat.completions.create({
        model: "google/gemini-2.5-pro-preview-03-25",
        max_tokens: 4096,
        messages,
      });
      const content = completion.choices[0]?.message?.content || "";
      return Response.json({ content, model, simulated: false });
    }

    // ── Llama 3.3 70B Instruct Turbo (Together AI) ────────────────────────
    if (model === "llama") {
      const together = new OpenAI({
        apiKey: process.env.TOGETHER_API_KEY,
        baseURL: "https://api.together.xyz/v1",
      });
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: prompt });

      const completion = await together.chat.completions.create({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        max_tokens: 4096,
        messages,
      });
      const content = completion.choices[0]?.message?.content || "";
      return Response.json({ content, model, simulated: false });
    }

    return Response.json({ error: "Unknown model" }, { status: 400 });
  } catch (error) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: "Failed to get response", details: message },
      { status: 500 }
    );
  }
}
