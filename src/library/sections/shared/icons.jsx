import {
  ArrowRight, ArrowUpRight, Award, BarChart3, Bell, Box, Briefcase, Building2, Calendar, Camera, Check, ChevronDown, Clock, Cloud, Code,
  Coffee, Compass, Cpu, CreditCard, Database, DollarSign, Eye, Feather, Gauge, Gem, Globe, Headphones, Heart, Infinity as InfinityIcon, Layers,
  Leaf, Lightbulb, Lock, Mail, MapPin, Menu, MessageCircle, Minus, Monitor, Package, Palette, PenTool, Percent, Phone, Plus, Puzzle, Quote,
  RefreshCw, Rocket, Search, Send, Server, Settings, Shield, ShieldCheck, ShoppingBag, ShoppingCart, Smartphone, Smile, Sparkles, Star, Target,
  Terminal, Timer, TrendingUp, Truck, User, Users, Wand2, Workflow, X, Zap,
} from "lucide-react";

// Brand marks are drawn inline (lucide no longer ships logos). Same 24px stroke style as lucide.
const brand = (children) => function Brand({ size = 20, color = "currentColor", strokeWidth = 1.8 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>;
};
const BRANDS = {
  github: brand(<><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></>),
  x: brand(<><path d="M4 4l11.7 16h4.3L8.3 4z" /><path d="M4 20l6.8-6.8M13.2 10.8 20 4" /></>),
  linkedin: brand(<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>),
  instagram: brand(<><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><path d="M17.5 6.5h.01" /></>),
  facebook: brand(<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />),
  youtube: brand(<><path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></>),
  dribbble: brand(<><circle cx="12" cy="12" r="10" /><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32M8.56 2.75c4.37 6 6 9.42 8 17.72" /></>),
  tiktok: brand(<path d="M21 7.9v4a10 10 0 0 1-5-2v4.6a6.5 6.5 0 1 1-8-6.3v4.3a2.5 2.5 0 1 0 4 2V3h4.1A6 6 0 0 0 21 7.9z" />),
};

const ICONS = {
  zap: Zap, sparkles: Sparkles, rocket: Rocket, shield: Shield, "shield-check": ShieldCheck, layers: Layers, gauge: Gauge, globe: Globe,
  lock: Lock, cloud: Cloud, cpu: Cpu, code: Code, terminal: Terminal, chart: BarChart3, trending: TrendingUp, users: Users, user: User,
  heart: Heart, star: Star, search: Search, bag: ShoppingBag, cart: ShoppingCart, mail: Mail, phone: Phone, pin: MapPin, clock: Clock,
  palette: Palette, pen: PenTool, camera: Camera, briefcase: Briefcase, award: Award, smile: Smile, target: Target, lightbulb: Lightbulb,
  wand: Wand2, leaf: Leaf, truck: Truck, card: CreditCard, refresh: RefreshCw, headphones: Headphones, chat: MessageCircle, send: Send,
  building: Building2, compass: Compass, infinity: InfinityIcon, puzzle: Puzzle, workflow: Workflow, box: Box, package: Package,
  calendar: Calendar, bell: Bell, settings: Settings, eye: Eye, feather: Feather, gem: Gem, coffee: Coffee, database: Database,
  server: Server, phone2: Smartphone, monitor: Monitor, dollar: DollarSign, percent: Percent, timer: Timer, check: Check, quote: Quote,
  arrow: ArrowRight, "arrow-up-right": ArrowUpRight, plus: Plus, minus: Minus, chevron: ChevronDown, menu: Menu, close: X,
  ...BRANDS,
};

export function Icon({ name, size = 20, color = "currentColor", strokeWidth = 1.8, style }) {
  const C = ICONS[name];
  if (!C) return null;
  return <span aria-hidden style={{ display: "inline-flex", lineHeight: 0, ...style }}><C size={size} color={color} strokeWidth={strokeWidth} /></span>;
}
