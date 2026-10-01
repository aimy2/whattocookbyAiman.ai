"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const savedRecipes = [
  { id: "coconut-curry", title: "Golden coconut chickpea curry", detail: "South Asian · 35 min", emoji: "🍛", color: "gold" },
  { id: "miso-noodles", title: "Miso butter sesame noodles", detail: "Japanese-inspired · 18 min", emoji: "🍜", color: "green" },
];

export default function ProfilePage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setLoggedIn(localStorage.getItem("whattocookbyAiman-auth") === "true");
    setSavedIds(JSON.parse(localStorage.getItem("whattocookbyAiman-saved") ?? "[]"));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function logout() {
    localStorage.removeItem("whattocookbyAiman-auth");
    localStorage.removeItem("whattocookbyAiman-user");
    localStorage.removeItem("whattocookbyAiman-credentials");
    localStorage.removeItem("whattocookbyAiman-saved");
    sessionStorage.removeItem("whattocookbyAiman-recipes");
    setLoggedIn(false);
    setSavedIds([]);
  }

  if (loggedIn === null) return <div className="app-shell" />;

  if (!loggedIn) return (
    <div className="app-shell profile-shell">
      <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">✳</span> What to Cook by Aiman</Link><nav><Link href="/">Discover</Link><Link href="/profile">Saved recipes <span className="nav-count">0</span></Link></nav><Link className="profile-button" href="/login">?</Link></header>
      <main className="profile-main guest-profile"><section className="profile-hero"><div className="profile-avatar guest-avatar">?</div><div><div className="eyebrow"><span /> YOUR KITCHEN</div><h1>Make it yours<span>.</span></h1><p>Log in to save recipes, keep your cooking history, and share notes with the table.</p></div></section><section className="login-prompt"><span>✦</span><div><h2>Save the good ones.</h2><p>Your saved recipes will appear here after you log in.</p></div><Link className="auth-submit" href="/login?next=/profile">Log in to save recipes <span>↗</span></Link></section></main>
    </div>
  );

  return (
    <div className="app-shell profile-shell">
      <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">✳</span> What to Cook by Aiman</Link><nav><Link href="/">Discover</Link><Link href="/profile">My kitchen <span className="nav-count">2</span></Link></nav><Link className="profile-button profile-active" href="/profile" aria-label="Current profile">JD</Link></header>
      <main className="profile-main">
        <section className="profile-hero"><div className="profile-avatar">JD</div><div><div className="eyebrow"><span /> YOUR KITCHEN</div><h1>Hi, Jamie<span>.</span></h1><p>A little place for the things you want to cook again.</p></div><button className="edit-profile logout-button" onClick={logout}>Log out <span>↗</span></button></section>
        <section className="profile-stats"><div><strong>02</strong><span>Saved recipes</span></div><div><strong>04</strong><span>Reviews shared</span></div><div><strong>12</strong><span>Recipes made</span></div><div className="profile-note">✦ <span>Member since<br /><b>September 2026</b></span></div></section>
        <section className="profile-section"><div className="section-heading"><div><div className="eyebrow"><span /> YOUR COLLECTION</div><h2>Saved for later<span>.</span></h2></div><Link href="/#discover">Find another recipe <span>↗</span></Link></div>{savedIds.length === 0 ? <div className="empty-reviews"><span>♡</span><div><h3>No saved recipes yet.</h3><p>Tap the heart on a recipe to keep it in your kitchen.</p></div><Link href="/#discover">Find a recipe <span>↗</span></Link></div> : <div className="saved-grid">{savedRecipes.filter((recipe) => savedIds.includes(recipe.id)).map((recipe) => <article className="saved-card" key={recipe.title}><div className={`saved-art ${recipe.color}`}><span>{recipe.emoji}</span><button aria-label={`Remove ${recipe.title}`}>♡</button></div><div className="saved-info"><h3>{recipe.title}</h3><p>{recipe.detail}</p><Link href={`/recipes/${recipe.id}`}>View recipe <span>↗</span></Link></div></article>)}</div>}</section>
        <section className="profile-section review-section"><div className="section-heading"><div><div className="eyebrow"><span /> YOUR TABLE NOTES</div><h2>Reviews you&apos;ve shared<span>.</span></h2></div></div><div className="empty-reviews"><span>✎</span><div><h3>Your thoughts make recipes better.</h3><p>Once you leave a review, it will live here for you and the next cook.</p></div><Link href="/">Discover recipes <span>↗</span></Link></div></section>
      </main>
    </div>
  );
}