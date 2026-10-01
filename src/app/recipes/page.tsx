"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Recipe } from "../recipes-data";

const filters = ["Most relevant", "Most famous", "Most reviewed", "Local favorites"];
type Preferences = { mood: string; taste: string; continent: string; country: string; budget: string | null; currency: string; filter: string };

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filter, setFilter] = useState("Most relevant");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  async function generateRecipes(nextPreferences: Preferences) {
    setLoading(true);
    setNotice("");
    try {
      const response = await fetch("/api/recipes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nextPreferences) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Ollama request failed");
      sessionStorage.setItem("whattocookbyAiman-recipes", JSON.stringify(data.recipes));
      setRecipes(data.recipes);
      setNotice("Fresh from Ollama · generated for your preferences");
    } catch (error) {
      setRecipes([]);
      setNotice(error instanceof Error ? error.message : "Ollama could not generate recipes.");
    } finally {
      setLoading(false);
    }
  }

  // Browser storage is only available after the client mounts.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setLoggedIn(localStorage.getItem("whattocookbyAiman-auth") === "true");
    setSavedIds(JSON.parse(localStorage.getItem("whattocookbyAiman-saved") ?? "[]"));
    const storedPreferences = JSON.parse(sessionStorage.getItem("whattocookbyAiman-preferences") ?? "null") as Preferences | null;
    const cachedRecipes = JSON.parse(sessionStorage.getItem("whattocookbyAiman-recipes") ?? "null") as Recipe[] | null;
    setPreferences(storedPreferences);
    const navigationType = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type;
    if (storedPreferences && (!cachedRecipes || navigationType === "reload")) generateRecipes(storedPreferences);
    else {
      if (cachedRecipes) setRecipes(cachedRecipes);
      setLoading(false);
      if (!storedPreferences) setNotice("Start on Discover to ask Ollama for a personalized menu.");
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function toggleSave(id: string) {
    if (!loggedIn) {
      router.push("/login?next=/recipes");
      return;
    }
    const nextIds = savedIds.includes(id) ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id];
    setSavedIds(nextIds);
    localStorage.setItem("whattocookbyAiman-saved", JSON.stringify(nextIds));
  }

  function applyFilter(nextFilter: string) {
    if (!preferences) return;
    const nextPreferences = { ...preferences, filter: nextFilter };
    setFilter(nextFilter);
    setPreferences(nextPreferences);
    sessionStorage.setItem("whattocookbyAiman-preferences", JSON.stringify(nextPreferences));
    generateRecipes(nextPreferences);
  }

  function openRecipe(recipe: Recipe) {
    sessionStorage.setItem("whattocookbyAiman-selected-recipe", JSON.stringify(recipe));
    router.push(`/recipes/${recipe.id}`);
  }

  return (
    <div className="app-shell">
      <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">✳</span> What to Cook by Aiman</Link><nav><Link href="/">Discover</Link><Link href="/profile">Saved recipes <span className="nav-count">{loggedIn ? savedIds.length : "0"}</span></Link></nav><Link className="profile-button" href="/profile" aria-label="Open profile">{loggedIn ? "JD" : "?"}</Link></header>
      <main className="results-page">
        <div className="results-page-intro"><Link className="back-link" href="/">← Change my answers</Link><div className="eyebrow"><span /> YOUR PERSONALIZED MENU</div><h1>Made for this moment<span>.</span></h1><p>Three ideas shaped around your craving. Choose one to start cooking.</p></div>
        <div className="results-toolbar"><strong>{loading ? "Asking Ollama..." : `${recipes.length} recipes found`}</strong><div className="filter-bar">{filters.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => applyFilter(item)} disabled={loading}>{item}</button>)}</div></div>
        {notice && <p className="notice">{notice}</p>}
        {loading ? <div className="loading-state page-loading"><span /> Ollama is cooking up a new menu...</div> : recipes.length > 0 ? <div className="recipe-grid">{recipes.map((recipe, index) => <article className={`recipe-card card-${index}`} key={recipe.id} onClick={() => openRecipe(recipe)}><div className="recipe-art">{recipe.imageUrl ? <Image src={recipe.imageUrl} alt={recipe.title} fill sizes="(max-width: 760px) 100vw, 33vw" /> : <span>{recipe.emoji}</span>}<div className="art-label">{recipe.cuisine}</div><button aria-label={`Save ${recipe.title}`} onClick={(event) => { event.stopPropagation(); toggleSave(recipe.id); }}>{savedIds.includes(recipe.id) ? "♥" : "♡"}</button></div><div className="recipe-info"><div className="tag-row">{recipe.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><h3>{recipe.title}</h3><p>{recipe.description}</p><div className="recipe-meta"><span>◷ {recipe.time}</span><span>✦ {recipe.rating} <small>({recipe.reviews})</small></span></div></div></article>)}</div> : <div className="empty-reviews results-empty"><span>✦</span><div><h3>No Ollama menu yet.</h3><p>Return to discover and ask your local model for recipes.</p></div><Link href="/#discover">Start a new menu <span>↗</span></Link></div>}
      </main>
    </div>
  );
}
