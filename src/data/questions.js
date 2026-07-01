function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUESTIONS_RAW = [
  {
    q: "When you have a slow week in your pipeline, your first response is to:",
    o: [
      {
        t: "Review your portfolio health \u2014 assess which accounts need attention and prioritize accordingly.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 0, st: 3 },
      },
      {
        t: "Block time for outreach \u2014 more activity will surface new opportunities.",
        s: { ce: 3, ca: 0, is: 1, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Trust your instincts \u2014 you have been here before and know how to work out of it.",
        s: { ce: 0, ca: 0, is: 3, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Reach out to existing clients to see what is on their radar.",
        s: { ce: 0, ca: 3, is: 0, re: 1, cs: 0, st: 1 },
      },
      {
        t: "Identify a specific insight relevant to a target segment and build outreach around it.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 3, st: 0 },
      },
    ],
  },
  {
    q: "A prospect says they are satisfied with their current provider. You respond by:",
    o: [
      {
        t: "Focusing on building a genuine relationship first, without pressure.",
        s: { ce: 0, ca: 3, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Sharing a specific insight about a gap or risk their current approach may be missing.",
        s: { ce: 1, ca: 0, is: 0, re: 0, cs: 3, st: 0 },
      },
      {
        t: "Staying persistent \u2014 follow up regularly until the timing is right.",
        s: { ce: 3, ca: 0, is: 1, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Offering to be a resource if any issues arise down the road.",
        s: { ce: 0, ca: 1, is: 0, re: 3, cs: 0, st: 1 },
      },
      {
        t: "Playing the long game \u2014 planting seeds now with the intent to build a relationship over time.",
        s: { ce: 0, ca: 1, is: 0, re: 0, cs: 0, st: 3 },
      },
    ],
  },
  {
    q: "How do you typically prepare for an initial meeting with a new prospect?",
    o: [
      {
        t: "Rely on experience and my ability to read the situation when I get there.",
        s: { ce: 0, ca: 0, is: 3, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Research their industry and competitive pressures to develop a specific point of view.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 3, st: 0 },
      },
      {
        t: "Research who I will be meeting and look for personal common ground.",
        s: { ce: 0, ca: 3, is: 0, re: 0, cs: 0, st: 1 },
      },
      {
        t: "Review their current situation for gaps or issues I can help them solve.",
        s: { ce: 0, ca: 0, is: 0, re: 3, cs: 0, st: 0 },
      },
      {
        t: "Research their business deeply \u2014 I want to understand their trajectory, not just their current state.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 1, st: 3 },
      },
    ],
  },
  {
    q: "A deal has stalled for three weeks with no response. What do you do?",
    o: [
      {
        t: "Ask if there is an operational challenge I can help address in the meantime.",
        s: { ce: 0, ca: 1, is: 0, re: 3, cs: 0, st: 0 },
      },
      {
        t: "Trust your read \u2014 if they are genuinely interested, they will come back.",
        s: { ce: 0, ca: 0, is: 3, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Keep following up \u2014 persistence will eventually get a response.",
        s: { ce: 3, ca: 0, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Take the long view \u2014 reach out with something genuinely useful rather than a routine check-in.",
        s: { ce: 0, ca: 1, is: 0, re: 0, cs: 1, st: 3 },
      },
      {
        t: "Send a warm personal note \u2014 not about the deal, just checking in.",
        s: { ce: 0, ca: 3, is: 0, re: 0, cs: 0, st: 1 },
      },
    ],
  },
  {
    q: "When a client pushes back on your recommendation, you typically:",
    o: [
      {
        t: "Engage the pushback directly \u2014 their concern may be based on incomplete information.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 3, st: 0 },
      },
      {
        t: "Back off slightly to preserve the relationship and find a compromise.",
        s: { ce: 0, ca: 3, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Dig deeper into their concern and come back with a more tailored solution.",
        s: { ce: 0, ca: 1, is: 0, re: 3, cs: 0, st: 1 },
      },
      {
        t: "Stick with your position if your gut says you are right.",
        s: { ce: 0, ca: 0, is: 3, re: 0, cs: 1, st: 0 },
      },
      {
        t: "Acknowledge their concern and return with additional effort and documentation.",
        s: { ce: 3, ca: 0, is: 0, re: 1, cs: 0, st: 0 },
      },
    ],
  },
  {
    q: "How do you most often generate new leads and prospect opportunities?",
    o: [
      {
        t: "Targeted outreach built around a specific insight for a defined prospect segment.",
        s: { ce: 1, ca: 0, is: 0, re: 0, cs: 3, st: 0 },
      },
      {
        t: "Organic growth from within existing relationships \u2014 expanding into new areas with current clients.",
        s: { ce: 0, ca: 1, is: 0, re: 0, cs: 0, st: 3 },
      },
      {
        t: "Referrals from existing clients and personal network connections.",
        s: { ce: 0, ca: 3, is: 0, re: 1, cs: 0, st: 2 },
      },
      {
        t: "My own targeted approach \u2014 I know what works for me.",
        s: { ce: 0, ca: 0, is: 3, re: 0, cs: 0, st: 0 },
      },
      {
        t: "High-volume outreach \u2014 calls, emails, and networking events.",
        s: { ce: 3, ca: 0, is: 1, re: 0, cs: 0, st: 0 },
      },
    ],
  },
  {
    q: "Your most valuable contribution in a complex, multi-stakeholder sale is:",
    o: [
      {
        t: "Managing the details so the operational side of the proposal is airtight.",
        s: { ce: 0, ca: 0, is: 0, re: 3, cs: 0, st: 0 },
      },
      {
        t: "Understanding how each stakeholder's interests connect to the long-term health of the relationship.",
        s: { ce: 0, ca: 1, is: 0, re: 0, cs: 1, st: 3 },
      },
      {
        t: "Building individual trust with each stakeholder so they personally vouch for you.",
        s: { ce: 0, ca: 3, is: 0, re: 0, cs: 0, st: 1 },
      },
      {
        t: "Consistent follow-up and keeping every stakeholder engaged throughout.",
        s: { ce: 3, ca: 1, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Tailoring a distinct message to each stakeholder based on what they care about.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 3, st: 1 },
      },
    ],
  },
  {
    q: "How do you typically handle coaching or feedback from your manager?",
    o: [
      {
        t: "I appreciate it most when it focuses on relationships and communication style.",
        s: { ce: 0, ca: 3, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "I engage with it critically \u2014 I take what is useful and push back where I disagree.",
        s: { ce: 0, ca: 0, is: 1, re: 0, cs: 3, st: 0 },
      },
      {
        t: "I value it most when it helps me think about the long-term development of my accounts.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 0, st: 3 },
      },
      {
        t: "I listen respectfully, but ultimately trust my own judgment on how to proceed.",
        s: { ce: 0, ca: 0, is: 3, re: 0, cs: 0, st: 0 },
      },
      {
        t: "I welcome it and apply it immediately \u2014 coaching makes me better.",
        s: { ce: 3, ca: 0, is: 0, re: 1, cs: 0, st: 0 },
      },
    ],
  },
  {
    q: "When you lose a deal to a competitor, your first instinct is to:",
    o: [
      {
        t: "Keep the relationship warm \u2014 they may come back when things change.",
        s: { ce: 0, ca: 3, is: 0, re: 0, cs: 0, st: 2 },
      },
      {
        t: "Work harder on the next opportunity \u2014 activity will compensate.",
        s: { ce: 3, ca: 0, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Debrief carefully to understand exactly what insight or angle was missing.",
        s: { ce: 1, ca: 0, is: 0, re: 0, cs: 3, st: 0 },
      },
      {
        t: "Treat the loss as a data point \u2014 file it away and keep the door open for the long run.",
        s: { ce: 0, ca: 1, is: 0, re: 0, cs: 0, st: 3 },
      },
      {
        t: "Move on \u2014 your approach wins more than it loses over time.",
        s: { ce: 0, ca: 0, is: 3, re: 0, cs: 0, st: 0 },
      },
    ],
  },
  {
    q: "A client wants to reduce their spending with you to cut costs. You:",
    o: [
      {
        t: "Trust your sense of whether they are genuinely committed or just testing the water.",
        s: { ce: 0, ca: 0, is: 3, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Prepare a thorough comparison and follow up consistently until they decide.",
        s: { ce: 3, ca: 0, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Step back and consider what this signals about the account's trajectory, then respond accordingly.",
        s: { ce: 0, ca: 1, is: 0, re: 1, cs: 1, st: 3 },
      },
      {
        t: "Listen carefully and avoid pushing too hard \u2014 protecting the relationship comes first.",
        s: { ce: 0, ca: 3, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Challenge the premise \u2014 show data where reducing the investment costs more than it saves.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 3, st: 0 },
      },
    ],
  },
  {
    q: "How do you stay current on industry trends and market developments?",
    o: [
      {
        t: "I pick things up through conversations and keep moving.",
        s: { ce: 2, ca: 1, is: 1, re: 0, cs: 0, st: 0 },
      },
      {
        t: "I actively study market reports and client industries to build a sharp point of view.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 3, st: 1 },
      },
      {
        t: "I develop my own view from experience \u2014 I do not need to read everything.",
        s: { ce: 0, ca: 0, is: 3, re: 0, cs: 0, st: 0 },
      },
      {
        t: "I track trends across my entire portfolio \u2014 I want to anticipate what is coming before my clients ask.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 1, st: 3 },
      },
      {
        t: "I focus on what is relevant to servicing my current accounts correctly.",
        s: { ce: 0, ca: 0, is: 0, re: 3, cs: 0, st: 1 },
      },
    ],
  },
  {
    q: "A key contact at one of your top accounts just left the company. You:",
    o: [
      {
        t: "Leverage every existing relationship at the account to earn a warm introduction.",
        s: { ce: 0, ca: 3, is: 0, re: 0, cs: 0, st: 1 },
      },
      {
        t: "Trust that your track record will speak for itself \u2014 strong results keep accounts.",
        s: { ce: 0, ca: 0, is: 3, re: 1, cs: 0, st: 0 },
      },
      {
        t: "Prepare a tailored briefing that reframes the strategic value of the relationship.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 3, st: 1 },
      },
      {
        t: "Immediately reach out to the new contact and begin consistent outreach.",
        s: { ce: 3, ca: 1, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Treat it as a critical moment \u2014 map the stakeholder landscape and plan a deliberate transition.",
        s: { ce: 0, ca: 1, is: 0, re: 1, cs: 0, st: 3 },
      },
    ],
  },
  {
    q: "Twelve months after closing a deal, your ideal client relationship looks like:",
    o: [
      {
        t: "Regular check-ins, reliable follow-through, and a clear path forward together.",
        s: { ce: 3, ca: 1, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "They see me as a strategic advisor they call when a real decision is on the table.",
        s: { ce: 0, ca: 1, is: 0, re: 0, cs: 3, st: 1 },
      },
      {
        t: "Every commitment delivered consistently \u2014 complete confidence in my execution.",
        s: { ce: 0, ca: 0, is: 0, re: 3, cs: 0, st: 0 },
      },
      {
        t: "A genuine personal connection \u2014 they reach out when things get hard, not just when a contract is up.",
        s: { ce: 0, ca: 3, is: 0, re: 0, cs: 0, st: 1 },
      },
      {
        t: "A relationship that has expanded well beyond the original scope of the engagement.",
        s: { ce: 0, ca: 1, is: 0, re: 0, cs: 0, st: 3 },
      },
    ],
  },
  {
    q: "Your greatest source of professional satisfaction is:",
    o: [
      {
        t: "Hitting my activity targets and knowing the effort was fully there.",
        s: { ce: 3, ca: 0, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Knowing that when something goes wrong, my clients call me first.",
        s: { ce: 0, ca: 1, is: 0, re: 3, cs: 0, st: 1 },
      },
      {
        t: "Winning on my own terms, in my own way.",
        s: { ce: 0, ca: 0, is: 3, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Looking back at an account and seeing how much it has grown under my involvement.",
        s: { ce: 0, ca: 1, is: 0, re: 0, cs: 0, st: 3 },
      },
      {
        t: "Changing how a client thinks about a problem and watching it lead to a better outcome.",
        s: { ce: 0, ca: 0, is: 0, re: 0, cs: 3, st: 0 },
      },
    ],
  },
  {
    q: "The seller you most want to become is best described as:",
    o: [
      {
        t: "The most reliable, detail-oriented professional in the organization.",
        s: { ce: 0, ca: 0, is: 0, re: 3, cs: 0, st: 0 },
      },
      {
        t: "The one who gets results their own way without needing external validation.",
        s: { ce: 0, ca: 0, is: 3, re: 0, cs: 0, st: 0 },
      },
      {
        t: "Someone whose clients and accounts grow measurably over time because of my involvement.",
        s: { ce: 0, ca: 1, is: 0, re: 0, cs: 0, st: 3 },
      },
      {
        t: "The hardest working person in the room \u2014 no one will outwork me.",
        s: { ce: 3, ca: 0, is: 0, re: 0, cs: 0, st: 0 },
      },
      {
        t: "The advisor clients call when they need to make a decision that truly matters.",
        s: { ce: 0, ca: 1, is: 0, re: 0, cs: 3, st: 0 },
      },
    ],
  },
];

export const QUESTIONS = QUESTIONS_RAW.map((q) => ({
  q: q.q,
  o: shuffle(q.o),
}));
