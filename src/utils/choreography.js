const BASE = { trigger: "page-load", duration: 0.8, delay: 0, easing: "ease-out", split: "none" };

// byType: { "heading-line": [entry0, entry1, ...] }. Later entries inherit earlier ones.
export function choreoEntry(byType, type, index) {
  const arr = byType[type];
  if (!arr?.length) return null;
  let acc = {};
  for (let i = 0; i <= Math.min(index, arr.length - 1); i++) acc = { ...acc, ...arr[i] };
  if (index > arr.length - 1) acc.delay = +((acc.delay ?? 0) + 0.2 * (index - (arr.length - 1))).toFixed(2);
  return { ...BASE, ...acc };
}

export function applyChoreographyData(node, choreo) {
  const counts = {};
  node.elements.forEach((el) => {
    const i = counts[el.type] ?? 0;
    counts[el.type] = i + 1;
    const entry = choreoEntry(choreo.byType, el.type, i);
    if (entry) el.animation = entry;
  });
}