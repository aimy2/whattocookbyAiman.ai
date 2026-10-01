"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const storedCredentials = JSON.parse(localStorage.getItem("whattocookbyAiman-credentials") ?? "null") as { email: string; password: string } | null;

    if (storedCredentials && (storedCredentials.email !== email || storedCredentials.password !== password)) {
      setMessage("Those credentials do not match this local account.");
      return;
    }

    localStorage.setItem("whattocookbyAiman-credentials", JSON.stringify({ email, password }));
    localStorage.setItem("whattocookbyAiman-auth", "true");
    localStorage.setItem("whattocookbyAiman-user", JSON.stringify({ email }));
    window.location.href = new URLSearchParams(window.location.search).get("next") ?? "/profile";
  }

  return (
    <div className="auth-shell">
      <header className="topbar auth-topbar">
        <Link className="brand" href="/"><span className="brand-mark">✳</span> What to Cook by Aiman</Link>
        <Link className="back-link" href="/">Back to discover <span>↗</span></Link>
      </header>
      <main className="auth-main">
        <div className="auth-intro"><div className="eyebrow"><span /> WELCOME BACK</div><h1>Good food is<br /><em>worth remembering.</em></h1><p>Sign in to keep your favorite recipes close and leave notes for the next person at the table.</p></div>
        <section className="auth-card">
          <div className="auth-card-heading"><span className="auth-icon">✳</span><div><h2>Sign in to What to Cook by Aiman</h2><p>Your kitchen journal awaits.</p></div></div>
          <button className="social-button" type="button" onClick={() => setMessage("Social sign-in will connect when Supabase Auth is configured.")}><span>G</span> Continue with Google</button>
          <div className="or-divider"><span>or use email</span></div>
          <form onSubmit={handleSubmit}>
            <label>Email address<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
            <label>Password<div className="password-field"><input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /><button type="button" aria-label="Show password">◉</button></div></label>
            <div className="form-options"><label className="check-label"><input type="checkbox" /> Remember me</label><a href="/login">Forgot password?</a></div>
            <button className="auth-submit" type="submit">Sign in <span>↗</span></button>
          </form>
          {message && <p className="auth-message">{message}</p>}
          <p className="auth-switch">New to What to Cook by Aiman? <a href="/login">Create an account</a></p>
        </section>
      </main>
    </div>
  );
}