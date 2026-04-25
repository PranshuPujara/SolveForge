import { BrainCircuit } from 'lucide-react';
import { getLastRating } from '../../utils/localStorage';
export const SmartModeToggle = ({ enabled, onChange }) => {
  const lr = getLastRating();
  return (
    <button type="button" onClick={() => onChange(!enabled)} style={{
      width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 13px',
      borderRadius:10, cursor:'pointer', textAlign:'left',
      background: enabled ? 'var(--primary-bg)' : 'var(--bg-el)',
      border:`1.5px solid ${enabled ? 'var(--primary)' : 'var(--b1)'}`,
      transition:'all .18s',
    }}
      onMouseEnter={e=>{ if(!enabled) e.currentTarget.style.borderColor='var(--b2)'; }}
      onMouseLeave={e=>{ if(!enabled) e.currentTarget.style.borderColor='var(--b1)'; }}
    >
      <BrainCircuit size={18} strokeWidth={1.5} color={enabled ? 'var(--primary)' : 'var(--t3)'} style={{ flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:600, color: enabled ? 'var(--primary)' : 'var(--t1)' }}>Smart Mode</div>
        <div style={{ fontSize:11, color:'var(--t3)', marginTop:1 }}>
          {enabled && lr ? `Last: ${lr} → target ${lr+100}–${lr+400}` : 'Auto-escalates difficulty over time'}
        </div>
      </div>
      <div style={{ width:34, height:19, borderRadius:99, position:'relative', flexShrink:0,
        background: enabled ? 'var(--primary)' : 'var(--bg-press)', transition:'background .18s' }}>
        <div style={{ position:'absolute', top:2, width:13, height:13, borderRadius:'50%',
          background: enabled ? '#000' : 'var(--t3)', left: enabled ? 18 : 3, transition:'left .18s' }} />
      </div>
    </button>
  );
};
