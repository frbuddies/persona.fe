export const PERSONAS = [
  {
    id: "ce",
    name: "Consistent Executor",
    short: "Consistent Executor",
    emoji: "\u{1F4AA}",
    tagline: "Persistence-Driven Seller",
    accent: "#2e86c1",
    desc: "Consistent Executors succeed through persistence and effort. They believe that activity creates opportunity, so they focus on calls, meetings, and consistent follow-up. They are disciplined and open to coaching, which makes them easy to manage and improve. Their main challenge is that they sometimes rely too heavily on effort instead of insight. When deals require a shift in the customer's thinking, activity alone may not move the decision forward.",
    strengths: [
      "High effort and persistence",
      "Self-motivated and disciplined",
      "Willing to put in extra time and activity",
      "Actively seeks feedback and coaching",
    ],
    growth: [
      "Moving beyond effort to insight-led selling",
      "Recognizing when activity alone won't advance a deal",
      "Developing a diagnostic approach before proposing solutions",
      "Learning to challenge client assumptions, not just respond to them",
    ],
    tips: [
      {
        label: "Add Insight to Activity",
        text: "Before your next prospect call, research one business challenge specific to their industry that they may not be actively thinking about. Lead with that insight instead of a product pitch \u2014 it changes the entire dynamic of the conversation.",
      },
      {
        label: "Quality Over Quantity",
        text: "Track not just call volume but conversation quality. After each meeting ask yourself: did I learn something new about their business, or did I just present? The latter is activity. The former is progress.",
      },
      {
        label: "Use Your Coachability",
        text: "Your openness to feedback is a rare asset. Schedule a monthly debrief with your manager or a peer to review your three most recent lost or stalled deals. Look for patterns, not just outcomes.",
      },
    ],
    roleAffinity: { hunter: 3, farmer: 2, rancher: 2, ordertaker: 2 },
  },
  {
    id: "ca",
    name: "Client Advocate",
    short: "Client Advocate",
    emoji: "\u{1F91D}",
    tagline: "Trust-First Seller",
    accent: "#1abc9c",
    desc: "Client Advocates focus on trust, rapport, and long-term connections with clients. They believe strong relationships create loyalty and repeat business. These salespeople are often well liked and excellent at maintaining accounts over time. However, they may avoid difficult conversations or hesitate to challenge the customer's assumptions. This can limit their effectiveness in complex sales where the client needs to rethink their current approach.",
    strengths: [
      "Focused on trust and rapport",
      "Strong interpersonal skills",
      "Avoids conflict and tension",
      "Prioritizes customer satisfaction",
    ],
    growth: [
      "Initiating difficult conversations rather than avoiding them",
      "Challenging client assumptions within trusted relationships",
      "Converting relationship depth into strategic conversations",
      "Balancing likability with willingness to push back",
    ],
    tips: [
      {
        label: "Turn Trust Into Access",
        text: "Your strongest client relationships give you something most sellers don't have: permission to ask hard questions. In your next account review ask: 'If you could change one thing about how your business manages risk, what would it be?' Let them tell you the opportunity.",
      },
      {
        label: "Practice the Challenge",
        text: "Identify one client where you've been hesitant to raise a concern. Script a version of that conversation that frames your challenge as advocacy for their success, not criticism. Practice it once before you go in.",
      },
      {
        label: "Expand Your Stakeholder Map",
        text: "Client Advocates often concentrate in one or two contacts. Map every key stakeholder at your top five accounts. Identify who you don't know \u2014 and use your existing relationships to earn introductions.",
      },
    ],
    roleAffinity: { hunter: 1, farmer: 3, rancher: 2, ordertaker: 1 },
  },
  {
    id: "is",
    name: "Independent Seller",
    short: "Independent Seller",
    emoji: "\u{1F43A}",
    tagline: "Instinct-Driven Seller",
    accent: "#8e44ad",
    desc: "Independent Sellers rely on instinct and personal confidence rather than formal sales processes. They tend to trust their own judgment and may ignore rules or structured playbooks. Many Independent Sellers achieve strong results because of their natural selling ability and independence. The downside is that their success is difficult to replicate or coach. Organizations often struggle to scale their performance because it depends heavily on individual personality and intuition.",
    strengths: [
      "Highly independent",
      "Confident in personal instincts",
      "Often ignores formal processes",
      "Relies on personal style and intuition",
    ],
    growth: [
      "Translating instinct into repeatable, teachable methods",
      "Engaging constructively with structure and process",
      "Accepting coaching and incorporating outside perspective",
      "Building consistency that doesn't depend on individual circumstances",
    ],
    tips: [
      {
        label: "Document One Win",
        text: "After your next successful close, write down exactly what you did \u2014 the questions you asked, the moment the conversation shifted, how you handled objections. Most Independent Sellers discover they have a process they just haven't named yet.",
      },
      {
        label: "Test One New Tool",
        text: "Pick one element of the team's sales process or playbook you've been avoiding. Use it on a single deal. You don't have to commit \u2014 just evaluate it on its merits. Independence is only valuable when it's chosen, not reflexive.",
      },
      {
        label: "Find a Thinking Partner",
        text: "You don't need management \u2014 but you may benefit from a peer who challenges your thinking. Identify one seller whose approach differs from yours and commit to a monthly deal debrief. Different perspectives sharpen instinct.",
      },
    ],
    roleAffinity: { hunter: 3, farmer: 1, rancher: 2, ordertaker: 0 },
  },
  {
    id: "re",
    name: "Reliability Expert",
    short: "Reliability Expert",
    emoji: "\u{1F527}",
    tagline: "Service-First Seller",
    accent: "#e67e22",
    desc: "Reliability Experts are consistent and detail oriented. They excel at addressing customer issues quickly and ensuring that commitments are delivered correctly. Clients often trust them because they follow through and solve problems effectively. Their focus on service and execution can make them valuable partners during implementation and account management. However, they tend to wait for problems to appear instead of proactively leading strategic discussions that drive new sales opportunities.",
    strengths: [
      "Detail-oriented and reliable",
      "Strong follow-through after the sale",
      "Excellent at solving customer issues",
      "Focused on service and execution",
    ],
    growth: [
      "Proactively leading strategic conversations, not just responding",
      "Using service touchpoints as a platform for new business",
      "Shifting from reactive execution to consultative advising",
      "Identifying growth opportunities before clients ask for them",
    ],
    tips: [
      {
        label: "Turn Service Into Strategy",
        text: "The next time you solve a client problem, follow up the resolution with a forward-looking question: 'Now that we've handled this \u2014 what else is coming up in the next 12 months that we should be getting ahead of?' Your credibility from solving the problem makes them receptive to a strategic conversation.",
      },
      {
        label: "Create a Proactive Calendar",
        text: "Schedule one proactive check-in per quarter with your top ten accounts \u2014 not triggered by a problem, just to share a relevant market update or emerging risk. Position yourself as someone who brings value before it's needed.",
      },
      {
        label: "Ask the Growth Question",
        text: "In every account review include this question: 'Are there areas of your business that have grown or changed since we last spoke that might need a fresh look?' You already have the trust. The question is whether you're using it.",
      },
    ],
    roleAffinity: { hunter: 0, farmer: 2, rancher: 1, ordertaker: 3 },
  },
  {
    id: "cs",
    name: "Commercial Strategist",
    short: "Commercial Strategist",
    emoji: "\u26A1",
    tagline: "Insight-Led Seller",
    accent: "#c0392b",
    desc: "Commercial Strategists take a different approach by actively shaping how customers think about their business problems. They bring insight to the conversation and help clients see risks or opportunities they had not previously recognized. They tailor their message to different stakeholders and guide the buying process with confidence. They are comfortable discussing money, strategy, and difficult trade-offs. Because they lead the conversation rather than react to it, they often perform best in complex sales with multiple decision makers.",
    strengths: [
      "Teaches customers new insights",
      "Tailors messages to different stakeholders",
      "Takes control of the sales conversation",
      "Thrives in complex multi-stakeholder environments",
    ],
    growth: [
      "Ensuring confidence doesn't come across as dismissiveness",
      "Listening as actively as leading",
      "Building relational trust that sustains long-term accounts",
      "Developing patience in relationships that move slowly",
    ],
    tips: [
      {
        label: "Lead With Their Agenda",
        text: "Before your next pitch, spend 10 minutes identifying what the client publicly cares about \u2014 earnings calls, press releases, LinkedIn posts from leadership. Lead with their stated priorities before you introduce your reframe. It signals you've done the work.",
      },
      {
        label: "Balance Insight With Curiosity",
        text: "The most effective Commercial Strategists ask as many questions as they make statements. In your next meeting, for every insight you introduce, ask one question that deepens your understanding of their reaction. You'll close more by listening to the resistance.",
      },
      {
        label: "Invest in the Relationship Layer",
        text: "Commercial Strategists win the first deal but sometimes lose the account over time by underinvesting in the human connection. After each close, identify one non-business touchpoint you can maintain with the key decision maker \u2014 a shared interest, a relevant article, a check-in during a tough quarter.",
      },
    ],
    roleAffinity: { hunter: 2, farmer: 1, rancher: 3, ordertaker: 0 },
  },
  {
    id: "st",
    name: "Steward",
    short: "Steward",
    emoji: "\u{1F331}",
    tagline: "Long-Term Revenue Builder",
    accent: "#16a085",
    desc: "The Steward is a long-term builder who takes ownership of revenue as if it were their own. Stewards grow business from early opportunities, stay closely involved with clients over time, and continually look for ways to expand, reshape, or replace revenue to keep their portfolio healthy. Unlike sellers focused only on winning new deals or maintaining existing accounts, the Steward balances growth, protection, and continuity to sustain results over long periods. They think in terms of lifetime value, not single transactions, and treat accounts, territories, or market segments as something to be cultivated over time.",
    strengths: [
      "Thinks in terms of lifetime value, not single transactions",
      "Takes long-term ownership of accounts and portfolios",
      "Balances growth, protection, and continuity simultaneously",
      "Motivated by continuity, ownership, and durable results",
    ],
    growth: [
      "Guarding against slow-burn complacency with established accounts",
      "Developing urgency in new business situations",
      "Articulating short-term wins alongside long-term value",
      "Avoiding over-investment in accounts with limited growth potential",
    ],
    tips: [
      {
        label: "Map Your Portfolio Health",
        text: "Take stock of your current portfolio. For each account, ask: Is this growing, holding, or declining? The Steward's edge is knowing which accounts need offense, which need defense, and which may need to be replaced.",
      },
      {
        label: "Set a Replacement Target",
        text: "Identify one account that has plateaued or is at risk of declining. Create a plan \u2014 not to abandon it, but to replace that revenue from elsewhere in the portfolio. Stewards who plan for revenue loss before it happens are the ones who sustain results.",
      },
      {
        label: "Make Expansion Visible",
        text: "Long-term relationships can become invisible to leadership if results are stable rather than growing. Regularly document and communicate the expansion you've driven within existing accounts. Make your stewardship legible \u2014 not just felt by the client.",
      },
    ],
    roleAffinity: { hunter: 1, farmer: 3, rancher: 3, ordertaker: 1 },
  },
];
