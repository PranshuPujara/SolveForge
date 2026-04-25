import { BarChart2, Braces, Binary, Star } from 'lucide-react';

const C = {
  default: { bg:'var(--bg-press)', text:'var(--t2)', border:'var(--b2)' },
  acid:    { bg:'var(--primary-bg)', text:'var(--primary)', border:'var(--primary)' },
  green:   { bg:'var(--green-bg)', text:'var(--green)', border:'var(--green)' },
  yellow:  { bg:'var(--yellow-bg)', text:'var(--yellow)', border:'var(--yellow)' },
  red:     { bg:'var(--red-bg)', text:'var(--red)', border:'var(--red)' },
  blue:    { bg:'var(--blue-bg)', text:'var(--blue)', border:'var(--blue)' },
  orange:  { bg:'var(--orange-bg)', text:'var(--orange)', border:'var(--orange)' },
};

export const Badge = ({ children, color='default' }) => {
  const c = C[color]||C.default;
  return <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 9px',borderRadius:7,fontSize:11,fontFamily:'var(--mono)',fontWeight:700,background:c.bg,color:c.text,border:`1.5px solid ${c.border}50`,letterSpacing:'.04em',textTransform:'uppercase',transition:'all 0.15s ease' }}>{children}</span>;
};

export const DifficultyBadge = ({ difficulty, rating }) => {
  if (rating) {
    const [col, lbl] = rating<=1000?['green',rating]:rating<=1400?['blue',rating]:rating<=1800?['yellow',rating]:rating<=2200?['orange',rating]:['red',rating];
    return <Badge color={col}><Star size={11} strokeWidth={2} /> {lbl}</Badge>;
  }
  const m = { easy:['green','Easy'], medium:['yellow','Medium'], hard:['red','Hard'] };
  const [c,l] = m[difficulty?.toLowerCase()]||['default',difficulty];
  return <Badge color={c}>{l}</Badge>;
};

const PLAT_ICON = {
  codeforces: BarChart2,
  leetcode: Braces,
  gfg: Binary,
};

export const PlatformBadge = ({ platform }) => {
  const m = { codeforces:['blue','CF'], leetcode:['orange','LC'], gfg:['green','GFG'] };
  const [c,l] = m[platform]||['default',platform];
  const Icon = PLAT_ICON[platform];
  return <Badge color={c}>{Icon && <Icon size={12} strokeWidth={1.8} />} {l}</Badge>;
};
