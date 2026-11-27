import { hideField } from "../../../registry/fieldGroups.js";
import { el, header, textFields, shellFields, shellDefaults, variantField, defineSection, responsive, btnEl, buttonFields } from "../shared/kit.js";

const q = (n, question, answer, open = false) => el({ id: `faq-${n}`, type: "faq", label: `Question ${n}`, props: { question, answer, open, hidden: false } });

export default defineSection({
  id: "faq", name: "FAQ", library: "FAQ",
  description: "Answer common questions with an accessible accordion, two columns or a minimal list.",
  tags: ["faq", "questions", "accordion", "help", "support"],
  choreoTypes: ["faq"],
  defaults: {
    props: shellDefaults({ variant: "accordion", multiple: false, iconStyle: "plus", duration: 0.4, boxed: false, questionSize: 18, headerAlign: "center", maxWidth: 820 }),
    responsive: responsive(),
    elements: [
      ...header({ eyebrow: "FAQ", heading: "Questions, answered", subtitle: "Can't find what you're looking for? Our team usually replies within an hour." }),
      q(1, "Is there a free plan?", "Yes. The Starter plan is free forever for individuals and small side projects — no credit card required.", true),
      q(2, "Can I change plans later?", "Absolutely. Upgrade, downgrade or cancel at any time from your billing settings. Changes are prorated automatically."),
      q(3, "How secure is my data?", "Data is encrypted in transit and at rest, we're SOC 2 Type II certified, and you can choose the region your data lives in."),
      q(4, "Do you offer discounts for non-profits?", "Yes — registered non-profits and education teams get 50% off any paid plan. Reach out and we'll set it up."),
      q(5, "Can I import my existing content?", "We support one-click imports from the most popular tools, plus CSV and an open API for everything else."),
      q(6, "What kind of support do you offer?", "Every plan includes email support and our community. Pro adds priority support; Enterprise adds a dedicated success manager."),
      { ...btnEl("cta", "Button", { text: "Contact support", variant: "outline", bgColor: "", textColor: "$text", borderColor: "$border" }), visible: false },
    ],
  },
  variations: {
    accordion: { label: "Accordion list", props: { variant: "accordion", headerAlign: "center", boxed: false, iconStyle: "plus" } },
    twocol: { label: "Two-column FAQ", description: "Heading on the left, questions on the right.", props: { variant: "twocol", headerAlign: "left", boxed: true, iconStyle: "chevron" } },
    minimal: { label: "Minimal Q&A", description: "Everything visible — a calm two-column list.", props: { variant: "minimal", headerAlign: "left" } },
  },
  elementTemplates: { faq: { label: "Question", element: q("tmp", "New question?", "Write the answer here.") } },
  editableProperties: [
    variantField([{ value: "accordion", label: "Accordion" }, { value: "twocol", label: "Two columns" }, { value: "minimal", label: "Minimal list" }]),
    { key: "multiple", label: "Allow several open at once", type: "toggle", group: "Accordion", showIf: (p) => p.variant !== "minimal" },
    { key: "iconStyle", label: "Icon", type: "segmented", options: [{ value: "plus", label: "Plus" }, { value: "chevron", label: "Chevron" }, { value: "arrow", label: "Arrow" }], group: "Accordion", showIf: (p) => p.variant !== "minimal" },
    { key: "duration", label: "Open / close speed", type: "range", min: 0.1, max: 1.2, step: 0.05, unit: "s", group: "Accordion", showIf: (p) => p.variant !== "minimal" },
    { key: "boxed", label: "Boxed questions", type: "toggle", group: "Accordion", showIf: (p) => p.variant !== "minimal" },
    { key: "questionSize", label: "Question size", type: "range", min: 14, max: 30, step: 1, unit: "px", responsive: true, group: "Accordion" },
    { key: "maxWidth", label: "List width", type: "range", min: 480, max: 1200, step: 10, unit: "px", group: "Accordion", showIf: (p) => p.variant === "accordion" },
    ...shellFields(),
  ],
  elementSchemas: {
    faq: [
      { key: "question", label: "Question", type: "text", group: "Content" },
      { key: "answer", label: "Answer", type: "textarea", group: "Content" },
      { key: "open", label: "Open by default", type: "toggle", group: "Content" },
      hideField(),
    ],
    meta: textFields({ max: 30, multiline: false }), heading: textFields({ max: 120 }), text: textFields({ max: 30 }),
    button: buttonFields(),
  },
});
