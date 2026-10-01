"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const moods = [
  { label: "Comforting", icon: "☁", value: "comforting" },
  { label: "Fresh & light", icon: "✦", value: "fresh and light" },
  { label: "A little fancy", icon: "✧", value: "exquisite" },
  { label: "Quick win", icon: "↯", value: "easy and quick" },
];

const tastes = ["Savory", "Sweet", "Spicy", "Tangy", "Creamy", "Crunchy"];
const countriesByContinent: Record<string, string[]> = {
  Asia: ["India", "Japan", "Thailand"],
  Europe: ["Italy", "France", "Greece"],
  Africa: ["Morocco", "Nigeria", "South Africa"],
  "North America": ["Canada", "Mexico", "United States"],
  "South America": ["Argentina", "Brazil", "Peru"],
  Oceania: ["Australia", "New Zealand"],
};
const currencyByCountry: Record<string, string> = { India: "INR", Japan: "JPY", Thailand: "THB", Italy: "EUR", France: "EUR", Greece: "EUR", Morocco: "MAD", Nigeria: "NGN", "South Africa": "ZAR", Canada: "CAD", Mexico: "MXN", "United States": "USD", Argentina: "ARS", Brazil: "BRL", Peru: "PEN", Australia: "AUD", "New Zealand": "NZD" };
const allCountries = Object.values(countriesByContinent).flat();

export default function Home() {
  const router = useRouter();
  const [mood, setMood] = useState("comforting");
  const [taste, setTaste] = useState("Savory");
  const [continent, setContinent] = useState("Any continent");
  const [country, setCountry] = useState("Any country");
  const [currency, setCurrency] = useState("USD");
  const [budget, setBudget] = useState("15");
  const [filter] = useState("Most relevant");
  const [loggedIn, setLoggedIn] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const countryOptions = continent === "Any continent" ? allCountries : countriesByContinent[continent] ?? [];

  // Browser storage is only available after the client mounts.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setLoggedIn(localStorage.getItem("whattocookbyAiman-auth") === "true");
    setSavedIds(JSON.parse(localStorage.getItem("whattocookbyAiman-saved") ?? "[]"));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  async function discover() {
    sessionStorage.setItem("whattocookbyAiman-preferences", JSON.stringify({ mood, taste, continent, country, budget: budget || null, currency, filter }));
    sessionStorage.removeItem("whattocookbyAiman-recipes");
    router.push("/recipes");
  }

  function handleContinentChange(nextContinent: string) {
    setContinent(nextContinent);
    if (country !== "Any country" && nextContinent !== "Any continent" && !countriesByContinent[nextContinent]?.includes(country)) setCountry("Any country");
  }

  function handleCountryChange(nextCountry: string) {
    setCountry(nextCountry);
    if (currencyByCountry[nextCountry]) setCurrency(currencyByCountry[nextCountry]);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top"><span className="brand-mark">✳</span> What to Cook by Aiman</a>
        <nav><a href="#discover">Discover</a><a href="/profile">Saved recipes <span className="nav-count">{loggedIn ? savedIds.length : "0"}</span></a></nav>
        <a className="profile-button" href="/profile" aria-label="Open profile">{loggedIn ? "JD" : "?"}</a>
      </header>

      <main id="top" className="main-content">
        <section className="intro" id="discover">
          <div className="eyebrow"><span /> YOUR NEXT DELICIOUS DECISION</div>
          <h1>What are you<br /><em>in the mood</em> for?</h1>
          <p>Tell us what sounds good. We&apos;ll turn the feeling into something worth cooking.</p>
        </section>

        <section className="question-panel" aria-label="Recipe preferences">
          <div className="question-block">
            <div className="question-heading"><span className="step">01</span><div><h2>Set the vibe</h2><p>What kind of meal are you craving?</p></div></div>
            <div className="mood-grid">{moods.map((item) => <button key={item.value} className={`mood-card ${mood === item.value ? "active" : ""}`} onClick={() => setMood(item.value)}><span className="mood-icon">{item.icon}</span><span>{item.label}</span>{mood === item.value && <b>✓</b>}</button>)}</div>
          </div>

          <div className="question-block split-block">
            <div className="question-heading"><span className="step">02</span><div><h2>Make it yours</h2><p>A few details make the magic more personal.</p></div></div>
            <div className="preference-grid">
              <label>FLAVOR PROFILE<div className="pill-row">{tastes.map((item) => <button key={item} className={`pill ${taste === item ? "selected" : ""}`} onClick={() => setTaste(item)}>{item}</button>)}</div></label>
              <label>CONTINENT<select value={continent} onChange={(event) => handleContinentChange(event.target.value)}><option>Any continent</option>{Object.keys(countriesByContinent).map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>COUNTRY<select value={country} onChange={(event) => handleCountryChange(event.target.value)}><option>Any country</option>{countryOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>BUDGET <span className="optional">OPTIONAL</span><div className="budget-input"><select value={currency} onChange={(event) => setCurrency(event.target.value)} aria-label="Currency"><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option><option>JPY</option><option>AUD</option><option>CAD</option><option>THB</option><option>MAD</option><option>NGN</option><option>ZAR</option><option>MXN</option><option>ARS</option><option>BRL</option><option>PEN</option><option>NZD</option></select><input value={budget} onChange={(event) => setBudget(event.target.value.replace(/\D/g, ""))} inputMode="numeric" aria-label="Budget" /><small>per person</small></div></label>
            </div>
          </div>

          <div className="action-row"><p><span className="sparkle">✦</span> Recipes shaped by your taste, powered locally.</p><button className="discover-button" onClick={discover}>Find my recipes<span>↗</span></button></div>
        </section>

        <section className="footer-note" id="saved"><span className="footer-mark">✳</span><p>Your kitchen, your rules.<br /><strong>Good food starts with a feeling.</strong></p><span className="footer-line" /></section>
      </main>

    </div>
  );
}
