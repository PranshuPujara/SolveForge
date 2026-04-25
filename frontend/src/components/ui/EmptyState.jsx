import { Layers, Tag, Ban, BrainCircuit, CornerDownLeft } from 'lucide-react';

export const EmptyState = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'64px 28px', gap:28, textAlign:'center', animation:'fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
    <div style={{
      width:72, height:72, borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center',
      background:'var(--primary-bg)', border:'1.5px solid var(--primary)',
      animation:'float 3s ease-in-out infinite'
    }}>
      <Layers size={32} strokeWidth={1.5} color="var(--primary)" />
    </div>
    <div>
      <div style={{ fontSize:22, fontWeight:900, color:'var(--t1)', letterSpacing:'-.03em', marginBottom:8 }}>ForgeSolve is ready</div>
      <div style={{ fontSize:13, color:'var(--t3)', lineHeight:1.8, maxWidth:300 }}>
        Pick a platform, set your difficulty, and hit <span style={{ color:'var(--primary)', fontWeight:700 }}>Get Problem</span>.
      </div>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:'100%', maxWidth:340 }}>
      {[
        { icon: Tag,             text: 'Tags use OR logic' },
        { icon: Ban,             text: 'No repeat problems' },
        { icon: BrainCircuit,    text: 'Smart mode escalates' },
        { icon: CornerDownLeft,  text: 'Enter to generate' },
      ].map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={item.text} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderRadius:10, background:'var(--bg-el)', border:'1px solid var(--b1)', fontSize:12, color:'var(--t2)', fontWeight:600, animation:`fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both`, animationDelay:`${idx * 0.05}s`, transition:'all 0.2s ease', cursor:'default' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--t1)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--b1)'; e.currentTarget.style.color='var(--t2)'; }}
          >
            <Icon size={16} strokeWidth={1.8} style={{ flexShrink:0, color:'var(--t3)' }} />{item.text}
          </div>
        );
      })}
    </div>
  </div>
);
