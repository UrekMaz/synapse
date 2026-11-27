import { useContext, useEffect, useRef, useState } from "react";
import { HeroElement, useHeroRuntime } from "../../components/hero-studio/runtime/HeroRuntime.jsx";
import HeroButton from "../../components/hero-studio/runtime/HeroButton.jsx";
import EditableText from "../../components/hero-studio/runtime/EditableText.jsx";
import { ScrollContainerContext } from "../../animations/engine/ScrollContainerContext.js";
import { fontStack, loadFont } from "../../utils/fonts.js";
import { css, px } from "../../utils/tokens.js";
import { Icon } from "../sections/shared/icons.jsx";
import { BrandLogo } from "../sections/shared/Shell.jsx";
import { mixc } from "../sections/shared/style.js";
import { useLinkProps } from "../../components/hero-studio/runtime/links.js";

/* Scroll state: "scrolled" (background change) and "hidden" (hide on scroll / reveal on scroll). */
function useNavScroll(sp, containerRef) {
  const [state, setState] = useState({ scrolled: false, hidden: !!sp.revealOnScroll });
  useEffect(() => {
    const target = containerRef?.current || window;
    const read = () => (target === window ? window.scrollY : target.scrollTop);
    let last = read();
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = read();
      const down = y > last + 2, up = y < last - 2;
      last = y;
      setState((prev) => {
        const scrolled = y > 24;
        let hidden = prev.hidden;
        if (sp.position === "static") hidden = false;
        else if (sp.revealOnScroll && y < 200) hidden = true;
        else if (sp.hideOnScroll && down && y > 140) hidden = true;
        else if (up && (sp.showOnScrollUp || !sp.hideOnScroll)) hidden = false;
        else if (!sp.hideOnScroll) hidden = false;
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden };
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    target.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { target.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [containerRef, sp.position, sp.hideOnScroll, sp.showOnScrollUp, sp.revealOnScroll]);
  return state;
}

/* ---------- Pieces ---------- */
function NavLink({ id, open, onEnter, onLeave, onToggle }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const linkProps = useLinkProps();
  const p = resolveEl(elementsById[id]);
  const has = p.dropdown !== "none";
  return (
    <HeroElement id={id} as="a"
      htmlProps={{
        ...(has ? { href: linkProps(p.href).href } : linkProps(p.href)), className: "syn-nav-link", "data-active": p.active || undefined, "data-open": open || undefined,
        "aria-haspopup": has || undefined, "aria-expanded": has ? !!open : undefined,
        onMouseEnter: has ? (e) => onEnter(id, e.currentTarget) : undefined, onMouseLeave: has ? onLeave : undefined,
        // Only menu-opening links override the click (plain links keep the smart-link handler).
        ...(has ? { onClick: (e) => { e.preventDefault(); onToggle(id, e.currentTarget); } } : {}),
      }}>
      <EditableText id={id} k="label" value={p.label} />
      {has && <span className="syn-nav-caret" aria-hidden><Icon name="chevron" size={14} strokeWidth={2} /></span>}
    </HeroElement>
  );
}

function NavIcon({ id, light }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const linkProps = useLinkProps();
  const p = resolveEl(elementsById[id]);
  return (
    <HeroElement id={id} as="a" htmlProps={{ ...linkProps(p.href), "aria-label": p.label, className: "syn-nav-icon" }}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, color: "inherit", textDecoration: "none", padding: 8, borderRadius: 999 }}>
      <Icon name={p.icon} size={21} />
      {p.showLabel && <span style={{ fontSize: 13, fontWeight: 500 }}>{p.label}</span>}
      {p.badge && <span style={{ position: "absolute", top: 1, right: 0, minWidth: 17, height: 17, padding: "0 4px", boxSizing: "border-box", borderRadius: 99, background: light ? "#fff" : "var(--syn-primary)", color: light ? "#000" : "var(--syn-buttonText)", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center" }}>{p.badge}</span>}
    </HeroElement>
  );
}

function SearchBar({ fill }) {
  const { elementsById, resolveEl, editor } = useHeroRuntime();
  const el = elementsById.search;
  if (!el) return null;
  const p = resolveEl(el);
  const submit = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    if (!editor && q) window.location.href = `${p.action || "/search"}?q=${encodeURIComponent(q)}`;
  };
  return (
    <HeroElement id="search" wrapperStyle={{ flex: fill ? "1 1 auto" : undefined, maxWidth: p.width, minWidth: 0, width: fill ? "100%" : p.width }} style={{ width: "100%" }}>
      <form role="search" onSubmit={submit} style={{ position: "relative", width: "100%" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.55, lineHeight: 0 }}><Icon name="search" size={17} /></span>
        <input name="q" type="search" placeholder={p.placeholder} aria-label={p.placeholder}
          style={{ width: "100%", boxSizing: "border-box", height: 44, padding: "0 16px 0 40px", borderRadius: 999, border: "1px solid var(--syn-border)", background: "var(--syn-surface)", color: "var(--syn-text)", font: "inherit", fontSize: 14, outline: "none" }} />
      </form>
    </HeroElement>
  );
}

/* Dropdown / mega menu, rendered at bar level so it is never clipped by a transformed link. */
function DropdownPanel({ id, anchor, sp, onEnter, onLeave, navWidth }) {
  const { elementsById, resolveEl, editor, selectElement } = useHeroRuntime();
  const linkProps = useLinkProps();
  const el = elementsById[id];
  if (!el) return null;
  const p = resolveEl(el);
  const mega = p.dropdown === "mega";
  const W = mega ? Math.min(p.megaWidth || 760, navWidth - 32) : sp.ddWidth;
  const left = mega ? Math.max(16, Math.min(anchor.left + anchor.width / 2 - W / 2, navWidth - W - 16)) : Math.max(8, Math.min(anchor.left - 12, navWidth - W - 8));
  const item = (it, i) => (
    <a key={i} {...linkProps(it.href, editor ? { onClick: (e) => e.preventDefault() } : {})} className="syn-dd-item">
      {it.icon && <span className="syn-dd-icon"><Icon name={it.icon} size={17} /></span>}
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontWeight: 600, fontSize: 14 }}>{it.label}</span>
        {it.description && <span style={{ display: "block", fontSize: 12.5, opacity: 0.62, marginTop: 2 }}>{it.description}</span>}
      </span>
    </a>
  );
  return (
    <div className={`syn-dd syn-dd-${sp.ddAnimation}`} role="menu" onMouseEnter={onEnter} onMouseLeave={onLeave}
      onPointerDown={editor ? (e) => { e.stopPropagation(); selectElement(id); } : undefined}
      style={{
        position: "absolute", top: "calc(100% - 6px)", left, width: W, zIndex: 80, boxSizing: "border-box",
        background: css(sp.ddBg), color: css(sp.ddText), borderRadius: sp.ddRadius, border: `1px solid ${css(sp.ddBorder)}`,
        boxShadow: `0 ${Math.round(40 * sp.ddShadow)}px ${Math.round(80 * sp.ddShadow)}px -${Math.round(20 * sp.ddShadow)}px rgba(15,23,42,${0.12 + 0.3 * sp.ddShadow})`,
        padding: mega ? 22 : 8, fontFamily: "var(--syn-font-body)", textTransform: "none", letterSpacing: 0,
      }}>
      {mega ? (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${p.columns.length || 1}, minmax(0, 1fr))${p.promoTitle ? " 240px" : ""}`, gap: 20 }}>
          {p.columns.map((c, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.5, padding: "4px 10px 8px" }}>{c.heading}</div>
              {(c.links || []).map(item)}
            </div>
          ))}
          {p.promoTitle && (
            <a {...linkProps(p.promoHref, editor ? { onClick: (e) => e.preventDefault() } : {})} className="syn-dd-promo"
              style={{ display: "flex", flexDirection: "column", borderRadius: Math.max(0, sp.ddRadius - 4), overflow: "hidden", background: "var(--syn-surface)", color: "var(--syn-text)", textDecoration: "none" }}>
              {p.promoImage && <div style={{ height: 120, backgroundImage: `url("${p.promoImage}")`, backgroundSize: "cover", backgroundPosition: "center" }} />}
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 650, fontSize: 14 }}>{p.promoTitle}</div>
                {p.promoText && <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 4, lineHeight: 1.45 }}>{p.promoText}</div>}
                <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 10, color: "var(--syn-primary)" }}>{p.promoCta} →</div>
              </div>
            </a>
          )}
        </div>
      ) : (p.items || []).map(item)}
    </div>
  );
}

/* Mobile menu: drawer, full screen or dropdown. Fully functional, including collapsible sub-menus. */
function MobileMenu({ open, onClose, sp, links, buttons, icons, light }) {
  const { elementsById, resolveEl, editor } = useHeroRuntime();
  const linkProps = useLinkProps();
  const [sub, setSub] = useState(null);
  const style = sp.menuStyle;
  const fixed = !editor && style !== "dropdown";
  const panel = {
    drawer: { top: 0, right: 0, bottom: 0, width: "min(380px, 88%)" },
    fullscreen: { inset: 0 },
    dropdown: { top: "100%", left: 0, right: 0 },
  }[style];
  return (
    <div className={`syn-menu syn-menu-${style} syn-menu-${sp.menuAnimation}`} data-open={open || undefined} aria-hidden={!open}
      style={{ position: fixed ? "fixed" : "absolute", inset: style === "dropdown" ? undefined : 0, top: style === "dropdown" ? "100%" : 0, left: 0, right: 0, height: style === "dropdown" ? undefined : fixed ? "100dvh" : 760, zIndex: 90, pointerEvents: open ? "auto" : "none" }}>
      {style !== "dropdown" && <div className="syn-menu-backdrop" onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(5,6,12,.45)", backdropFilter: "blur(2px)" }} />}
      <nav aria-label="Mobile" className="syn-menu-panel" style={{
        position: "absolute", ...panel, boxSizing: "border-box", background: css(sp.menuBg), color: css(sp.menuText), overflowY: "auto",
        padding: style === "dropdown" ? "10px 20px 22px" : "22px 24px 28px", display: "flex", flexDirection: "column",
        boxShadow: "0 30px 60px -20px rgba(0,0,0,.35)", borderTop: style === "dropdown" ? `1px solid ${css(sp.borderColor)}` : undefined,
      }}>
        {style !== "dropdown" && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
            <button type="button" onClick={onClose} aria-label="Close menu" className="syn-burger" style={{ color: "inherit" }}><Icon name="close" size={24} /></button>
          </div>
        )}
        {links.map((l) => {
          const p = resolveEl(elementsById[l.id]);
          const has = p.dropdown !== "none";
          const kids = p.dropdown === "mega" ? (p.columns || []).flatMap((c) => c.links || []) : p.items || [];
          return (
            <div key={l.id} style={{ borderBottom: `1px solid ${mixc(sp.menuText, 10)}` }}>
              <HeroElement id={l.id} as="a" htmlProps={{
                ...linkProps(p.href), className: "syn-menu-link", "data-active": p.active || undefined, "aria-expanded": has ? sub === l.id : undefined,
                onClick: (e) => { if (has) { e.preventDefault(); setSub(sub === l.id ? null : l.id); } else { linkProps(p.href).onClick?.(e); onClose(); } },
              }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: style === "fullscreen" ? "18px 4px" : "15px 4px", fontSize: style === "fullscreen" ? 26 : 17, fontWeight: 600, color: "inherit", textDecoration: "none" }}>
                <span>{p.label}</span>
                {has && <span style={{ transition: "transform .3s", transform: sub === l.id ? "rotate(180deg)" : "none", lineHeight: 0 }}><Icon name="chevron" size={18} /></span>}
              </HeroElement>
              {has && (
                <div className="syn-collapse" data-open={sub === l.id || undefined}>
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ padding: "0 4px 14px", display: "grid", gap: 2 }}>
                      {kids.map((it, i) => <a key={i} {...linkProps(it.href, { onClick: onClose })} style={{ padding: "8px 0", fontSize: 15, opacity: 0.75, color: "inherit", textDecoration: "none" }}>{it.label}</a>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {icons.length > 0 && <div style={{ display: "flex", gap: 6, marginTop: 18 }}>{icons.map((i) => <NavIcon key={i.id} id={i.id} light={light} />)}</div>}
        {buttons.length > 0 && <div style={{ display: "grid", gap: 10, marginTop: "auto", paddingTop: 24 }}>{buttons.map((b) => <HeroButton key={b.id} id={b.id} fullWidth />)}</div>}
      </nav>
    </div>
  );
}

export default function Navbar() {
  const rt = useHeroRuntime();
  const { sectionProps: sp, bp, elements, editor, selectedElementId, elementsById, resolveEl } = rt;
  const scrollRef = useContext(ScrollContainerContext);
  const { scrolled, hidden } = useNavScroll(sp, scrollRef);
  const navRef = useRef(null);
  const closeTimer = useRef(0);
  const [dd, setDd] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  loadFont(sp.linkFont);

  const visible = (type) => elements.filter((e) => e.type === type && e.visible !== false && !resolveEl(e).hidden);
  const links = visible("link");
  const buttons = visible("button");
  const icons = visible("navicon");
  const hasSearch = elementsById.search && elementsById.search.visible !== false && !resolveEl(elementsById.search).hidden;
  const collapsed = bp === "mobile" || (sp.collapseAt === "tablet" && bp === "tablet");

  // In the editor, selecting something that lives inside the closed mobile menu opens it.
  const selType = selectedElementId && elementsById[selectedElementId]?.type;
  const menuVisible = collapsed && (menuOpen || (editor && ["link", "button", "navicon"].includes(selType)));

  // Close dropdowns on outside click (click trigger) and when the layout changes.
  useEffect(() => {
    if (!dd) return;
    const onDown = (e) => { if (!navRef.current?.contains(e.target)) setDd(null); };
    const onKey = (e) => { if (e.key === "Escape") setDd(null); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [dd]);

  const anchorOf = (node) => {
    const nav = navRef.current;
    const r = node.getBoundingClientRect(), n = nav.getBoundingClientRect();
    const k = n.width / nav.offsetWidth || 1; // canvas zoom
    return { left: (r.left - n.left) / k, width: r.width / k, navWidth: nav.offsetWidth };
  };
  const openDd = (id, node) => { clearTimeout(closeTimer.current); setDd({ id, ...anchorOf(node) }); };
  const hover = sp.ddTrigger !== "click";
  const onEnter = (id, node) => { if (hover) openDd(id, node); };
  const onLeave = () => { if (hover) closeTimer.current = setTimeout(() => setDd(null), 160); };
  const onToggle = (id, node) => (dd?.id === id && !hover ? setDd(null) : openDd(id, node));

  const solid = scrolled && sp.changeOnScroll;
  const bg = solid ? sp.scrolledBg : sp.background;
  const op = solid ? sp.scrolledOpacity : sp.bgOpacity;
  const background = sp.gradient && !solid
    ? `linear-gradient(90deg, ${mixc(sp.gradientFrom, op * 100)}, ${mixc(sp.gradientTo, op * 100)})`
    : mixc(bg, op * 100);
  const blur = solid ? sp.scrolledBlur : sp.blur;
  const shadow = solid ? sp.scrolledShadow : sp.shadow;
  const textColor = solid && sp.scrolledText ? css(sp.scrolledText) : css(sp.linkColor);
  const light = /^#f|^#e|^#d|^#c|fff|white/i.test(String(sp.linkColor)) && !sp.scrolledText;

  const linkRow = (list, justify) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: justify, gap: sp.linkGap, flex: 1, minWidth: 0 }}>
      {list.map((l) => <NavLink key={l.id} id={l.id} open={dd?.id === l.id} onEnter={onEnter} onLeave={onLeave} onToggle={onToggle} />)}
    </div>
  );
  const actions = (withButtons = true) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
      {icons.map((i) => <NavIcon key={i.id} id={i.id} light={light} />)}
      {withButtons && buttons.map((b) => <HeroButton key={b.id} id={b.id} />)}
    </div>
  );
  const burger = (
    <button type="button" className="syn-burger" aria-label={menuVisible ? "Close menu" : "Open menu"} aria-expanded={menuVisible} onClick={() => setMenuOpen(!menuVisible)} style={{ color: "inherit" }}>
      <Icon name={menuVisible && sp.menuStyle === "dropdown" ? "close" : "menu"} size={24} />
    </button>
  );

  let row;
  if (collapsed) {
    const cart = icons.filter((i) => ["bag", "cart"].includes(resolveEl(i).icon));
    row = (
      <div style={{ display: "flex", alignItems: "center", gap: 8, height: sp.height }}>
        <BrandLogo />
        <div style={{ flex: 1 }} />
        {cart.map((i) => <NavIcon key={i.id} id={i.id} light={light} />)}
        {burger}
      </div>
    );
  } else if (sp.arrangement === "centered") {
    const half = Math.ceil(links.length / 2);
    row = (
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 28, height: sp.height }}>
        {linkRow(links.slice(0, half), "flex-start")}
        <BrandLogo />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: sp.linkGap }}>
          {linkRow(links.slice(half), "flex-end")}
          {actions()}
        </div>
      </div>
    );
  } else if (sp.arrangement === "two-row") {
    row = (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 28, height: sp.height }}>
          <BrandLogo />
          <div style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 0 }}>{hasSearch && <SearchBar fill />}</div>
          {actions()}
        </div>
        <div style={{ borderTop: `1px solid ${css(sp.borderColor)}`, height: 48, display: "flex", alignItems: "center" }}>
          {linkRow(links, sp.linksAlign === "left" ? "flex-start" : "center")}
        </div>
      </>
    );
  } else {
    const justify = { left: "flex-start", center: "center", right: "flex-end" }[sp.linksAlign] || "flex-end";
    row = (
      <div style={{ display: "flex", alignItems: "center", gap: 28, height: sp.height }}>
        <BrandLogo />
        {sp.linksAlign === "center"
          ? <><div style={{ flex: 1 }} /><div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", gap: sp.linkGap }}>{links.map((l) => <NavLink key={l.id} id={l.id} open={dd?.id === l.id} onEnter={onEnter} onLeave={onLeave} onToggle={onToggle} />)}</div></>
          : linkRow(links, justify)}
        {hasSearch && <SearchBar />}
        {actions()}
      </div>
    );
  }

  return (
    <nav ref={navRef} aria-label="Main" className="syn-nav" data-active-style={sp.activeStyle} data-hidden={hidden || undefined}
      style={{
        position: sp.overlay ? "absolute" : "relative", top: 0, left: 0, right: 0, zIndex: 50, boxSizing: "border-box",
        background, backdropFilter: blur ? `blur(${blur}px) saturate(160%)` : undefined, WebkitBackdropFilter: blur ? `blur(${blur}px) saturate(160%)` : undefined,
        borderBottom: sp.borderBottom ? `1px solid ${css(sp.borderColor)}` : "1px solid transparent",
        boxShadow: shadow ? `0 ${Math.round(18 * shadow)}px ${Math.round(48 * shadow)}px -${Math.round(14 * shadow)}px rgba(15,23,42,${0.1 + 0.3 * shadow})` : "none",
        color: textColor, fontFamily: fontStack(sp.linkFont), fontSize: sp.linkSize, fontWeight: sp.linkWeight,
        textTransform: sp.linkTransform, letterSpacing: `${sp.linkTracking}em`,
        "--nav-link": textColor, "--nav-hover": css(sp.linkHover), "--nav-active": css(sp.activeColor),
        transition: "background .45s ease, box-shadow .45s ease, transform .45s cubic-bezier(.2,.8,.2,1), backdrop-filter .45s ease",
        transform: hidden ? "translateY(-105%)" : "none",
      }}>
      <div style={{ position: "relative", boxSizing: "border-box", width: "100%", maxWidth: sp.fullWidth ? "none" : `calc(${px(sp.maxWidth, "var(--syn-container)")} + ${sp.paddingX * 2}px)`, margin: "0 auto", paddingInline: sp.paddingX }}>
        {row}
      </div>
      {dd && !collapsed && (
        <DropdownPanel id={dd.id} anchor={dd} sp={sp} navWidth={dd.navWidth}
          onEnter={() => clearTimeout(closeTimer.current)} onLeave={onLeave} />
      )}
      {collapsed && <MobileMenu open={menuVisible} onClose={() => setMenuOpen(false)} sp={sp} links={links} buttons={buttons} icons={icons.filter((i) => !["bag", "cart"].includes(resolveEl(i).icon))} light={light} />}
    </nav>
  );
}
