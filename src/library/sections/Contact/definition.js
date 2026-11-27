import { hideField } from "../../../registry/fieldGroups.js";
import { el, header, textFields, shellFields, shellDefaults, variantField, defineSection, responsive, ICON_OPTIONS, SOCIAL_LIST } from "../shared/kit.js";

const field = (n, props) => el({ id: `field-${n}`, type: "field", label: `Field · ${props.label}`, props: { label: "", name: `field${n}`, kind: "text", placeholder: "", required: false, options: [], width: "full", hidden: false, ...props } });
const info = (n, icon, label, value, href) => el({ id: `info-${n}`, type: "info", label: `Info · ${label}`, props: { icon, label, value, href, hidden: false } });

export default defineSection({
  id: "contact", name: "Contact", library: "Contact",
  description: "A validated contact form with contact details, centred or beside a map.",
  tags: ["contact", "form", "email", "map", "address", "support"],
  choreoTypes: ["field", "info", "map"],
  defaults: {
    props: shellDefaults({
      variant: "panel", endpoint: "", recipient: "hello@northwind.co", subject: "New message from the website", successMessage: "Thanks — we'll get back to you within one business day.",
      fieldStyle: "outline", fieldRadius: "$input-radius", panelBg: "$secondary", panelText: "#ffffff", headerAlign: "left",
    }),
    responsive: responsive(),
    elements: [
      ...header({ eyebrow: "Contact", heading: "Let's talk about your project", subtitle: "Tell us a little about what you're working on and we'll reply within one business day." }),
      field(1, { label: "Full name", name: "name", placeholder: "Jane Cooper", required: true, width: "half" }),
      field(2, { label: "Email", name: "email", kind: "email", placeholder: "jane@company.com", required: true, width: "half" }),
      field(3, { label: "Company", name: "company", placeholder: "Company name", width: "half" }),
      field(4, { label: "Budget", name: "budget", kind: "select", width: "half", options: [{ label: "Under $10k" }, { label: "$10k – $50k" }, { label: "$50k – $100k" }, { label: "$100k+" }] }),
      field(5, { label: "Message", name: "message", kind: "textarea", placeholder: "What are you hoping to build?", required: true }),
      el({ id: "submit", type: "submit", label: "Submit button", props: { text: "Send message", fullWidth: false, hidden: false } }),
      info(1, "mail", "Email", "hello@northwind.co", "mailto:hello@northwind.co"),
      info(2, "phone", "Phone", "+1 (415) 555-0132", "tel:+14155550132"),
      info(3, "pin", "Studio", "120 Market Street, San Francisco, CA", "https://maps.google.com/?q=120+Market+Street+San+Francisco"),
      info(4, "clock", "Hours", "Mon – Fri, 9am – 6pm PT", ""),
      el({ id: "social", type: "social", label: "Social links", props: { items: [{ network: "x", url: "#" }, { network: "linkedin", url: "#" }, { network: "instagram", url: "#" }], hidden: false } }),
      el({ id: "map", type: "map", label: "Map", props: { embedUrl: "", address: "120 Market Street, San Francisco", height: 520, hidden: false } }),
    ],
  },
  variations: {
    panel: { label: "Form with information panel", props: { variant: "panel", headerAlign: "left" } },
    centered: { label: "Centered contact form", props: { variant: "centered", headerAlign: "center" } },
    map: { label: "Split form & map", description: "Form beside a map (embed or styled placeholder).", props: { variant: "map", headerAlign: "left" } },
  },
  elementTemplates: {
    field: { label: "Form field", element: field("tmp", { label: "New field", name: "new_field", placeholder: "" }) },
    info: { label: "Contact detail", element: info("tmp", "globe", "Website", "northwind.co", "https://northwind.co") },
  },
  editableProperties: [
    variantField([{ value: "panel", label: "Form + info panel" }, { value: "centered", label: "Centered form" }, { value: "map", label: "Form + map" }]),
    { key: "endpoint", label: "Form endpoint URL (POST, e.g. Formspree)", type: "text", group: "Submission" },
    { key: "recipient", label: "Fallback email (opens visitor's email app)", type: "text", group: "Submission" },
    { key: "subject", label: "Email subject", type: "text", group: "Submission" },
    { key: "successMessage", label: "Success message", type: "textarea", group: "Submission" },
    { key: "fieldStyle", label: "Field style", type: "segmented", options: [{ value: "outline", label: "Outline" }, { value: "filled", label: "Filled" }, { value: "underline", label: "Underline" }], group: "Form" },
    { key: "fieldRadius", label: "Field radius", type: "range", min: 0, max: 24, step: 1, unit: "px", token: [{ value: "$input-radius", label: "Input radius" }], group: "Form" },
    { key: "panelBg", label: "Info panel background", type: "color", tokens: true, group: "Form", showIf: (p) => p.variant === "panel" },
    { key: "panelText", label: "Info panel text", type: "color", tokens: true, group: "Form", showIf: (p) => p.variant === "panel" },
    ...shellFields(),
  ],
  elementSchemas: {
    field: [
      { key: "label", label: "Label", type: "text", group: "Field" },
      { key: "kind", label: "Type", type: "select", options: [{ value: "text", label: "Text" }, { value: "email", label: "Email" }, { value: "tel", label: "Phone" }, { value: "textarea", label: "Long text" }, { value: "select", label: "Dropdown" }], group: "Field" },
      { key: "placeholder", label: "Placeholder", type: "text", group: "Field", showIf: (p) => p.kind !== "select" },
      { key: "name", label: "Field name (sent with the form)", type: "text", group: "Field" },
      { key: "required", label: "Required", type: "toggle", group: "Field" },
      { key: "width", label: "Width", type: "segmented", options: [{ value: "full", label: "Full" }, { value: "half", label: "Half" }], group: "Field" },
      { key: "options", label: "Options", type: "list", itemLabel: "Option", itemFields: [{ key: "label", label: "Option", type: "text" }], newItem: { label: "New option" }, group: "Field", showIf: (p) => p.kind === "select" },
      hideField(),
    ],
    submit: [{ key: "text", label: "Button text", type: "text", group: "Button" }, { key: "fullWidth", label: "Full width", type: "toggle", group: "Button" }],
    info: [
      { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, group: "Detail" },
      { key: "label", label: "Label", type: "text", group: "Detail" },
      { key: "value", label: "Value", type: "text", group: "Detail" },
      { key: "href", label: "Link (mailto:, tel:, https:)", type: "link", group: "Detail" },
      hideField(),
    ],
    social: [{ key: "items", label: "Social links", ...SOCIAL_LIST, group: "Social" }, hideField()],
    map: [
      { key: "embedUrl", label: "Map embed URL (https, e.g. Google Maps embed)", type: "text", group: "Map" },
      { key: "address", label: "Address label", type: "text", group: "Map" },
      { key: "height", label: "Height", type: "range", min: 240, max: 900, step: 10, unit: "px", responsive: true, group: "Map" },
      hideField(),
    ],
    meta: textFields({ max: 30, multiline: false }), heading: textFields({ max: 120 }), text: textFields({ max: 30 }),
  },
});
