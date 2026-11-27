import { hideField } from "../../../registry/fieldGroups.js";
import { el, header, textFields, shellFields, shellDefaults, gridFields, cardFields, cardDefaults, variantField, defineSection, responsive, ICON_OPTIONS, IMG, btnEl, buttonFields } from "../shared/kit.js";

const service = (n, icon, image, title, text) => el({
  id: `service-${n}`, type: "service", label: `Service ${n}`,
  props: { icon, imageUrl: IMG(image, 900), title, text, href: `#service-${n}`, linkLabel: "Learn more", tag: "", hidden: false },
});

export default defineSection({
  id: "services", name: "Services", library: "Services",
  description: "Present what you offer as cards, an editorial list or image cards.",
  tags: ["services", "agency", "offer", "consulting", "list"],
  choreoTypes: ["service"],
  defaults: {
    props: shellDefaults({ ...cardDefaults({ cardPadding: "$card-pad" }), variant: "grid", columns: 3, gap: "$gap", iconStyle: "soft", iconColor: "$primary", numbered: true, imageRatio: "4/3", headerAlign: "left" }),
    responsive: responsive({ columns: 2 }, { columns: 1 }),
    elements: [
      ...header({ eyebrow: "What we do", heading: "Services built around your goals", subtitle: "From first sketch to launch and beyond — a senior team that plugs straight into yours." }),
      service(1, "palette", "1558655146-9f40138edfeb", "Brand & identity", "Positioning, naming and visual systems that make you instantly recognisable."),
      service(2, "monitor", "1460925895917-afdab827c52f", "Product design", "Research-led UX and interfaces your customers will genuinely enjoy using."),
      service(3, "code", "1487958449943-2429e8be8625", "Web development", "Fast, accessible websites and apps engineered to scale with you."),
      service(4, "trending", "1497366216548-37526070297c", "Growth & marketing", "Campaigns, content and experiments that turn attention into revenue."),
      { ...btnEl("cta", "Button", { text: "Start a project", arrow: true }), visible: false },
    ],
  },
  variations: {
    grid: { label: "Service card grid", props: { variant: "grid", columns: 2, cardBg: "$surface", cardBorderWidth: "$card-border", cardHover: "lift" } },
    list: { label: "Horizontal service list", description: "Editorial rows with numbers and arrows.", props: { variant: "list", numbered: true, cardHover: "none" } },
    images: { label: "Image service cards", props: { variant: "images", columns: 4, cardBg: "$background", cardBorderWidth: 0, cardPadding: 0, cardHover: "none" } },
  },
  elementTemplates: { service: { label: "Service", element: { ...service(1, "sparkles", "1497366216548-37526070297c", "New service", "Describe the service in a sentence."), id: "tmp" } } },
  editableProperties: [
    variantField([{ value: "grid", label: "Card grid" }, { value: "list", label: "Horizontal list" }, { value: "images", label: "Image cards" }]),
    ...gridFields(),
    { key: "numbered", label: "Show numbers", type: "toggle", group: "Layout" },
    { key: "imageRatio", label: "Image ratio", type: "select", options: ["1/1", "4/3", "3/4", "4/5", "16/9"].map((r) => ({ value: r, label: r.replace("/", ":") })), group: "Layout", showIf: (p) => p.variant === "images" },
    { key: "iconStyle", label: "Icon style", type: "segmented", options: [{ value: "soft", label: "Soft" }, { value: "solid", label: "Solid" }, { value: "outline", label: "Outline" }, { value: "none", label: "None" }], group: "Icons" },
    { key: "iconColor", label: "Icon color", type: "color", tokens: true, group: "Icons" },
    ...cardFields(), ...shellFields(),
  ],
  elementSchemas: {
    service: [
      { key: "title", label: "Title", type: "text", group: "Content" },
      { key: "text", label: "Description", type: "textarea", group: "Content" },
      { key: "tag", label: "Tag (e.g. From $2k)", type: "text", group: "Content" },
      { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, group: "Media" },
      { key: "imageUrl", label: "Image (image cards)", type: "image", group: "Media" },
      { key: "linkLabel", label: "Link label", type: "text", group: "Link" },
      { key: "href", label: "Service link", type: "link", group: "Link" },
      hideField(),
    ],
    meta: textFields({ max: 30, multiline: false }), heading: textFields({ max: 120 }), text: textFields({ max: 30 }),
    button: buttonFields(),
  },
});
