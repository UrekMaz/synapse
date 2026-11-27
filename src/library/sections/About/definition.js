import { hideField } from "../../../registry/fieldGroups.js";
import { el, header, textFields, shellFields, shellDefaults, variantField, defineSection, responsive, mediaEl, mediaFields, IMG, btnEl, secondaryBtn, buttonFields } from "../shared/kit.js";

const fact = (n, value, label) => el({ id: `fact-${n}`, type: "fact", label: `Fact ${n}`, props: { value, label, hidden: false } });

export default defineSection({
  id: "about", name: "About Us", library: "About",
  description: "Tell your story with an image, a few key facts and a call to action.",
  tags: ["about", "story", "company", "mission", "studio"],
  choreoTypes: ["media", "fact"],
  defaults: {
    props: shellDefaults({ variant: "image-left", split: 50, verticalAlign: "center", factColor: "$text", factDivider: true }),
    responsive: responsive(),
    elements: [
      ...header({
        eyebrow: "About us", heading: "We build calm, beautiful software for ambitious teams",
        subtitle: "Founded in 2014, we're a small, senior team of designers and engineers. We believe great products come from sweating the details, shipping often and listening to the people who use them every day.",
      }).map((e) => (e.id === "subtitle" ? { ...e, props: { ...e.props, maxWidth: 560 } } : e)),
      mediaEl("media", "Image", { imageUrl: IMG("1522071820081-009f0129c71c"), ratio: "4/5", radius: 28, shadow: 0.4, hoverZoom: true }, { mobile: { ratio: "4/3" } }),
      fact(1, "2014", "Founded"), fact(2, "48", "People across 9 countries"), fact(3, "1,200+", "Teams on board"),
      btnEl("cta", "Primary button", { text: "Our story", arrow: true }),
      secondaryBtn("cta-2", "Secondary button", { text: "Meet the team" }),
    ],
  },
  variations: {
    "image-left": { label: "Image left, text right", props: { variant: "image-left", headerAlign: "left" } },
    "image-right": { label: "Text left, image right", props: { variant: "image-right", headerAlign: "left" } },
    editorial: { label: "Centered editorial", description: "Large centred statement with a wide image below.", props: { variant: "editorial", headerAlign: "center" } },
  },
  elementTemplates: { fact: { label: "Fact", element: fact("tmp", "99%", "New fact") } },
  editableProperties: [
    variantField([{ value: "image-left", label: "Image left" }, { value: "image-right", label: "Image right" }, { value: "editorial", label: "Centered editorial" }]),
    { key: "split", label: "Image column width", type: "range", min: 30, max: 70, step: 1, unit: "%", group: "Layout", showIf: (p) => p.variant !== "editorial" },
    { key: "verticalAlign", label: "Vertical alignment", type: "segmented", options: [{ value: "start", label: "Top" }, { value: "center", label: "Center" }, { value: "end", label: "Bottom" }], group: "Layout", showIf: (p) => p.variant !== "editorial" },
    { key: "factColor", label: "Fact number color", type: "color", tokens: true, group: "Facts" },
    { key: "factDivider", label: "Dividers between facts", type: "toggle", group: "Facts" },
    ...shellFields(),
  ],
  elementSchemas: {
    fact: [{ key: "value", label: "Value", type: "text", group: "Content" }, { key: "label", label: "Label", type: "text", group: "Content" }, hideField()],
    media: mediaFields(),
    meta: textFields({ max: 30, multiline: false }), heading: textFields({ max: 120 }), text: textFields({ max: 30 }),
    button: buttonFields(),
  },
});
