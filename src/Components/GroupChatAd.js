// GroupChatAd.jsx — the parent group chat, answering itself.
//
// A thread fills in real time: someone asks what everyone is doing for after
// school, and the answer arrives from another parent rather than from us. The
// product's whole case — "he BUILDS them" — is said by a mum in a group chat,
// which is the one place a parent already believes it.
//
// ── It has to feel real or it is worth nothing ──
//
// The entire value of this format is that it does not look like an ad for the
// first three seconds. That is bought with detail, and the detail is the work:
// typing indicators before the longer messages, uneven gaps, a name only on
// the first message of a run, a read receipt at the end, an input bar nobody
// uses. Any one of them missing and it reads as a designer's idea of a chat.
//
// THE PAUSES ARE THE PERFORMANCE. Every message carries its own typing time
// and its own hold, and they are deliberately irregular — a fast "wait he
// BUILDS them??" comes back almost instantly, the considered ones take a beat.
// Evening these out is the fastest way to kill the whole thing.
//
// ── Light, on purpose ──
//
// Every recent ad in this repo is a dark stage. This one is a white phone
// screen, because that is what a text thread looks like and because it will
// stop a thumb in a feed of dark posts. Brand red appears once, on the
// endcard, and nowhere in the chat.
//
// FICTIONAL PARENTS. Generic first names, no real people, no real school. The
// thread is an ad device, not a screenshot of anything.
//
// JS owns the schedule; every movement is CSS keyed off it.
import React from "react";
import "../Stylesheets/GroupChatAd.css";

import cnLogo from "../Images/cn-woodbridge-logo.png";

// The people. `me` is the phone the viewer is looking over the shoulder of —
// they get the blue bubbles and no avatar, exactly as they would on a phone.
const WHO = {
  dana:    { name: "Dana",    tint: "#e8734a" },
  priya:   { name: "Priya",   tint: "#7b6cf6" },
  marisol: { name: "Marisol", tint: "#1aa06d" },
  me:      { name: "You",     me: true },
};

// The thread.
//   from    key into WHO
//   text    one bubble
//   typing  ms of typing indicator before it lands — 0 for a quick follow-up
//           from someone who is already mid-thought
//   hold    ms the thread rests after it lands
//
// PLACEHOLDER COPY: the numbers in this dialogue ("6 games since January") are
// public-facing claims about what a kid gets through in a term. Confirm before
// posting — this ad's whole power is that it sounds like a real parent, which
// is exactly why it must not say anything that is not true.
const SCRIPT = [
  { from: "dana",    text: "ok september panic 😅",                    typing: 0,   hold: 520 },
  { from: "dana",    text: "what's everyone doing for after school?",  typing: 0,   hold: 780 },
  { from: "priya",   text: "swimming mon/wed. need one more thing",    typing: 820, hold: 620 },
  { from: "marisol", text: "we're doing Code Ninjas again",            typing: 900, hold: 420 },
  { from: "marisol", text: "he's built 6 games since january 😂",      typing: 0,   hold: 700 },
  // the turn — fast, because this is the reaction the ad is engineered for
  { from: "priya",   text: "wait he BUILDS them??",                    typing: 380, hold: 560 },
  { from: "marisol", text: "that's the whole thing lol",               typing: 520, hold: 700 },
  { from: "me",      text: "ok. signing up.",                          typing: 640, hold: 1500 },
];

// Flattened into one list of timed beats, so the component walks a single
// index instead of juggling two interleaved state machines.
const BEATS = SCRIPT.flatMap((m, i) => [
  ...(m.typing ? [{ k: "typing", from: m.from, ms: m.typing }] : []),
  { k: "msg", i, ms: m.hold },
]);

export default function GroupChatAd() {
  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // step === BEATS.length is the endcard.
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    if (reduce) {
      setStep(BEATS.length);
      return undefined;
    }
    if (step >= BEATS.length) return undefined;      // the endcard holds
    const t = setTimeout(() => setStep((n) => n + 1), BEATS[step].ms);
    return () => clearTimeout(t);
  }, [step, reduce]);

  const done = step >= BEATS.length;
  const beat = done ? null : BEATS[step];

  // How many messages have landed. Counting the beats already walked is what
  // keeps the typing bubble and the thread from ever disagreeing.
  const shown = BEATS.slice(0, step + 1).filter((b) => b.k === "msg").length;
  const typingFrom = beat && beat.k === "typing" ? beat.from : null;

  return (
    <div className={`gc-stage${done ? " gc-done" : ""}`}>
      <div className="gc-phone">
        {/* ---- the header ----
            A group chat names itself and counts its members. Both are here
            because both are what a viewer glances at to decide, in well under
            a second, that this is a real thread and not an ad. */}
        <div className="gc-head">
          <span className="gc-back" aria-hidden />
          <div className="gc-avatars" aria-hidden>
            {["dana", "priya", "marisol"].map((k) => (
              <span key={k} className="gc-av" style={{ background: WHO[k].tint }}>
                {WHO[k].name[0]}
              </span>
            ))}
          </div>
          <div className="gc-title">
            <span className="gc-title-n">Grade 4 Parents</span>
            <span className="gc-title-s">4 people</span>
          </div>
        </div>

        {/* ---- the thread ----
            Bottom-aligned and clipped, so a new message pushes the thread up
            and off the top the way a real one does. No scroll maths: the
            layout gives it for free. */}
        <div className="gc-thread">
          {/* COLUMN-REVERSE, so the rows are handed over newest-first. See the
              stylesheet: a bottom-aligned normal column looks right until the
              thread outgrows the box, and then it overflows DOWNWARD and eats
              its own newest messages — which is exactly what it did here, and
              the ad's last two lines were never on screen. */}
          <div className="gc-scroll">
            {typingFrom && (
              <div className="gc-row gc-row-typing">
                <span
                  className="gc-av gc-av-row"
                  style={{ background: WHO[typingFrom].tint }}
                  aria-hidden
                >
                  {WHO[typingFrom].name[0]}
                </span>
                <span className="gc-typing" aria-hidden>
                  <i /><i /><i />
                </span>
              </div>
            )}

            {/* Lands with the last message, because that is when a real thread
                would show it and because it is the beat the ad rests on. */}
            {shown >= SCRIPT.length && <div className="gc-read">Read</div>}

            {SCRIPT.slice(0, shown)
              .map((m, i) => {
                const w = WHO[m.from];
                // A name only on the FIRST message of a run, as every
                // messaging app does — repeating it on every bubble is the
                // single loudest tell that a chat was drawn rather than had.
                const first = i === 0 || SCRIPT[i - 1].from !== m.from;
                return (
                  <div
                    className={`gc-row${w.me ? " is-me" : ""}${
                      first ? " is-first" : ""
                    }`}
                    key={i}
                  >
                    {!w.me && (
                      <span
                        className="gc-av gc-av-row"
                        style={{ background: first ? w.tint : "transparent" }}
                        aria-hidden
                      >
                        {first ? w.name[0] : ""}
                      </span>
                    )}
                    <div className="gc-col">
                      {!w.me && first && <span className="gc-name">{w.name}</span>}
                      <span className="gc-bubble">{m.text}</span>
                    </div>
                  </div>
                );
              })
              .reverse()}
          </div>
        </div>

        {/* Nobody types in it. It is here because a thread without one is a
            list of bubbles, not a phone. */}
        <div className="gc-bar" aria-hidden>
          <span className="gc-input">Message</span>
          <span className="gc-send" />
        </div>
      </div>

      {/* ---- the endcard ----
          Always mounted over the chat, so the thread can settle back and blur
          under it rather than being cut away. */}
      <div className="gc-end">
        <img className="gc-logo" src={cnLogo} alt="Code Ninjas" />
        <div className="gc-loc">WOODBRIDGE</div>
        <span className="gc-rule" aria-hidden />
        <div className="gc-sub">
          <span>Kids 5&ndash;14 build real games</span>
          <span>After school &amp; weekends</span>
        </div>
        <div className="gc-cta">cnwoodbridge.com</div>
      </div>
    </div>
  );
}
