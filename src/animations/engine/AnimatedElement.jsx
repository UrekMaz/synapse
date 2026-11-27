import { createElement, useContext, useMemo, useRef } from "react";
import { motion, useAnimationControls, useScroll, useTransform } from "framer-motion";
import { buildPlan, pick, REST } from "../presets/index.js";
import { ScrollContainerContext } from "./ScrollContainerContext.js";
import TextContent from "./TextContent.jsx";

const motionTag = (tag) => motion[tag] || motion.div;

function Content({ text, children, mode, mask, pad, displace, childVariants }) {
  return text != null ? (
    <TextContent text={text} mode={mode} mask={mask} pad={pad} displace={displace} childVariants={childVariants} />
  ) : children;
}

function StaticElement({ tag = "div", style, className, htmlProps, text, displace, maskPad, children }) {
  return createElement(tag, { ...htmlProps, style, className },
    <Content text={text} pad={maskPad} displace={displace}>{children}</Content>);
}

// page-load, after-delay, viewport entry
function AutoElement({ plan, trigger, cfg, tag = "div", style, className, htmlProps, text, displace, maskPad, children }) {
  const M = motionTag(tag);
  const inView = trigger === "viewport";
  const splitMode = text != null ? cfg.split ?? plan.preset.defaults.split ?? "none" : "none";
  const useSplit = splitMode !== "none" && plan.kind === "entrance";
  const stagger = cfg.stagger ?? plan.preset.defaults.stagger ?? 0.04;

  const variants = useSplit
    ? { from: {}, to: { transition: { staggerChildren: stagger, delayChildren: plan.delay } } }
    : { from: plan.initial, to: { ...plan.animate, transition: plan.transition } };
  const childVariants = useSplit ? { from: plan.initial, to: { ...plan.animate, transition: plan.base } } : null;

  return (
    <M {...htmlProps} className={className} style={style} variants={variants} initial="from"
       animate={inView ? undefined : "to"} whileInView={inView ? "to" : undefined} viewport={inView ? { once: true, amount: 0.3 } : undefined}>
      <Content text={text} mode={useSplit ? splitMode : "none"} mask={useSplit && !!plan.preset.mask} pad={maskPad} displace={displace} childVariants={childVariants}>
        {children}
      </Content>
    </M>
  );
}

// hover and click
function EventElement({ plan, trigger, tag = "div", style, className, htmlProps, text, displace, maskPad, children }) {
  const M = motionTag(tag);
  const controls = useAnimationControls();
  const run = () => {
    if (plan.kind === "entrance") controls.set(plan.initial);
    controls.start({ ...plan.animate, transition: plan.transition });
  };
  const reset = () => {
    if (plan.kind === "exit" || plan.kind === "emphasis") controls.start({ ...pick(REST, Object.keys(plan.animate)), transition: { duration: 0.3 } });
  };
  const props = plan.kind === "hover"
    ? { whileHover: plan.hover, transition: plan.transition }
    : { animate: controls, onHoverStart: trigger === "hover" ? run : undefined, onHoverEnd: trigger === "hover" ? reset : undefined, onTap: trigger === "click" ? run : undefined };
  return (
    <M {...htmlProps} {...props} className={className} style={style}>
      <Content text={text} pad={maskPad} displace={displace}>{children}</Content>
    </M>
  );
}

// scroll progress
function ScrollElement({ plan, tag = "div", style, className, htmlProps, text, displace, maskPad, children }) {
  const M = motionTag(tag);
  const ref = useRef(null);
  const container = useContext(ScrollContainerContext);
  const { scrollYProgress } = useScroll({ target: ref, ...(container ? { container } : {}), offset: plan.offset || ["start end", "end start"] });
  const s = plan.scrub || {};
  const opacity = useTransform(scrollYProgress, [0, 1], s.opacity || [1, 1]);
  const x = useTransform(scrollYProgress, [0, 1], s.x || [0, 0]);
  const y = useTransform(scrollYProgress, [0, 1], s.y || [0, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], s.scale || [1, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], s.rotate || [0, 0]);
  return (
    <M ref={ref} {...htmlProps} className={className} style={{ ...style, opacity, x, y, scale, rotate }}>
      <Content text={text} pad={maskPad} displace={displace}>{children}</Content>
    </M>
  );
}

export default function AnimatedElement(props) {
  const { cfg, animated = true, reduced = false } = props;
  const plan = useMemo(() => (animated && !reduced && cfg ? buildPlan(cfg) : null), [cfg, animated, reduced]);
  if (!plan) return <StaticElement {...props} />;

  let trigger = plan.kind === "hover" ? "hover" : plan.kind === "scroll" ? "scroll" : cfg.trigger || "page-load";
  if (trigger === "scroll" && !plan.scrub) trigger = "page-load";

  if (plan.kind === "hover" || trigger === "hover" || trigger === "click") return <EventElement {...props} plan={plan} trigger={trigger} />;
  if (trigger === "scroll") return <ScrollElement {...props} plan={plan} />;
  return <AutoElement {...props} plan={plan} trigger={trigger} />;
}