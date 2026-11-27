import * as N from "./heroNode.js";
import { applyChoreographyData } from "./choreography.js";

// edit(fn, coalesceKey) applies fn(node) to whichever node is being edited.
// preview(id) replays a single element; falls back to replaying the whole section.
export function makeHeroApi({ def, viewport, edit, select, replay, preview, extra = {} }) {
  return {
    select,
    replay,
    previewElement: (id) => (preview ? preview(id) : replay?.()),
    setSectionProp: (key, value, responsive) => edit((n) => { N.setSectionProp(n, key, value, viewport, responsive); }, `sp:${key}`),
    resetSectionProp: (key) => edit((n) => { N.resetSectionProp(n, key, viewport); }),
    setElementProp: (id, key, value, responsive) => edit((n) => { N.setElementProp(n, id, key, value, viewport, responsive); }, `ep:${id}:${key}`),
    resetElementProp: (id, key) => edit((n) => { N.resetElementProp(n, id, key, viewport); }),
    setAnimation: (id, patch) => edit((n) => { N.setElementAnimation(n, id, patch); }, `an:${id}:${Object.keys(patch).join()}`),
    setVisible: (id, v) => edit((n) => { N.setElementVisible(n, id, v); }),
    addElement: (type) => {
      let nid = null;
      edit((n) => { nid = N.addElement(n, def, type); });
      if (nid) select(nid);
    },
    removeElement: (id) => { edit((n) => { N.removeElement(n, id); }); select(null); },
    moveElement: (id, dir) => edit((n) => { N.moveElement(n, id, dir); }),
    applyChoreography: (cid) => {
      edit((n) => {
        const c = def.choreographies?.[cid];
        if (!c) return;
        applyChoreographyData(n, c);
        n.animationSettings = { ...n.animationSettings, choreography: cid };
      });
      replay?.();
    },
    applyVariation: (vid) => {
      edit((n) => { N.applyVariation(n, def.variations?.[vid], vid, def.variations); });
      replay?.();
    },
    setAnimationSetting: (key, v) => edit((n) => { n.animationSettings = { ...n.animationSettings, [key]: v }; }),
    ...extra,
  };
}
