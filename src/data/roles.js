export const ROLES = [
  {
    id: "hunter",
    name: "Hunter",
    emoji: "\u{1F3AF}",
    accent: "#c0392b",
    tagline: "New Business Development",
    desc: "Hunters are sales professionals whose primary responsibility is new customer acquisition. They focus on identifying prospects, initiating contact, qualifying leads, and closing new deals. This role is often tied to aggressive growth targets. Hunters thrive in competitive, fast-paced environments and are driven by performance metrics and incentives linked to new business wins.",
    characteristics: [
      "Proactively seek out new prospects through direct outreach, networking, and market engagement",
      "Thrive in competitive, fast-paced environments",
      "Motivated by performance incentives and metrics linked to new business wins",
      "Typical titles vary by organization and industry \u2014 the defining characteristic is a primary focus on new customer acquisition",
    ],
    impact:
      "Hunters build the top of the revenue funnel by converting strangers into customers \u2014 essential for growth and entering new markets.",
    bestFit: ["ce", "is", "cs"],
  },
  {
    id: "farmer",
    name: "Farmer",
    emoji: "\u{1F33E}",
    accent: "#27ae60",
    tagline: "Account Growth & Retention",
    desc: "Farmers focus on existing customer relationships. Their job is to grow revenue through retention, account expansion, and ensuring long-term customer satisfaction. Farmers build deep, trust-based relationships and prioritize customer success and account health over new prospecting.",
    characteristics: [
      "Build deep, trust-based relationships with customers",
      "Prioritize customer success and retention over new prospecting",
      "Drive repeat business and long-term account health",
      "Common titles: Account Manager, Customer Success Manager, Client Relationship Manager",
    ],
    impact:
      "Farmers ensure stable recurring revenue and often unlock higher lifetime value from existing customers, which can be more cost-effective than acquiring new ones.",
    bestFit: ["ca", "st", "re"],
  },
  {
    id: "rancher",
    name: "Rancher",
    emoji: "\u{1F920}",
    accent: "#d35400",
    tagline: "Hybrid / Integrated Grower",
    desc: "Ranchers combine traits of both Hunters and Farmers. They nurture and develop existing accounts like a Farmer, but also strategically seek opportunities to expand or chase new business like a Hunter. Ranchers are patient and persistent but agile \u2014 able to balance relationship stewardship with market-driven growth efforts. This hybrid role suits environments where both acquiring new revenue and deepening existing customer value are equally important.",
    characteristics: [
      "Balances relationship stewardship with new business development",
      "Patient and persistent, but agile enough to seize growth opportunities",
      "Navigates both acquisition and account growth based on customer lifecycle",
      "Best suited to environments where acquisition and account depth both matter",
    ],
    impact:
      "Ranchers represent evolving expectations of sales roles \u2014 professionals who can navigate both acquisition and growth depending on customer lifecycle and organizational needs.",
    bestFit: ["cs", "st", "ca"],
  },
  {
    id: "ordertaker",
    name: "Order Taker",
    emoji: "\u{1F4CB}",
    accent: "#7f8c8d",
    tagline: "Execution & Fulfillment Specialist",
    desc: "The Order Taker role exists when the buying decision is largely made before the seller becomes involved. The seller's primary responsibility is execution, accuracy, and alignment to predefined offerings. This role is optimized for consistency, speed, and margin discipline \u2014 not persuasion, discovery, or complex deal creation. Order Takers work very efficiently in high-volume sales environments and are focused on directing customers to the most profitable solution aligned with their needs.",
    characteristics: [
      "Directs customers to the most profitable solution aligned with their needs",
      "Optimized for consistency, speed, and margin discipline",
      "Excels in high-volume, process-driven, or repeat-business environments",
      "Clear adherence to process with minimal need for complex judgment",
    ],
    impact:
      "Order Takers allow the organization to scale without requiring every seller to operate as a Challenger or Hunter. When designed correctly, this role protects margins, reduces selling cost, and supports high-volume growth.",
    bestFit: ["re", "ce"],
  },
];
