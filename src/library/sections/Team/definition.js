import { hideField } from "../../../registry/fieldGroups.js";
import { el, header, textFields, shellFields, shellDefaults, gridFields, cardFields, cardDefaults, variantField, defineSection, responsive, IMG, SOCIAL_LIST } from "../shared/kit.js";

const member = (n, name, role, img, bio) => el({
  id: `member-${n}`, type: "member", label: `Member · ${name}`,
  props: { name, role, bio, imageUrl: IMG(img, 700), socials: [{ network: "linkedin", url: "#" }, { network: "x", url: "#" }], hidden: false },
});

export default defineSection({
  id: "team", name: "Team", library: "Team",
  description: "Introduce the people behind the work — grid, horizontal cards or a featured lead.",
  tags: ["team", "people", "about", "founders", "staff"],
  choreoTypes: ["member"],
  defaults: {
    props: shellDefaults({ ...cardDefaults({ cardPadding: 0, cardBorderWidth: 0, cardBg: "$background", cardHover: "none" }), variant: "grid", columns: 4, gap: "$gap", imageShape: "rounded", imageRatio: "4/5", imageHover: "zoom", showBio: false, background: "$background" }),
    responsive: responsive({ columns: 2 }, { columns: 1 }),
    elements: [
      ...header({ eyebrow: "Our team", heading: "The people behind the product", subtitle: "A small, senior team of designers, engineers and storytellers working from nine countries." }),
      member(1, "Maya Chen", "Co-founder & CEO", "1494790108377-be9c29b29330", "Previously led product at two YC startups. Obsessed with calm software and good coffee."),
      member(2, "Daniel Okafor", "Co-founder & CTO", "1500648767791-00dcc994a43e", "Distributed-systems nerd who has scaled platforms to millions of users."),
      member(3, "Sofia Martins", "Head of Design", "1438761681033-6461ffad8d80", "Designs interfaces that feel obvious. Formerly at an award-winning studio in Lisbon."),
      member(4, "James Lee", "Lead Engineer", "1507003211169-0a1dd7228f2d", "Ships fast and sweats performance. Runs our open-source projects."),
    ],
  },
  variations: {
    grid: { label: "Team member grid", props: { variant: "grid", columns: 4, imageShape: "rounded", showBio: false, cardPadding: 0, cardBorderWidth: 0, cardBg: "$background" } },
    horizontal: { label: "Horizontal team cards", description: "Photo beside name, role and bio.", props: { variant: "horizontal", columns: 2, imageShape: "rounded", showBio: true, cardPadding: 20, cardBorderWidth: "$card-border", cardBg: "$surface", cardHover: "lift" } },
    featured: { label: "Featured team member", description: "One large profile, the rest of the team below.", props: { variant: "featured", columns: 3, imageShape: "rounded", showBio: false, headerAlign: "left" } },
  },
  elementTemplates: { member: { label: "Team member", element: member("tmp", "New member", "Role", "1472099645785-5658abf4ff4e", "A short bio.") } },
  editableProperties: [
    variantField([{ value: "grid", label: "Grid" }, { value: "horizontal", label: "Horizontal cards" }, { value: "featured", label: "Featured member" }]),
    ...gridFields(),
    { key: "imageShape", label: "Image shape", type: "segmented", options: [{ value: "square", label: "Square" }, { value: "rounded", label: "Rounded" }, { value: "circle", label: "Circle" }], group: "Photos" },
    { key: "imageRatio", label: "Photo ratio", type: "select", options: ["1/1", "4/5", "3/4", "2/3"].map((r) => ({ value: r, label: r.replace("/", ":") })), group: "Photos", showIf: (p) => p.imageShape !== "circle" },
    { key: "imageHover", label: "Photo hover", type: "segmented", options: [{ value: "zoom", label: "Zoom" }, { value: "color", label: "B&W → color" }, { value: "none", label: "None" }], group: "Photos" },
    { key: "showBio", label: "Show bio", type: "toggle", group: "Photos" },
    ...cardFields(), ...shellFields(),
  ],
  elementSchemas: {
    member: [
      { key: "name", label: "Name", type: "text", group: "Content" },
      { key: "role", label: "Role", type: "text", group: "Content" },
      { key: "bio", label: "Description", type: "textarea", group: "Content" },
      { key: "imageUrl", label: "Profile image", type: "image", group: "Content" },
      { key: "socials", label: "Social links", ...SOCIAL_LIST, group: "Social" },
      hideField(),
    ],
    meta: textFields({ max: 30, multiline: false }), heading: textFields({ max: 120 }), text: textFields({ max: 30 }),
  },
});
