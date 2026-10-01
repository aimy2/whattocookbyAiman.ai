import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const preferences = await request.json();
  const prompt = `You are a careful recipe editor and food photographer. Use every preference below: mood, flavor, continent, country, budget, currency, and requested ranking filter. The ranking filter is a recommendation instruction: ${preferences.filter}. Return ONLY valid JSON with a recipes array containing exactly 3 recipes. Each recipe must have id, title, description, cuisine, time, difficulty, rating, reviews, tags, emoji, imagePrompt, ingredients (array), and steps (array). imagePrompt must describe an appetizing, realistic overhead food photograph of that exact recipe, with no text, logos, or people. Keep instructions practical and measurements clear. Preferences: ${JSON.stringify(preferences)}`;
  const ollamaUrl = process.env.OLLAMA_URL ?? "http://localhost:11434/api/generate";
  const model = process.env.OLLAMA_MODEL ?? "llama3.2";

  try {
    const ollamaResponse = await fetch(ollamaUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model, prompt, stream: false, format: "json" }), signal: AbortSignal.timeout(120000) });
    if (!ollamaResponse.ok) throw new Error("Ollama unavailable");
    const result = await ollamaResponse.json();
    const parsed = JSON.parse(result.response);
    if (!Array.isArray(parsed.recipes)) throw new Error("Unexpected model response");
    const toText = (value: unknown) => typeof value === "string" ? value : JSON.stringify(value);
    const recipes = parsed.recipes.map((recipe: { id: string; imagePrompt?: string; ingredients?: unknown[]; steps?: unknown[]; tags?: unknown[] }) => ({
      ...recipe,
      tags: Array.isArray(recipe.tags) ? recipe.tags.map(toText) : [],
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.map(toText) : [],
      steps: Array.isArray(recipe.steps) ? recipe.steps.map(toText) : [],
      imageUrl: recipe.imagePrompt ? `https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.imagePrompt)}?width=1200&height=800&nologo=true` : undefined,
    }));
    return NextResponse.json({ recipes, source: "ollama" });
  } catch {
    return NextResponse.json({ error: "Ollama is unavailable. Start Ollama and make sure the configured model is installed." }, { status: 503 });
  }
}