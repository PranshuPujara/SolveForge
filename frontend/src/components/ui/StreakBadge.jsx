import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { getStreak } from '../../utils/localStorage';
export const StreakBadge = () => {
  const [s, setS] = useState({ count:0, lastDate:null });
  useEffect(() => setS(getStreak()), []);
  if (!s.count) return null;
  const active = s.lastDate === new Date().toISOString().slice(0,10);
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:6, padding:'5px 13px',
      borderRadius:8, fontSize:11, fontFamily:'var(--mono)', fontWeight:800,
      background: active ? 'var(--warning-bg)' : 'var(--bg-el)',
      border:`1px solid ${active ? 'var(--warning)' : 'var(--b1)'}`,
      color: active ? 'var(--warning)' : 'var(--t3)',
      transition:'all 0.2s ease',
      textTransform:'uppercase',
      letterSpacing:'.05em',
    }}
    onMouseEnter={e=>{ if(active) { e.currentTarget.style.boxShadow='0 2px 8px rgba(245, 158, 11, 0.15)'; e.currentTarget.style.transform='translateY(-1px)'; }}}
    onMouseLeave={e=>{ if(active) { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform=''; }}}
    >
      <Flame size={14} strokeWidth={2} /> {s.count}d
    </div>
  );
};
