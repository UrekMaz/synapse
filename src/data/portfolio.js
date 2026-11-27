/*
 * Portfolio mode: Synapse is marketed first as a portfolio builder. A project's siteType ("portfolio" | "website")
 * decides the app's wording, the starter page and the copy new sections arrive with. Copy is placeholder text
 * written for an individual creative; the owner's name and role (asked during setup) are woven in.
 */
export const SITE_TYPES = [
  { id: "portfolio", label: "Portfolio", description: "Show your work, tell your story and get hired. Starts with a ready-made portfolio you can make your own.", badge: "Recommended" },
  { id: "website", label: "Business website", description: "A site for a company, product or brand. Starts from a blank page." },
];
export const DEFAULT_OWNER = { name: "Alex Morgan", role: "Product Designer" };
export const isPortfolio = (p) => (p?.siteType || "portfolio") === "portfolio";

// App wording that changes with the project type.
export function siteWords(p) {
  const portfolio = isPortfolio(p);
  return {
    noun: portfolio ? "portfolio" : "website",
    Noun: portfolio ? "Portfolio" : "Website",
    create: portfolio ? "Create portfolio" : "Create website",
  };
}

// Section library category names shown to portfolio users (the underlying categories don't change).
export const PORTFOLIO_CATEGORY_LABELS = {
  Navigation: "Menu", Hero: "Intro", Features: "Skills", About: "About me", Services: "Services", Statistics: "Highlights",
  Logos: "Clients", Testimonials: "Kind words", Team: "Collaborators", Portfolio: "Projects", Pricing: "Rates", FAQ: "FAQ",
  CTA: "Call to action", Contact: "Contact", Footer: "Footer",
};

const year = new Date().getFullYear();
const first = (name) => (name || "").trim().split(/\s+/)[0] || "me";
const article = (w) => (/^[aeiou]/i.test(w) ? "an" : "a");
const aRole = (r) => `${article(r)} ${r.toLowerCase()}`;
const emailOf = (name) => `hello@${(name || "you").toLowerCase().replace(/[^a-z]+/g, "") || "you"}.com`;

// Per section type: { elementId: propsPatch }. Navbars / footers / heroes share element ids across designs.
function copyFor(type, kind, { name, role }) {
  const r = role || DEFAULT_OWNER.role;
  if (kind === "nav") {
    return {
      logo: { text: name },
      "link-1": { label: "Work", href: "#work" }, "link-2": { label: "About", href: "#about" },
      "link-3": { label: "Services", href: "#services" }, "link-4": { label: "Contact", href: "#contact" },
      cta: { text: "Hire me", href: "#contact" },
    };
  }
  if (kind === "footer") {
    return {
      logo: { text: name },
      description: { text: `${r} creating thoughtful, useful work. Open to new projects and collaborations.` },
      "column-1": { heading: "Work", links: [{ label: "Projects", href: "#work" }, { label: "Services", href: "#services" }, { label: "Kind words", href: "#testimonials" }] },
      "column-2": { heading: "About", links: [{ label: "About me", href: "#about" }, { label: "Experience", href: "#about" }, { label: "Contact", href: "#contact" }] },
      "column-3": { heading: "Elsewhere", links: [{ label: "Résumé", href: "#" }, { label: "Dribbble", href: "#" }, { label: "LinkedIn", href: "#" }] },
      legal: { links: [{ label: "Work", href: "#work" }, { label: "About", href: "#about" }, { label: "Contact", href: "#contact" }] },
      copyright: { text: `© ${year} ${name}. All rights reserved.` },
      newsletter: { heading: "Notes from the studio", text: "New work and the occasional behind-the-scenes, a few times a year.", placeholder: "you@email.com", buttonText: "Subscribe" },
    };
  }
  const intro = {
    eyebrow: { text: `👋 Hi, I'm ${name}` },
    heading: { text: `${r} making thoughtful, memorable work` },
    subtitle: { text: "I help people and brands bring their ideas to life — with work that's clear, considered and made with care." },
    cta: { text: "View my work", href: "#work" }, "cta-2": { text: "Get in touch", href: "#contact" },
    note: { text: "Currently available for freelance projects" },
  };
  switch (type) {
    case "spotlight-hero": return intro;
    case "floating-dashboard": return { ...intro, "cta-primary": { text: "View my work", href: "#work" }, "cta-secondary": { text: "Get in touch", href: "#contact" }, trust: { text: "Available for freelance & full-time roles" } };
    case "liquid-chrome": case "floating-universe": return { eyebrow: { text: `${name} — ${r}` }, heading: { text: "Design with intent. Built with care." }, subtitle: intro.subtitle, cta: intro.cta, scroll: { text: "Scroll ↓" } };
    case "cinematic-reveal": return { eyebrow: { text: `${name} — Selected work` }, index: { text: `Portfolio — ${year}` }, heading: { text: "Work that tells a story." }, subtitle: { text: `${r}. Every project, frame by frame.` }, cta: intro.cta };
    case "typography-explosion": return {
      "heading-1": { text: "MAKE" }, "heading-2": { text: "IT" }, "heading-3": { text: "MATTER." },
      subtitle: { text: `I'm ${name}, ${aRole(r)} creating work that's impossible to ignore.` },
      "cta-primary": { text: "See my work", href: "#work" }, "cta-secondary": { text: "Let's talk", href: "#contact" },
      "meta-tl": { text: `© ${year} ${name}` }, "meta-tr": { text: "Portfolio (01)" },
    };
    case "about": return {
      eyebrow: { text: "About me" }, heading: { text: `Hi, I'm ${first(name)} — I make work with people in mind` },
      subtitle: { text: `I'm ${aRole(r)} with a love for clear ideas and careful craft. I've worked with startups, studios and global brands, and I believe good work starts with listening.` },
      "fact-1": { value: "8+", label: "Years of experience" }, "fact-2": { value: "60+", label: "Projects delivered" }, "fact-3": { value: "25", label: "Happy clients" },
      cta: { text: "Download résumé", href: "#" }, "cta-2": { text: "Get in touch", href: "#contact" },
    };
    case "portfolio": return {
      eyebrow: { text: "Selected work" }, heading: { text: "Projects I'm proud of" },
      "project-1": { title: "Casa Lumière", category: "Brand identity", text: "A calm, coastal identity for a boutique hotel." },
      "project-2": { title: "Field Notes", category: "Packaging", text: "Packaging and art direction for an independent stationery label." },
      "project-3": { title: "Pulse", category: "Product design", text: "Designing a real-time analytics app from first sketch to launch." },
      "project-4": { title: "Chromatic", category: "Art direction", text: "A generative campaign for a design festival." },
      "project-5": { title: "Studio North", category: "Web design", text: "A portfolio site for a 60-person creative agency." },
      "project-6": { title: "Kōbo", category: "E-commerce", text: "A faster, friendlier checkout for an online store." },
      cta: { text: "See all projects" },
    };
    case "services": return {
      eyebrow: { text: "What I do" }, heading: { text: "Ways I can help" },
      subtitle: { text: "Whether you need a full product or a fresh coat of paint, I'll work with you from first idea to final pixel." },
      "service-1": { title: "Brand identity", text: "Logos, type and visual systems that make you instantly recognisable.", linkLabel: "Learn more" },
      "service-2": { title: "Product & UX design", text: "Research-led interfaces your users will genuinely enjoy using.", linkLabel: "Learn more" },
      "service-3": { title: "Websites", text: "Fast, accessible websites that look great on every screen.", linkLabel: "Learn more" },
      "service-4": { title: "Art direction", text: "Campaigns, photography and content with a clear point of view.", linkLabel: "Learn more" },
      cta: { text: "Start a project", href: "#contact" },
    };
    case "features": return {
      eyebrow: { text: "Skills" }, heading: { text: "What I bring to every project" },
      subtitle: { text: "A mix of strategy, craft and collaboration — the tools I reach for most." },
      "feature-1": { title: "Visual design", text: "Typography, colour and layout that feel considered and on-brand." },
      "feature-2": { title: "UX & research", text: "Interviews, testing and flows grounded in what people actually need." },
      "feature-3": { title: "Prototyping", text: "Interactive prototypes that make ideas easy to test and share." },
      "feature-4": { title: "Design systems", text: "Reusable components that keep products consistent as they grow." },
      "feature-5": { title: "Collaboration", text: "Clear communication with clients, developers and stakeholders." },
      "feature-6": { title: "Front-end basics", text: "Enough code to build, ship and speak the same language as engineers." },
      cta: { text: "See my work", href: "#work" },
    };
    case "stats": return {
      eyebrow: { text: "Highlights" }, heading: { text: "A few numbers so far" },
      "stat-1": { label: "Projects shipped", text: "For startups, studios and global brands." },
      "stat-2": { label: "Client satisfaction", text: "Based on post-project feedback." },
      "stat-3": { label: "Awards & features", text: "Including design annuals and showcases." },
      "stat-4": { label: "Years designing", text: "And still learning every day." },
    };
    case "logos": return { heading: { text: "Brands I've worked with" } };
    case "testimonials": return {
      eyebrow: { text: "Kind words" }, heading: { text: "What clients say" },
      "testimonial-1": { quote: `${first(name)} took our rough idea and turned it into something our customers love. Thoughtful, fast and a pleasure to work with.`, role: "Founder, Field Notes" },
      "testimonial-2": { quote: "The attention to detail is unreal. Our sign-ups went up the week we launched the redesign.", role: "Head of Marketing, Pulse" },
      "testimonial-3": { quote: "Clear communication, great taste and always on time. We've already booked the next project.", role: "Creative Director" },
      "testimonial-4": { quote: "Brought calm and clarity to a messy brief. The final result exceeded every expectation.", role: "Product Lead" },
      "testimonial-5": { quote: "A rare designer who thinks about the business as much as the pixels.", role: "CEO" },
    };
    case "team": return {
      eyebrow: { text: "Collaborators" }, heading: { text: "People I work with" },
      subtitle: { text: "Trusted partners I bring in when a project needs extra hands." },
    };
    case "pricing": return {
      eyebrow: { text: "Rates" }, heading: { text: "Simple ways to work together" },
      subtitle: { text: "Every project is different — these are good starting points. Let's talk about yours." },
      "plan-1": { name: "Sprint", ctaText: "Book a sprint" }, "plan-2": { name: "Project", ctaText: "Start a project" }, "plan-3": { name: "Retainer", ctaText: "Let's talk" },
    };
    case "faq": return {
      eyebrow: { text: "FAQ" }, heading: { text: "Good to know" },
      subtitle: { text: "Answers to the questions I'm asked most. Anything else? Just get in touch." },
      "faq-1": { question: "Are you available for new projects?", answer: "Yes — I usually book a few weeks ahead. Get in touch with your timeline and I'll let you know." },
      "faq-2": { question: "What does a typical project look like?", answer: "A short discovery call, a clear proposal, then design in focused rounds with regular check-ins." },
      "faq-3": { question: "Do you work with teams remotely?", answer: "Always. I work with clients around the world and adapt to your time zone and tools." },
      "faq-4": { question: "How much does a project cost?", answer: "It depends on scope. Most projects are priced per phase so you always know what to expect." },
      "faq-5": { question: "Can you also build the website?", answer: "For many projects, yes — or I'll work closely with your developers to bring the design to life." },
      "faq-6": { question: "What do you need to get started?", answer: "A short description of your goals, timeline and budget. That's enough for a first conversation." },
      cta: { text: "Ask me anything", href: "#contact" },
    };
    case "cta": return {
      heading: { text: "Have a project in mind?" },
      subtitle: { text: "I'm currently taking on new work. Tell me what you're building and let's make it great together." },
      cta: { text: "Get in touch", href: "#contact" }, "cta-2": { text: "View my work", href: "#work" },
      note: { text: "Usually replies within a day" },
    };
    case "contact": return {
      eyebrow: { text: "Contact" }, heading: { text: "Let's work together" },
      subtitle: { text: "Tell me a little about your project and I'll get back to you soon." },
      "field-3": { label: "Company (optional)" }, "field-4": { label: "Budget (optional)" },
      submit: { text: "Send message" },
      "info-1": { label: "Email", value: emailOf(name) }, "info-2": { label: "Based in", value: "Available worldwide · remote friendly" },
      "info-3": { label: "Availability", value: "Taking new projects" }, "info-4": { label: "Response time", value: "Within 1–2 days" },
    };
    default: return null;
  }
}

// Applies portfolio copy to a freshly created section node (mutates and returns it).
export function applyPortfolioCopy(node, owner = DEFAULT_OWNER) {
  const copy = copyFor(node.type, node.kind, { name: owner.name || DEFAULT_OWNER.name, role: owner.role || DEFAULT_OWNER.role });
  if (!copy) return node;
  for (const e of node.elements || []) {
    const patch = copy[e.id];
    if (!patch) continue;
    for (const [k, v] of Object.entries(patch)) if (k in e.props || k === "href") e.props[k] = v;
  }
  return node;
}

// The starter portfolio: [section type, variation, section name]. Names give the #anchors the copy links to.
export const PORTFOLIO_STARTER = [
  ["nav-minimal", null, "Menu"],
  ["spotlight-hero", "split", "Home"],
  ["portfolio", null, "Work"],
  ["about", null, "About"],
  ["services", null, "Services"],
  ["testimonials", null, "Testimonials"],
  ["contact", null, "Contact"],
  ["footer-minimal", null, "Footer"],
];
