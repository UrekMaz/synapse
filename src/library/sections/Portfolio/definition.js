import { hideField } from "../../../registry/fieldGroups.js";
import { el, header, textFields, shellFields, shellDefaults, gridFields, variantField, defineSection, responsive, IMG, btnEl, buttonFields } from "../shared/kit.js";

const project = (n, img, title, category, text) => el({
  id: `project-${n}`, type: "project", label: `Project · ${title}`,
  props: { imageUrl: IMG(img, 1200), title, category, text, href: `#project-${n}`, focalX: 50, focalY: 50, hidden: false },
});

export default defineSection({
  id: "portfolio", name: "Portfolio", library: "Portfolio",
  description: "Show your best work — clean grid, masonry or a featured case study, with category filters.",
  tags: ["portfolio", "projects", "gallery", "case studies", "work", "masonry"],
  choreoTypes: ["project"],
  defaults: {
    props: shellDefaults({ variant: "grid", columns: 3, gap: 24, imageRatio: "4/3", radius: 18, info: "below", hover: "zoom", filter: true, headerAlign: "left" }),
    responsive: responsive({ columns: 2 }, { columns: 1, gap: 18 }),
    elements: [
      ...header({ eyebrow: "Selected work", heading: "Projects we're proud of", subtitle: null }),
      project(1, "1600585154340-be6161a56a0c", "Casa Lumière", "Architecture", "A light-filled family home on the Portuguese coast."),
      project(2, "1558655146-9f40138edfeb", "Field Notes", "Branding", "Identity and packaging for an independent stationery label."),
      project(3, "1460925895917-afdab827c52f", "Pulse Analytics", "Product", "A real-time analytics platform used by 4,000 teams."),
      project(4, "1618005182384-a83a8bd57fbe", "Chromatic", "Art direction", "A generative campaign for a design festival."),
      project(5, "1497366216548-37526070297c", "Studio North", "Interiors", "Workspace for a 60-person creative agency."),
      project(6, "1487958449943-2429e8be8625", "Kōbo Store", "Product", "Headless e-commerce with a 2.1s faster checkout."),
      { ...btnEl("cta", "Button", { text: "View all projects", arrow: true, variant: "outline", bgColor: "", textColor: "$text", borderColor: "$border" }), visible: true },
    ],
  },
  variations: {
    grid: { label: "Project image grid", props: { variant: "grid", columns: 3, imageRatio: "4/3", info: "below" } },
    masonry: { label: "Masonry layout", description: "Staggered heights, info on hover.", props: { variant: "masonry", columns: 3, info: "overlay" } },
    featured: { label: "Featured project layout", description: "One large case study, the rest in a grid.", props: { variant: "featured", columns: 2, imageRatio: "4/3", info: "below" } },
  },
  elementTemplates: { project: { label: "Project", element: project("tmp", "1511818966892-d7d671e672a2", "New project", "Category", "One line about the project.") } },
  editableProperties: [
    variantField([{ value: "grid", label: "Image grid" }, { value: "masonry", label: "Masonry" }, { value: "featured", label: "Featured project" }]),
    ...gridFields(),
    { key: "imageRatio", label: "Image ratio", type: "select", options: ["1/1", "4/3", "3/2", "16/9", "4/5", "3/4"].map((r) => ({ value: r, label: r.replace("/", ":") })), responsive: true, group: "Images", showIf: (p) => p.variant !== "masonry" },
    { key: "radius", label: "Corner radius", type: "range", min: 0, max: 40, step: 1, unit: "px", group: "Images" },
    { key: "info", label: "Project info", type: "segmented", options: [{ value: "below", label: "Below" }, { value: "overlay", label: "On hover" }], group: "Images" },
    { key: "hover", label: "Hover effect", type: "segmented", options: [{ value: "zoom", label: "Zoom" }, { value: "lift", label: "Lift" }, { value: "none", label: "None" }], group: "Images" },
    { key: "filter", label: "Category filter", type: "toggle", group: "Filtering" },
    ...shellFields(),
  ],
  elementSchemas: {
    project: [
      { key: "imageUrl", label: "Project image", type: "image", group: "Content" },
      { key: "title", label: "Project name", type: "text", group: "Content" },
      { key: "category", label: "Category", type: "text", group: "Content" },
      { key: "text", label: "Description", type: "textarea", group: "Content" },
      { key: "href", label: "Project URL", type: "link", group: "Content" },
      { key: "focalX", label: "Crop focus X", type: "range", min: 0, max: 100, step: 1, unit: "%", group: "Crop" },
      { key: "focalY", label: "Crop focus Y", type: "range", min: 0, max: 100, step: 1, unit: "%", group: "Crop" },
      hideField(),
    ],
    meta: textFields({ max: 30, multiline: false }), heading: textFields({ max: 120 }), text: textFields({ max: 30 }),
    button: buttonFields(),
  },
});
