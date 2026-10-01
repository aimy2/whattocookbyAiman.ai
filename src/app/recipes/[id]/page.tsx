"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Recipe } from "../../recipes-data";

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [saved, setSaved] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Browser storage is only available after the client mounts.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const selectedRecipe = JSON.parse(sessionStorage.getItem("mise-selected-recipe") ?? "null") as Recipe | null;
    const recipes = JSON.parse(sessionStorage.getItem("mise-recipes") ?? "[]") as Recipe[];
    const found = selectedRecipe?.id === params.id ? selectedRecipe : recipes.find((item) => item.id === params.id);
    setRecipe(found ?? null);
    const auth = localStorage.getItem("mise-auth") === "true";
    const savedIds: string[] = JSON.parse(localStorage.getItem("mise-saved") ?? "[]");
    setLoggedIn(auth);
    setSaved(savedIds.includes(params.id));
  }, [params.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function toggleSave() {
    if (!recipe) return;
    if (!loggedIn) {
      router.push(`/login?next=/recipes/${recipe.id}`);
      return;
    }
    const savedIds: string[] = JSON.parse(localStorage.getItem("mise-saved") ?? "[]");
    const nextIds = saved ? savedIds.filter((id) => id !== recipe.id) : [...savedIds, recipe.id];
    localStorage.setItem("mise-saved", JSON.stringify(nextIds));
    setSaved(!saved);
  }

  if (!recipe) return <div className="app-shell"><main className="not-found"><h1>Recipe not found<span>.</span></h1><Link className="auth-submit" href="/recipes">Back to recipes</Link></main></div>;

  return (
    <div className="app-shell">
      <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">✳</span> What to Cook by Aiman</Link><nav><Link href="/">Discover</Link><Link href="/profile">Saved recipes</Link></nav><Link className="profile-button" href="/profile" aria-label="Open profile">{loggedIn ? "JD" : "?"}</Link></header>
      <main className="detail-page"><Link className="back-link" href="/recipes">← Back to recipes</Link><div className="detail-hero"><div className="detail-art">{recipe.imageUrl ? <Image src={recipe.imageUrl} alt={recipe.title} fill sizes="(max-width: 760px) 100vw, 50vw" /> : <span>{recipe.emoji}</span>}<div className="art-label">{recipe.cuisine}</div></div><div className="detail-copy"><div className="tag-row">{recipe.tags.map((tag, index) => <span key={`${recipe.id}-tag-${index}`}>{tag}</span>)}</div><h1>{recipe.title}<span>.</span></h1><p>{recipe.description}</p><div className="detail-meta"><span>◷ {recipe.time}</span><span>✦ {recipe.rating} <small>({recipe.reviews} reviews)</small></span><span>{recipe.difficulty}</span></div><button className="save-detail" onClick={toggleSave}>{saved ? "♥ Saved to my kitchen" : "♡ Save recipe"}</button></div></div><div className="detail-body"><section><h2>What you&apos;ll need<span>.</span></h2><ul className="ingredient-list">{recipe.ingredients.map((ingredient, index) => <li key={`${recipe.id}-ingredient-${index}`}>{ingredient}</li>)}</ul></section><section><h2>Let&apos;s cook<span>.</span></h2><ol className="step-list">{recipe.steps.map((step, index) => <li key={`${recipe.id}-step-${index}`}><span>{index + 1}</span>{step}</li>)}</ol></section></div><section className="detail-reviews"><div><div className="eyebrow"><span /> FROM THE TABLE</div><h2>Community reviews<span>.</span></h2></div><div className="review-box"><strong>{recipe.rating} / 5 · {recipe.reviews} reviews</strong><span>Reviews from the What to Cook by Aiman community will appear here when Supabase is connected.</span></div></section></main>
    </div>
  );
}
