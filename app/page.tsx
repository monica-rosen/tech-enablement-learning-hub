"use client";

import { useMemo, useState } from "react";

const lessons = [
  { id: "idea", label: "The idea" },
  { id: "flow", label: "The flow" },
  { id: "lab", label: "Try it" },
  { id: "quiz", label: "Check it" },
];

const quizQuestions = [
  { question: "Cloud Grind sent a payment request to Stripe. What did the API do?", options: ["Processed the card itself", "Carried a defined request and returned Stripe’s answer", "Opened Stripe’s private systems"], correct: 1, note: "The API is the agreed-upon channel between the two services." },
  { question: "In the restaurant analogy, what is the API?", options: ["The kitchen", "The customer", "The waiter"], correct: 2, note: "The waiter carries a valid order to the kitchen and brings the result back." },
  { question: "What are the two basic parts of an API conversation?", options: ["Login and logout", "Request and response", "Upload and download"], correct: 1, note: "One side sends a request; the other returns a response." },
  { question: "What does a 402 card-declined response mean in our demo?", options: ["The API broke", "The app lost its data", "The API worked and returned a failure the app can handle"], correct: 2, note: "A declined payment is still a valid, useful response." },
  { question: "When a product says it ‘integrated AI,’ what usually happened?", options: ["It built a new AI model", "It called an AI service through an API", "It copied another app’s interface"], correct: 1, note: "The product sends a request to a model API and uses the response in its own interface." },
];

type CardState = "idle" | "sending" | "success" | "declined";

function ApiBasics() {
  const [active, setActive] = useState(0);
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardState, setCardState] = useState<CardState>("idle");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(Array(quizQuestions.length).fill(null));
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

  function chooseAnswer(optionIndex: number) {
    setQuizAnswers((items) => items.map((item, index) => index === quizIndex ? optionIndex : item));
  }

  function advanceQuiz() {
    if (quizIndex < quizQuestions.length - 1) setQuizIndex((index) => index + 1);
    else if (quizAnswers.every((answer, index) => answer === quizQuestions[index].correct)) setCompleted((items) => items.map(() => true));
  }

  function downloadBadge() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200; canvas.height = 1200;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#141413"; context.fillRect(0, 0, 1200, 1200);
    context.strokeStyle = "#353531"; context.lineWidth = 3;
    for (let radius = 180; radius < 700; radius += 110) { context.beginPath(); context.arc(600, 420, radius, 0, Math.PI * 2); context.stroke(); }
    context.fillStyle = "#1d1c1a"; context.beginPath(); context.arc(600, 430, 290, 0, Math.PI * 2); context.fill();
    context.strokeStyle = "#d97757"; context.lineWidth = 12; context.stroke();
    context.fillStyle = "#d97757"; context.font = "700 54px Arial"; context.textAlign = "center"; context.fillText("API", 600, 370);
    context.fillStyle = "#ffffff"; context.font = "700 190px Arial"; context.fillText("✓", 600, 555);
    context.fillStyle = "#6a9bcc"; context.font = "700 28px Arial"; context.letterSpacing = "8px"; context.fillText("KNOWLEDGE BADGE", 600, 790);
    context.fillStyle = "#ffffff"; context.font = "700 64px Arial"; context.fillText("API BASICS", 600, 885);
    context.fillStyle = "#a7a79f"; context.font = "34px Arial"; context.fillText("Request out. Response back.", 600, 950);
    context.fillStyle = "#d97757"; context.fillRect(390, 1010, 420, 4);
    context.fillStyle = "#777770"; context.font = "24px Arial"; context.fillText("API, plainly · Back to Basics 01", 600, 1065);
    const link = document.createElement("a"); link.download = "api-basics-badge.png"; link.href = canvas.toDataURL("image/png"); link.click();
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
            <div className="quizMeta"><span>Question {quizIndex + 1} of {quizQuestions.length}</span><span>{quizAnswers.filter((answer, index) => answer === quizQuestions[index].correct).length} correct</span></div>
            <div className="quizDots">{quizQuestions.map((_, index) => <i key={index} className={`${index === quizIndex ? "current" : ""} ${quizAnswers[index] === quizQuestions[index].correct ? "done" : ""}`} />)}</div>
            <h2>{quizQuestions[quizIndex].question}</h2>
            <p className="sectionIntro">Choose the best answer. Get all five right to unlock your badge.</p>
            <div className="answers">
              {quizQuestions[quizIndex].options.map((option, index) => {
                const selected = quizAnswers[quizIndex] === index;
                const correct = index === quizQuestions[quizIndex].correct;
                return <button key={option} className={selected ? (correct ? "correct" : "wrong") : ""} onClick={() => chooseAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}<b>{selected ? (correct ? "✓" : "×") : ""}</b></button>;
              })}
            </div>
            {quizAnswers[quizIndex] !== null && <div className={`feedback ${quizAnswers[quizIndex] === quizQuestions[quizIndex].correct ? "good" : "tryAgain"}`}><strong>{quizAnswers[quizIndex] === quizQuestions[quizIndex].correct ? "Exactly." : "Try again."}</strong> {quizAnswers[quizIndex] === quizQuestions[quizIndex].correct ? quizQuestions[quizIndex].note : "Use the lesson above, then choose a different answer."}</div>}
            <div className="quizActions">{quizIndex > 0 && <button className="backButton" onClick={() => setQuizIndex((index) => index - 1)}>← Previous</button>}<button className="continueButton" disabled={quizAnswers[quizIndex] !== quizQuestions[quizIndex].correct} onClick={advanceQuiz}>{quizIndex === quizQuestions.length - 1 ? "Finish check" : "Next question"} <span>→</span></button></div>
            {progress === 100 && <div className="completeCard"><span>✓</span><div><small>5 / 5 · LESSON COMPLETE</small><h3>You earned the API Basics badge.</h3><p>Request out. Response back. A defined go-between makes it possible.</p></div><button className="badgeButton" onClick={downloadBadge}>Download badge ↓</button></div>}
          </section>
        </div>
      </div>

      <footer><a className="brand" href="#top"><span className="brandMark">↗</span> API, plainly</a><p>Built for curious people, not just developers.</p><span>Back to Basics · Lesson 01</span></footer>
    </main>
  );
}

function LearningHub() {
  const subscribeUrl = import.meta.env.VITE_SUBSCRIBE_URL as string | undefined;
  const [subscribeState, setSubscribeState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subscribeUrl) return;
    setSubscribeState("sending");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(subscribeUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), website: form.get("website") }),
      });
      if (!response.ok) throw new Error("Subscription failed");
      setSubscribeState("sent");
      event.currentTarget.reset();
    } catch {
      setSubscribeState("error");
    }
  }

  return (
    <main className="hubPage">
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="/"><span className="brandMark">↗</span> Tech Enablement</a>
        <div className="navRight">
          <a className="hubNavLink" href="#courses">Courses</a>
          <a className="smallButton" href="#subscribe">Get new lessons</a>
        </div>
      </nav>

      <section className="hubHero">
        <div className="eyebrow"><span>LEARN BY DOING</span><i /> Plain English · Practical labs</div>
        <h1>Technical ideas,<br /><em>made usable.</em></h1>
        <p className="lede">Short, interactive lessons for curious people who want to understand the technology shaping their work—without getting buried in jargon.</p>
        <div className="heroActions">
          <a className="primaryButton" href="/api-basics/">Start with API basics <span>→</span></a>
          <a className="hubTextLink" href="#subscribe">Get new lessons by email ↓</a>
        </div>
      </section>

      <section className="courseShelf" id="courses">
        <div className="shelfHead"><div><span>COURSE LIBRARY</span><h2>Start with one useful idea.</h2></div><p>Each course combines a walkthrough, a hands-on lab, a knowledge check and a badge.</p></div>
        <div className="courseGrid">
          <a className="courseCard featured" href="/api-basics/">
            <div className="courseMeta"><span>AVAILABLE NOW</span><b>01</b></div>
            <div className="courseIcon">API</div>
            <h3>What is an API?</h3>
            <p>See how software asks other software for something, then send a simulated payment request yourself.</p>
            <div className="courseFoot"><span>7 min · Interactive lab</span><b>Start course →</b></div>
          </a>
          <div className="courseCard upcoming">
            <div className="courseMeta blueText"><span>PLANNED</span><b>02</b></div>
            <div className="courseIcon blueIcon">AWS</div>
            <h3>How a website reaches you</h3>
            <p>Follow a page from storage through a global delivery network to your browser.</p>
            <div className="courseFoot"><span>AWS fundamentals</span><b>Coming next</b></div>
          </div>
          <div className="courseCard upcoming">
            <div className="courseMeta blueText"><span>PLANNED</span><b>03</b></div>
            <div className="courseIcon blueIcon">GIT</div>
            <h3>What GitHub actually does</h3>
            <p>Understand repositories, branches, changes and automated publishing as one visual workflow.</p>
            <div className="courseFoot"><span>GitHub fundamentals</span><b>Coming soon</b></div>
          </div>
        </div>
      </section>

      <section className="subscribeSection" id="subscribe">
        <div className="subscribeCopy">
          <span>STAY IN THE LOOP</span>
          <h2>One useful technical idea at a time.</h2>
          <p>Get new interactive lessons and practical explainers when they are ready. No daily noise.</p>
        </div>
        {subscribeUrl ? (
          <form className="subscribeForm" onSubmit={subscribe}>
            <label htmlFor="subscriber-email">Email address</label>
            <div><input id="subscriber-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /><button type="submit" disabled={subscribeState === "sending"}>{subscribeState === "sending" ? "Sending…" : "Subscribe"} <span>→</span></button></div>
            <input className="websiteTrap" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <small>You can unsubscribe anytime. Subscriber information stays in your AWS account.</small>
            <p className={`subscribeMessage ${subscribeState}`} aria-live="polite">{subscribeState === "sent" ? "Check your inbox to confirm your subscription." : subscribeState === "error" ? "Something went wrong. Please try again." : ""}</p>
          </form>
        ) : (
          <div className="subscribePending"><b>AWS subscriber registration is ready to deploy.</b><span>The form activates automatically when the AWS signup endpoint is added to GitHub.</span></div>
        )}
      </section>

      <footer><a className="brand" href="/"><span className="brandMark">↗</span> Tech Enablement</a><p>Technical learning for curious people.</p><span>The Connective Tissue</span></footer>
    </main>
  );
}

export default function Home() {
  const isApiCourse = typeof window !== "undefined" && window.location.pathname.startsWith("/api-basics");
  return isApiCourse ? <ApiBasics /> : <LearningHub />;
}
