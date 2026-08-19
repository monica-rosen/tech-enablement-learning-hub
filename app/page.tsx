"use client";

import { useMemo, useState } from "react";

const lessons = [
  { id: "idea", label: "The idea" },
  { id: "flow", label: "The flow" },
  { id: "lab", label: "Try it" },
  { id: "quiz", label: "Check it" },
];

type CardState = "idle" | "sending" | "success" | "declined";

export default function Home() {
  const [active, setActive] = useState(0);
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardState, setCardState] = useState<CardState>("idle");
  const [answer, setAnswer] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);

  const progress = useMemo(() => completed.filter(Boolean).length * 25, [completed]);

  function finishStep(index: number) {
    setCompleted((items) => items.map((item, i) => (i === index ? true : item)));
    setActive(Math.min(index + 1, lessons.length - 1));
    window.setTimeout(() => document.getElementById(lessons[Math.min(index + 1, 3)].id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  function runCheckout() {
    setCardState("sending");
    window.setTimeout(() => {
      const digits = cardNumber.replace(/\s/g, "");
      setCardState(digits === "4242424242424242" ? "success" : digits === "4000000000000002" ? "declined" : "declined");
      setCompleted((items) => items.map((item, i) => (i === 2 ? true : item)));
    }, 850);
  }

  return (
    <main>
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#top"><span className="brandMark">↗</span> API, plainly</a>
        <div className="navRight">
          <span className="navMeta">BACK TO BASICS · 01</span>
          <a className="smallButton" href="#lab">Open lab</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow"><span>7 minute lesson</span><i /> No code required</div>
        <h1>What is an <em>API?</em></h1>
        <p className="lede">Software asking other software for something—through a defined, dependable process. You already understand the idea. Let&apos;s make it click.</p>
        <div className="heroActions">
          <a className="primaryButton" href="#idea">Start the walkthrough <span>↓</span></a>
          <span className="saveNote">Your progress stays in this visit</span>
        </div>
        <div className="heroDiagram" aria-label="An app sends a request through an API and receives a response">
          <div className="diagramCard"><small>YOU USE</small><strong>Cloud Grind</strong><span>coffee subscription</span></div>
          <div className="connector"><span>request →</span><b>API</b><span>← response</span></div>
          <div className="diagramCard blue"><small>IT TALKS TO</small><strong>Stripe</strong><span>payment service</span></div>
        </div>
      </section>

      <div className="learningShell">
        <aside className="lessonNav" aria-label="Lesson progress">
          <div className="progressLabel"><span>Your progress</span><b>{progress}%</b></div>
          <div className="progressTrack"><i style={{ width: `${progress}%` }} /></div>
          {lessons.map((lesson, index) => (
            <button key={lesson.id} className={active === index ? "active" : ""} onClick={() => { setActive(index); document.getElementById(lesson.id)?.scrollIntoView({ behavior: "smooth" }); }}>
              <span>{completed[index] ? "✓" : index + 1}</span>{lesson.label}
            </button>
          ))}
        </aside>

        <div className="lessonContent">
          <section className="lessonSection" id="idea">
            <div className="sectionNumber">01 · THE IDEA</div>
            <h2>Picture a waiter, <span>not a wall of code.</span></h2>
            <p className="sectionIntro">At a restaurant, you don&apos;t walk into the kitchen. You ask through a defined go-between.</p>
            <div className="analogyGrid">
              <div className="personCard"><span className="bigIcon">☕</span><small>YOU</small><strong>“One coffee, please.”</strong></div>
              <div className="arrowLine"><span>ORDER</span><i>→</i></div>
              <div className="waiterCard"><span className="bigIcon">◆</span><small>THE WAITER</small><strong>The API</strong><p>Carries a valid request. Brings the result back.</p></div>
              <div className="arrowLine"><span>REQUEST</span><i>→</i></div>
              <div className="personCard blue"><span className="bigIcon">▦</span><small>THE KITCHEN</small><strong>Another service</strong></div>
            </div>
            <div className="plainCallout"><span>SO WHAT?</span><p>An API is a defined go-between. It tells software <strong>what it can ask for</strong> and <strong>how to ask.</strong></p></div>
            <button className="continueButton" onClick={() => finishStep(0)}>That makes sense <span>→</span></button>
          </section>

          <section className="lessonSection" id="flow">
            <div className="sectionNumber blueText">02 · THE FLOW</div>
            <h2>One side asks. <span className="blueText">The other answers.</span></h2>
            <p className="sectionIntro">Every API conversation has the same simple rhythm.</p>
            <div className="flowCard">
              <div className="flowTop"><span className="method">POST</span><code>/payments</code><span className="statusPill">REQUEST</span></div>
              <pre>{`{\n  "amount": 1800,\n  "currency": "usd",\n  "description": "Cloud Grind subscription"\n}`}</pre>
              <div className="flowDivider"><span>Stripe does the work</span><i>↓</i></div>
              <div className="flowTop response"><span className="method blueBg">200</span><code>OK</code><span className="statusPill bluePill">RESPONSE</span></div>
              <pre className="responseCode">{`{ "status": "succeeded" }`}</pre>
            </div>
            <p className="caption">The app and Stripe don&apos;t need to see inside each other. They only need to agree on the request.</p>
            <button className="continueButton" onClick={() => finishStep(1)}>Let me try it <span>→</span></button>
          </section>

          <section className="lessonSection" id="lab">
            <div className="sectionNumber">03 · INTERACTIVE LAB</div>
            <h2>Send a payment <span>request.</span></h2>
            <p className="sectionIntro">You&apos;re Cloud Grind. Enter a test card, then watch the API conversation happen.</p>
            <div className="labGrid">
              <div className="checkoutCard">
                <div className="checkoutHead"><div><small>CLOUD GRIND</small><strong>Monthly coffee subscription</strong></div><b>$18</b></div>
                <label htmlFor="card">Test card number</label>
                <input id="card" value={cardNumber} onChange={(e) => { setCardNumber(e.target.value); setCardState("idle"); }} inputMode="numeric" aria-describedby="test-cards" />
                <div className="testCards" id="test-cards">
                  <button onClick={() => { setCardNumber("4242 4242 4242 4242"); setCardState("idle"); }}><span className="dot successDot" />4242 · success</button>
                  <button onClick={() => { setCardNumber("4000 0000 0000 0002"); setCardState("idle"); }}><span className="dot declineDot" />0002 · decline</button>
                </div>
                <button className="payButton" onClick={runCheckout} disabled={cardState === "sending"}>{cardState === "sending" ? "Sending request…" : "Send $18 request"}<span>→</span></button>
                <p className="simulationNote">Simulation only. Never enter a real card number.</p>
              </div>
              <div className={`consoleCard ${cardState}`} aria-live="polite">
                <div className="consoleHead"><span><i /> API MONITOR</span><b>{cardState === "sending" ? "LIVE" : "READY"}</b></div>
                {cardState === "idle" && <div className="emptyConsole"><span>↗</span><p>Your request will appear here.</p></div>}
                {cardState === "sending" && <div className="sendingConsole"><div className="pulse" /><code>POST /v1/payment_intents</code><p>Sending a request to Stripe…</p></div>}
                {cardState === "success" && <div className="resultConsole"><span className="resultIcon">✓</span><small>RESPONSE · 200 OK</small><h3>Payment succeeded</h3><code>{`{ "status": "succeeded",\n  "amount": 1800 }`}</code><p>The response tells Cloud Grind it&apos;s safe to confirm your subscription.</p></div>}
                {cardState === "declined" && <div className="resultConsole decline"><span className="resultIcon">!</span><small>RESPONSE · 402</small><h3>Card declined</h3><code>{`{ "status": "failed",\n  "code": "card_declined" }`}</code><p>The API still worked—it returned a clear answer the app knows how to handle.</p></div>}
              </div>
            </div>
            {cardState !== "idle" && cardState !== "sending" && <button className="continueButton" onClick={() => finishStep(2)}>Check what I learned <span>→</span></button>}
          </section>

          <section className="lessonSection finalSection" id="quiz">
            <div className="sectionNumber blueText">04 · QUICK CHECK</div>
            <h2>What did the API <span className="blueText">do?</span></h2>
            <p className="sectionIntro">Cloud Grind sent a payment request to Stripe. Which statement is true?</p>
            <div className="answers">
              {["Cloud Grind processed the card itself.", "The API carried a defined request and returned Stripe’s answer.", "Stripe gave Cloud Grind access to its private systems."].map((option, index) => (
                <button key={option} className={answer === option ? (index === 1 ? "correct" : "wrong") : ""} onClick={() => { setAnswer(option); if (index === 1) setCompleted((items) => items.map(() => true)); }}><span>{String.fromCharCode(65 + index)}</span>{option}<b>{answer === option ? (index === 1 ? "✓" : "×") : ""}</b></button>
              ))}
            </div>
            {answer && <div className={`feedback ${answer.includes("defined request") ? "good" : "tryAgain"}`}><strong>{answer.includes("defined request") ? "Exactly." : "Not quite."}</strong> {answer.includes("defined request") ? "The API is the agreed-upon channel between the two services." : "Remember the waiter: the go-between carries the order; it doesn’t cook the meal or reveal the kitchen."}</div>}
            {progress === 100 && <div className="completeCard"><span>✓</span><div><small>LESSON COMPLETE</small><h3>You can now explain an API in plain English.</h3><p>Request out. Response back. A defined go-between makes it possible.</p></div><a href="#top">Start again ↑</a></div>}
          </section>
        </div>
      </div>

      <footer><a className="brand" href="#top"><span className="brandMark">↗</span> API, plainly</a><p>Built for curious people, not just developers.</p><span>Back to Basics · Lesson 01</span></footer>
    </main>
  );
}
