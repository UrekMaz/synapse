import { v4 as uuid } from "uuid";
import { getHero } from "../registry/heroRegistry.js";
import { choreoEntry } from "./choreography.js";
import { heroThemePatch } from "../library/heroes/shared/themeMap.js";
import { isToken } from "./tokens.js";

const clone = (v) => JSON.parse(JSON.stringify(v));
const short = (p) => `${p}-${uuid().slice(0, 6)}`;
const find = (n, id) => n.elements.find((e) => e.id === id);

// Any registered section (nav / hero / body / footer). variationId picks one of the library's design variations.
export function createHeroNode(heroId, variationId) {
  const def = getHero(heroId);
  if (!def) throw new Error(`Unknown section "${heroId}"`);
  const node = { id: short("section"), kind: def.kind || "hero", type: def.id, ...clone(def.defaults) };
  // Body sections always start in a named design (their defaults are the first one), so the inspector can mark it.
  // Signature heroes keep their own default look unless a design is asked for.
  const vid = variationId && def.variations?.[variationId] ? variationId : def.kind === "body" ? Object.keys(def.variations || {})[0] : null;
  if (vid) applyVariation(node, def.variations[vid], vid, def.variations);
  return node;
}

// All helpers mutate in place (they run inside immer drafts) and never return a value.
export function setSectionProp(n, key, value, bp, responsive) {
  if (responsive && bp !== "desktop") n.responsive[bp] = { ...(n.responsive[bp] || {}), [key]: value };
  else n.props[key] = value;
}
export function resetSectionProp(n, key, bp) {
  if (bp !== "desktop" && n.responsive[bp]) delete n.responsive[bp][key];
}
export function setElementProp(n, id, key, value, bp, responsive) {
  const e = find(n, id);
  if (!e) return;
  if (responsive && bp !== "desktop") {
    e.responsive = e.responsive || {};
    e.responsive[bp] = { ...(e.responsive[bp] || {}), [key]: value };
  } else e.props[key] = value;
}
export function resetElementProp(n, id, key, bp) {
  const e = find(n, id);
  if (e && bp !== "desktop" && e.responsive?.[bp]) delete e.responsive[bp][key];
}
export function setElementAnimation(n, id, patch) {
  const e = find(n, id);
  if (e) e.animation = { ...(e.animation || {}), ...patch };
}
export function setElementVisible(n, id, visible) {
  const e = find(n, id);
  if (e) e.visible = visible;
}
export function addElement(n, def, type) {
  const t = def.elementTemplates?.[type];
  if (!t) return null;
  const count = n.elements.filter((e) => e.type === type).length;
  const el = clone(t.element);
  el.id = short(type);
  el.label = `${t.label} ${count + 1}`;
  const choreo = def.choreographies?.[n.animationSettings?.choreography];
  if (choreo) el.animation = choreoEntry(choreo.byType, type, count);
  let at = -1;
  n.elements.forEach((e, i) => { if (e.type === type) at = i; });
  n.elements.splice(at >= 0 ? at + 1 : n.elements.length, 0, el);
  return el.id;
}
export function removeElement(n, id) {
  n.elements = n.elements.filter((e) => e.id !== id);
}
export function moveElement(n, id, dir) {
  const from = n.elements.findIndex((e) => e.id === id);
  if (from < 0) return;
  const type = n.elements[from].type;
  const same = n.elements.map((e, i) => (e.type === type ? i : -1)).filter((i) => i >= 0);
  const to = same[same.indexOf(from) + dir];
  if (to == null) return;
  const [moved] = n.elements.splice(from, 1);
  n.elements.splice(to, 0, moved);
}
/*
 * Variations are style-only patches: { props, byType: { type: patch | [patch per index] }, byId: { id: patch } }.
 * Text, links, uploaded images and positions the patch doesn't mention are left untouched.
 * A patch may carry $ifEmpty: { key: value } for values applied only when the prop is empty, and
 * $soft: { key: value } for placeholder copy, replaced only while it still matches some variation's placeholder.
 */
export function applyVariation(n, v, id, all = {}) {
  if (!v) return;
  Object.assign(n.props, v.props || {});
  const counts = {};
  n.elements.forEach((e) => {
    const i = counts[e.type] ?? 0;
    counts[e.type] = i + 1;
    const t = v.byType?.[e.type];
    const { $ifEmpty, $soft, ...patch } = { ...(Array.isArray(t) ? t[i % t.length] : t), ...(v.byId?.[e.id] || {}) };
    Object.assign(e.props, patch);
    // $ifEmpty: defaults that never overwrite something the user already set (e.g. uploaded images)
    Object.entries($ifEmpty || {}).forEach(([k, val]) => { if (!e.props[k]) e.props[k] = val; });
    Object.entries($soft || {}).forEach(([k, val]) => {
      const placeholders = Object.values(all).map((x) => { const tt = x.byType?.[e.type]; return (Array.isArray(tt) ? tt[i % tt.length] : tt)?.$soft?.[k]; });
      if (!e.props[k] || placeholders.includes(e.props[k])) e.props[k] = val;
    });
  });
  n.variation = id;
}

// Theme Studio: makes a signature hero adopt the site theme ("accent" or "full"); other sections are already linked.
export function applyHeroTheme(n, level, theme) {
  if (n.kind !== "hero") return;
  const patch = heroThemePatch(n.type, level, theme);
  if (patch) applyVariation(n, patch, n.variation);
}

// "Reset to theme defaults": every prop whose (variation-aware) default links to a token, and was overridden, links again.
export function resetThemeOverrides(n) {
  const base = createHeroNode(n.type, n.variation);
  const reset = (props, baseProps = {}) => Object.entries(baseProps).forEach(([k, v]) => { if (isToken(v) && props[k] !== v) props[k] = v; });
  reset(n.props, base.props);
  n.elements.forEach((e) => reset(e.props, base.elements.find((b) => b.id === e.id)?.props));
  delete n.themeLock;
}
