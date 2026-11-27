import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuid } from "uuid";
import { DEFAULT_DRAFT, LAYOUT_PRESETS } from "../data/layoutPresets.js";
import { createPageFromConfig, matchPreset } from "../utils/layoutUtils.js";
import { applyHeroTheme, createHeroNode, resetThemeOverrides } from "../utils/heroNode.js";
import { DEFAULT_THEME, resolveTheme } from "../utils/tokens.js";
import { applyChoreographyData } from "../utils/choreography.js";
import { DEFAULT_OWNER, PORTFOLIO_STARTER, applyPortfolioCopy, isPortfolio } from "../data/portfolio.js";

// A mood theme can carry an entrance choreography ("rise" | "fade" | "zoom" | "blur") for body sections and footers.
function applyMoodChoreo(sec, theme) {
  const key = theme.experience?.motion?.choreography;
  if (!key || sec.kind === "hero" || sec.kind === "nav") return;
  const choreo = getHero(sec.type)?.choreographies?.[key];
  if (!choreo) return;
  sec.animationSettings = { ...sec.animationSettings, choreography: key };
  applyChoreographyData(sec, choreo);
}
import { getHero } from "../registry/heroRegistry.js";
import { guessSection, isUnconnected, refersTo, slugify, walkLinks } from "../utils/links.js";

const MAX_HISTORY = 80;
let lastEdit = { key: null, at: 0 };

// Friendly, unique section names + URL anchors (stable ids never change; names / anchors are editable).
const nameFor = (node) => { const d = getHero(node.type); return d?.kind === "hero" ? "Home" : d?.name || node.type; };
function withIdentity(node, sections) {
  const others = sections.filter((x) => x.id !== node.id);
  const names = new Set(others.map((x) => x.name));
  const anchors = new Set(others.map((x) => x.anchor || x.id));
  let name = node.name || nameFor(node);
  if (names.has(name)) { let n = 2; while (names.has(`${name} ${n}`)) n++; name = `${name} ${n}`; }
  const base = slugify(node.anchor || name) || "section";
  let anchor = base;
  for (let n = 2; anchors.has(anchor); n++) anchor = `${base}-${n}`;
  return { ...node, name, anchor };
}
const uniqueSlug = (name, pages, selfId) => {
  const taken = new Set(pages.filter((p) => p.id !== selfId).map((p) => p.slug));
  const base = slugify(name) || "page";
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
};
const cloneSection = (sec) => ({ ...JSON.parse(JSON.stringify(sec)), id: `section-${uuid().slice(0, 8)}` });

const fixSelection = (s) => {
  const sec = s.page?.sections.find((x) => x.id === s.selectedId);
  if (!sec) { s.selectedId = null; s.selectedElementId = null; }
  else if (s.selectedElementId && !sec.elements?.some((e) => e.id === s.selectedElementId)) s.selectedElementId = null;
};

export const useEditorStore = create(
  persist(
    immer((set, get) => {
      // Every page edit goes through here so it is undoable. Same coalesceKey within 1s = one undo step.
      const mutatePage = (fn, coalesceKey) => {
        const before = get().page;
        if (!before) return;
        const now = Date.now();
        const merge = coalesceKey && lastEdit.key === coalesceKey && now - lastEdit.at < 1000;
        lastEdit = { key: coalesceKey || null, at: now };
        set((s) => {
          if (!merge) {
            s.past.push(before);
            if (s.past.length > MAX_HISTORY) s.past.shift();
            s.future = [];
          }
          fn(s.page);
        });
      };

      return {
        /* saved website data */
        page: null,
        pages: [], // the website's other (inactive) pages; `page` is the one being edited
        linkSettings: { behavior: "smooth", offset: 16 },
        draft: DEFAULT_DRAFT,

        /* editor UI state */
        selectedId: null,
        selectedElementId: null,
        activePanel: "layers",
        viewport: "desktop",
        zoom: 0.6,
        mode: "edit",
        showGrid: true,
        showBounds: true,
        studioHeroId: null,
        timelineOpen: false,
        playKeys: {},
        previews: {},
        dragging: false,
        libraryTarget: null,
        libraryCategory: "All",
        themeStudioOpen: false,
        customThemes: [], // saved user themes, reusable across pages and new websites
        published: null, // { slug, name, url, token, version, publishedAt } of the live site this project publishes to
        publishOpen: false,
        linkPicker: null, // runtime callback while "choose section on canvas" is active (never persisted)
        pendingDelete: null,
        past: [],
        future: [],

        /* wizard */
        selectPreset: (id) => set((s) => {
          const p = LAYOUT_PRESETS.find((x) => x.id === id);
          if (!p) return;
          s.draft.presetId = id; s.draft.width = p.width; s.draft.composition = p.composition;
        }),
        patchDraft: (patch) => set((s) => {
          Object.assign(s.draft, patch);
          s.draft.presetId = matchPreset(s.draft.width, s.draft.composition)?.id ?? "custom";
        }),
        resetDraft: () => set((s) => { s.draft = DEFAULT_DRAFT; }),
        createPage: () => set((s) => {
          const d = s.draft;
          const siteType = d.siteType || "portfolio";
          const owner = { name: d.ownerName?.trim() || DEFAULT_OWNER.name, role: d.ownerRole?.trim() || DEFAULT_OWNER.role };
          s.page = { ...createPageFromConfig(d), theme: structuredClone(DEFAULT_THEME), slug: "", home: true, siteType, owner };
          if (siteType === "portfolio") {
            if (!d.name || d.name === "Untitled Page") s.page.name = "Home";
            // A ready-made portfolio: menu, intro, work, about, services, kind words, contact, footer.
            const sections = [];
            for (const [type, variation, name] of PORTFOLIO_STARTER) {
              if (!getHero(type)) continue;
              sections.push(withIdentity(applyPortfolioCopy({ ...createHeroNode(type, variation), name }, owner), sections));
            }
            s.page.sections = sections;
          }
          s.published = null; // a new website gets its own address
          s.pages = [];
          s.selectedId = null; s.selectedElementId = null;
          s.viewport = "desktop"; s.mode = "edit";
          s.past = []; s.future = []; s.playKeys = {}; s.previews = {};
        }),

        /* page */
        renamePage: (name) => mutatePage((p) => { p.name = name; }, "rename"),
        updateLayout: (patch) => mutatePage((p) => {
          Object.assign(p.layout, patch);
          if ("columns" in patch) p.responsive.desktop.columns = patch.columns;
          if ("sideMargin" in patch) p.responsive.desktop.sideMargin = patch.sideMargin;
        }, "layout"),
        updateResponsive: (vp, patch) => mutatePage((p) => { Object.assign(p.responsive[vp], patch); }, "responsive"),

        /* sections */
        addSection: (input, index) => {
          const node = withIdentity(input, get().page.sections);
          mutatePage((p) => {
            const i = index == null ? p.sections.length : index;
            p.sections.splice(i, 0, node);
          });
          set((s) => { s.selectedId = node.id; s.selectedElementId = null; });
        },
        addHero: (heroId) => get().addFromLibrary(heroId),
        /*
         * Library insert. Honours a pending target (replace a section / insert below one); otherwise navbars go to the top,
         * footers to the bottom and everything else just above the footer (or after the selected section).
         */
        placeSection: (node) => {
          const { page, libraryTarget, selectedId } = get();
          const secs = page.sections;
          const at = (id) => secs.findIndex((x) => x.id === id);
          if (libraryTarget?.mode === "replace" && at(libraryTarget.id) >= 0) {
            const i = at(libraryTarget.id);
            // Replacing keeps the old section's id, name and anchor so every link to it keeps working.
            const old = secs[i];
            mutatePage((p) => { p.sections[i] = { ...node, id: old.id, name: old.name || nameFor(old), anchor: old.anchor || old.id, region: old.region }; });
            set((s) => { s.selectedId = old.id; s.selectedElementId = null; s.libraryTarget = null; });
            return;
          }
          let index;
          if (libraryTarget?.mode === "after" && at(libraryTarget.id) >= 0) index = at(libraryTarget.id) + 1;
          else if (node.kind === "nav") index = secs.filter((x) => x.kind === "nav").length;
          else if (node.kind === "footer") index = secs.length;
          else {
            const footer = secs.findIndex((x) => x.kind === "footer");
            const sel = at(selectedId);
            index = sel >= 0 && secs[sel].kind !== "footer" ? sel + 1 : footer >= 0 ? footer : secs.length;
          }
          const ref = secs[index] || secs[index - 1];
          get().addSection(ref?.region ? { ...node, region: ref.region } : node, index);
          set((s) => { s.libraryTarget = null; });
        },
        addFromLibrary: (defId, variationId) => get().placeSection(get().withSiteCopy(createHeroNode(defId, variationId))),
        // Portfolio projects get portfolio copy (with the owner's name) in every section they add.
        withSiteCopy: (node) => (isPortfolio(get().page) ? applyPortfolioCopy(node, get().page?.owner) : node),
        setSiteType: (siteType) => mutatePage((p) => { p.siteType = siteType; }),
        openLibrary: (target = null, category = null) => set((s) => { s.libraryTarget = target; s.activePanel = "sections"; if (category) s.libraryCategory = category; }),
        // The theme is site-wide: every page gets the same values.
        updateTheme: (group, key, value) => {
          const apply = (p) => { p.theme = p.theme || structuredClone(DEFAULT_THEME); p.theme[group] = { ...(p.theme[group] || {}), [key]: value }; };
          mutatePage(apply, `theme:${group}:${key}`);
          set((s) => { s.pages.forEach(apply); });
        },
        setTheme: (theme) => {
          mutatePage((p) => { p.theme = structuredClone(theme); });
          set((s) => { s.pages.forEach((p) => { p.theme = structuredClone(theme); }); });
        },
        resetTheme: () => get().setTheme(DEFAULT_THEME),
        /*
         * Theme Studio apply.
         *   scope "site": the whole website follows the theme (sections that opted out keep their snapshot)
         *   scope "sections": only the given sections adopt it (they get a locked snapshot)
         *   scope "new": existing sections keep today's look (locked snapshot); new sections get the new theme
         * heroLevel ("none" | "accent" | "full") decides how much the signature heroes adopt.
         */
        applyThemeToSite: (input, { scope = "site", heroLevel = "accent", sectionIds = [] } = {}) => {
          const theme = structuredClone(input);
          const { page } = get();
          const current = resolveTheme(page.theme);
          const each = (fn) => { mutatePage((p) => p.sections.forEach((sec) => fn(sec, p))); set((st) => { st.pages.forEach((p) => p.sections.forEach((sec) => fn(sec, p))); }); };
          if (scope === "sections") {
            mutatePage((p) => p.sections.forEach((sec) => {
              if (!sectionIds.includes(sec.id)) return;
              sec.themeLock = theme;
              applyHeroTheme(sec, heroLevel, theme);
              applyMoodChoreo(sec, theme);
            }));
            return;
          }
          if (scope === "new") each((sec) => { if (!sec.themeLock) sec.themeLock = structuredClone(current); });
          else each((sec) => { if (!sec.themeLock) { applyHeroTheme(sec, heroLevel, theme); applyMoodChoreo(sec, theme); } });
          get().setTheme(theme);
        },
        // Removes every override that hides a theme token (and every section opt-out), on every page.
        resetToThemeDefaults: () => {
          mutatePage((p) => p.sections.forEach(resetThemeOverrides));
          set((st) => { st.pages.forEach((p) => p.sections.forEach(resetThemeOverrides)); });
        },
        setSectionMotifs: (id, hidden) => mutatePage((p) => {
          const sec = p.sections.find((x) => x.id === id);
          if (!sec) return;
          if (hidden) sec.hideMotifs = true; else delete sec.hideMotifs;
        }),
        // Edits the site theme's mood layer (motifs, materials, motion, sound) on every page.
        updateExperience: (recipe, key = "experience") => {
          const apply = (p) => { p.theme = p.theme || structuredClone(DEFAULT_THEME); p.theme.experience = p.theme.experience || {}; recipe(p.theme.experience); };
          mutatePage(apply, key);
          set((st) => { st.pages.forEach(apply); });
        },
        lockSectionTheme: (id, locked) => mutatePage((p) => {
          const sec = p.sections.find((x) => x.id === id);
          if (!sec) return;
          if (locked) sec.themeLock = structuredClone(resolveTheme(p.theme));
          else delete sec.themeLock;
        }),
        saveCustomTheme: (theme) => set((st) => {
          const i = st.customThemes.findIndex((t) => t.id === theme.id);
          const t = structuredClone({ ...theme, collection: "Custom" });
          if (i >= 0) st.customThemes[i] = t; else st.customThemes.push(t);
        }),
        deleteCustomTheme: (id) => set((st) => { st.customThemes = st.customThemes.filter((t) => t.id !== id); }),
        setPublished: (info) => set((s) => { s.published = info; }),
        setLinkSettings: (patch) => set((s) => { Object.assign(s.linkSettings, patch); }),
        // Drag & drop: `index` is the position in the flat sections array, `region` the layout region dropped into.
        insertSection: (node, region, index) => get().addSection({ ...get().withSiteCopy(node), region }, index),
        moveSectionTo: (id, region, index) => {
          mutatePage((p) => {
            const from = p.sections.findIndex((x) => x.id === id);
            if (from < 0) return;
            const [m] = p.sections.splice(from, 1);
            m.region = region;
            p.sections.splice(from < index ? index - 1 : index, 0, m);
          });
          set((s) => { s.selectedId = id; s.selectedElementId = null; });
        },
        editSection: (id, fn, key) => mutatePage((p) => {
          const n = p.sections.find((x) => x.id === id);
          if (n) fn(n);
        }, key && `${id}:${key}`),
        /*
         * Drag-to-resize. Desktop edits the base value; tablet / mobile edit that device's override.
         * A value of undefined / null resets (desktop: back to the design default and no device overrides).
         */
        resizeElement: (sectionId, elId, patch, bp = "desktop") => get().editSection(sectionId, (n) => {
          const e = n.elements.find((x) => x.id === elId);
          if (!e) return;
          for (const [k, v] of Object.entries(patch)) {
            if (bp === "desktop") {
              if (v == null) { delete e.props[k]; Object.values(e.responsive || {}).forEach((o) => { if (o) delete o[k]; }); } else e.props[k] = v;
            } else {
              e.responsive = e.responsive || {};
              e.responsive[bp] = { ...(e.responsive[bp] || {}) };
              if (v == null) delete e.responsive[bp][k]; else e.responsive[bp][k] = v;
            }
          }
        }, `resize:${elId}:${bp}`),
        resizeSection: (id, patch, bp = "desktop") => get().editSection(id, (n) => {
          const defaults = getHero(n.type)?.defaults || {};
          for (const [k, v] of Object.entries(patch)) {
            if (bp === "desktop") {
              if (v == null) {
                if (defaults.props && k in defaults.props) n.props[k] = defaults.props[k]; else delete n.props[k];
                Object.values(n.responsive || {}).forEach((o) => { if (o) delete o[k]; });
              } else n.props[k] = v;
            } else {
              n.responsive = n.responsive || {};
              n.responsive[bp] = { ...(n.responsive[bp] || {}) };
              if (v == null) { delete n.responsive[bp][k]; if (defaults.responsive?.[bp] && k in defaults.responsive[bp]) n.responsive[bp][k] = defaults.responsive[bp][k]; }
              else n.responsive[bp][k] = v;
            }
          }
        }, `resize-section:${bp}`),
        duplicateSection: (id) => {
          const src = get().page.sections.find((x) => x.id === id);
          if (!src) return;
          const copy = withIdentity({ ...cloneSection(src), name: `${src.name || nameFor(src)} copy`, anchor: null }, get().page.sections);
          const idx = get().page.sections.findIndex((x) => x.id === id);
          mutatePage((p) => { p.sections.splice(idx + 1, 0, copy); });
          set((s) => { s.selectedId = copy.id; s.selectedElementId = null; });
        },
        renameSection: (id, name) => mutatePage((p) => { const n = p.sections.find((x) => x.id === id); if (n) n.name = name; }, `name:${id}`),
        setSectionAnchor: (id, anchor) => mutatePage((p) => {
          const n = p.sections.find((x) => x.id === id);
          if (n) n.anchor = withIdentity({ ...n, anchor: slugify(anchor) || n.id }, p.sections).anchor;
        }, `anchor:${id}`),
        // Every link (on any page) that points at a section.
        linkRefs: (sectionId) => {
          const { page, pages } = get();
          const out = [];
          [page, ...pages].forEach((pg) => walkLinks(pg.sections, (v, info) => {
            if (refersTo(v, sectionId)) out.push({ pageId: pg.id, pageName: pg.name, sectionId: info.section.id, sectionName: info.section.name || nameFor(info.section), elementId: info.element.id, label: info.label });
          }));
          return out;
        },
        // Connects every unconnected link whose label matches a section ("About" → About Us, "Pricing" → Pricing…). Returns the count.
        autoConnectLinks: () => {
          let count = 0;
          mutatePage((p) => {
            const named = p.sections.map((x) => ({ ...x, name: x.name || nameFor(x) }));
            const anchors = p.sections.map((x) => x.anchor || x.id);
            walkLinks(p.sections, (v, info) => {
              if (!isUnconnected(v, anchors)) return;
              const hit = guessSection(info.label, named.filter((x) => x.id !== info.section.id));
              if (hit) { info.set({ type: "section", sectionId: hit.id, scroll: "inherit" }); count++; }
            });
          });
          return count;
        },
        // Deleting a section that links point to asks first (redirect or unlink) and never silently breaks links.
        requestDelete: (id) => {
          const refs = get().linkRefs(id);
          if (refs.length) set((s) => { s.pendingDelete = { id, refs }; });
          else get().deleteSection(id);
        },
        resolveDelete: (redirectTo) => {
          const { pendingDelete } = get();
          if (!pendingDelete) return;
          const fix = (sections) => walkLinks(sections, (v, info) => {
            if (!refersTo(v, pendingDelete.id)) return;
            info.set(redirectTo ? { ...v, sectionId: redirectTo, pageId: v.pageId || undefined } : { type: "none" });
          });
          mutatePage((p) => { fix(p.sections); });
          set((s) => { s.pages.forEach((pg) => fix(pg.sections)); s.pendingDelete = null; });
          get().deleteSection(pendingDelete.id);
        },
        deleteSection: (id) => {
          mutatePage((p) => { p.sections = p.sections.filter((x) => x.id !== id); });
          set((s) => { if (s.selectedId === id) { s.selectedId = null; s.selectedElementId = null; } });
        },

        /* pages */
        allPages: () => { const { page, pages } = get(); return [page, ...pages].filter(Boolean).sort((a, b) => (b.home - a.home) || (a.order ?? 0) - (b.order ?? 0)); },
        switchPage: (id) => set((s) => {
          if (!s.page || s.page.id === id) return;
          const target = s.pages.find((p) => p.id === id);
          if (!target) return;
          s.pages = [...s.pages.filter((p) => p.id !== id), s.page];
          s.page = target;
          s.selectedId = null; s.selectedElementId = null; s.past = []; s.future = []; s.libraryTarget = null;
        }),
        // New pages share the layout, theme, navbar and footer of the current page.
        addPage: (name = "New page") => {
          const { page, pages } = get();
          const chrome = page.sections.filter((x) => x.kind === "nav" || x.kind === "footer").map(cloneSection);
          const next = {
            ...JSON.parse(JSON.stringify({ layout: page.layout, responsive: page.responsive, theme: page.theme })),
            id: `page-${uuid().slice(0, 8)}`, name, slug: uniqueSlug(name, [page, ...pages]), home: false,
            order: Math.max(0, ...[page, ...pages].map((p) => p.order ?? 0)) + 1, sections: chrome,
          };
          set((s) => { s.pages.push(next); });
          get().switchPage(next.id);
        },
        duplicatePage: (id) => {
          const src = get().allPages().find((p) => p.id === id);
          if (!src) return;
          const all = get().allPages();
          const copy = { ...JSON.parse(JSON.stringify(src)), id: `page-${uuid().slice(0, 8)}`, name: `${src.name} copy`, home: false, order: Math.max(0, ...all.map((p) => p.order ?? 0)) + 1 };
          copy.slug = uniqueSlug(copy.name, all);
          copy.sections = copy.sections.map((sec) => ({ ...sec, id: `section-${uuid().slice(0, 8)}` }));
          set((s) => { s.pages.push(copy); });
          get().switchPage(copy.id);
        },
        updatePageMeta: (id, patch) => {
          const all = get().allPages();
          const fixed = { ...patch };
          if ("slug" in fixed) fixed.slug = uniqueSlug(fixed.slug, all, id);
          if (get().page.id === id) mutatePage((p) => { Object.assign(p, fixed); }, `pagemeta:${id}`);
          else set((s) => { Object.assign(s.pages.find((p) => p.id === id), fixed); });
        },
        setHomePage: (id) => set((s) => {
          [s.page, ...s.pages].forEach((p) => {
            p.home = p.id === id;
            if (p.home) p.slug = "";
            else if (!p.slug) p.slug = uniqueSlug(p.name, [s.page, ...s.pages], p.id);
          });
        }),
        deletePage: (id) => {
          const all = get().allPages();
          if (all.length < 2) return;
          if (get().page.id === id) get().switchPage(all.find((p) => p.id !== id).id);
          set((s) => {
            const gone = s.pages.find((p) => p.id === id);
            s.pages = s.pages.filter((p) => p.id !== id);
            if (gone?.home && s.pages.concat(s.page).every((p) => !p.home)) { s.page.home = true; s.page.slug = ""; }
          });
        },
        moveSection: (id, dir) => mutatePage((p) => {
          const i = p.sections.findIndex((x) => x.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= p.sections.length) return;
          const [m] = p.sections.splice(i, 1);
          p.sections.splice(j, 0, m);
        }),

        /* history */
        undo: () => {
          const { past, page } = get();
          if (!past.length) return;
          const prev = past[past.length - 1];
          set((s) => { s.future.push(page); s.page = prev; s.past.pop(); fixSelection(s); });
          lastEdit = { key: null, at: 0 };
        },
        redo: () => {
          const { future, page } = get();
          if (!future.length) return;
          const next = future[future.length - 1];
          set((s) => { s.past.push(page); s.page = next; s.future.pop(); fixSelection(s); });
          lastEdit = { key: null, at: 0 };
        },

        /* editor UI */
        select: (id) => set((s) => { s.selectedId = id; s.selectedElementId = null; }),
        selectElement: (sectionId, elementId) => set((s) => { s.selectedId = sectionId; s.selectedElementId = elementId; }),
        setPanel: (p) => set((s) => { s.activePanel = p; }),
        setViewport: (v) => set((s) => { s.viewport = v; }),
        setZoom: (z) => set((s) => { s.zoom = Math.min(2, Math.max(0.2, z)); }),
        setView: (key, value) => set((s) => { s[key] = value; }),
        replaySection: (id) => set((s) => { s.playKeys[id] = (s.playKeys[id] || 0) + 1; delete s.previews[id]; }),
        // Replays a single element (delay ignored) — used by the animation inspector and timeline.
        previewElement: (sectionId, elementId) => set((s) => {
          const prev = s.previews[sectionId];
          s.previews[sectionId] = { elementId, n: (prev?.n || 0) + 1 };
        }),
        openStudio: (heroId) => set((s) => { s.studioHeroId = heroId; }),
        closeStudio: () => set((s) => { s.studioHeroId = null; }),
        toggleTimeline: () => set((s) => { s.timelineOpen = !s.timelineOpen; }),
      };
    }),
    {
      name: "synapse:editor:v1",
      partialize: (s) => ({
        page: s.page, pages: s.pages, linkSettings: s.linkSettings, customThemes: s.customThemes, published: s.published, draft: s.draft, viewport: s.viewport, zoom: s.zoom,
        showGrid: s.showGrid, showBounds: s.showBounds, activePanel: s.activePanel,
      }),
    }
  )
);