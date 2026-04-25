import { AlertTriangle, Zap, RotateCcw, ChevronRight } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry, suggestions=[], noFriendMatch=false, onSuggestAnyway }) => (
  <div style={{ borderRadius:13, overflow:'hidden', border:'1.5px solid var(--red)60', background:'var(--bg-card)', boxShadow:'0 8px 32px rgba(0, 0, 0, 0.2)' }} className="anim-scale">
    <div style={{ height:3, background:'linear-gradient(90deg, var(--red), var(--orange))' }} />
    <div style={{ padding:'20px 20px 18px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:13, marginBottom:14 }}>
        <div style={{ width:36, height:36, borderRadius:9, background:'var(--red-bg)', border:'1.5px solid var(--red)60',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <AlertTriangle size={18} strokeWidth={2} color="var(--red)" />
        </div>
        <div>
          <p style={{ fontSize:15, fontWeight:800, color:'var(--red)', marginBottom:4 }}>
            {noFriendMatch ? 'No friend-filtered match' : 'No problems found'}
          </p>
          <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.7, maxWidth:320 }}>{message}</p>
        </div>
      </div>
      {suggestions.length > 0 && (
        <ul style={{ paddingLeft:12, marginBottom:16, display:'flex', flexDirection:'column', gap:5 }}>
          {suggestions.map(s=>(
            <li key={s} style={{ fontSize:12, color:'var(--t3)', fontFamily:'var(--mono)', listStyle:'none', display:'flex', alignItems:'center', gap:6, fontWeight:600 }}>
              <ChevronRight size={12} strokeWidth={2} color="var(--red)" style={{ opacity:.6, flexShrink:0 }} />{s}
            </li>
          ))}
        </ul>
      )}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {noFriendMatch && onSuggestAnyway && (
          <button type="button" onClick={onSuggestAnyway}
            style={{ width:'100%', padding:'12px', borderRadius:10, cursor:'pointer', background:'var(--primary)',
              border:'none', color:'#000', fontSize:13, fontWeight:900, transition:'all .15s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing:'-.01em', display:'flex', alignItems:'center', justifyContent:'center', gap:7,
              boxShadow:'0 4px 12px rgba(0, 217, 255, 0.2)' }}
            onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 6px 16px rgba(0, 217, 255, 0.25)'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 4px 12px rgba(0, 217, 255, 0.2)'; e.currentTarget.style.transform=''; }}
          ><Zap size={16} strokeWidth={2.5} />Suggest one anyway</button>
        )}
        {onRetry && (
          <button type="button" onClick={onRetry}
            style={{ width:'100%', padding:'12px', borderRadius:10, cursor:'pointer', background:'var(--bg-el)',
              border:'1.5px solid var(--b1)', color:'var(--t2)', fontSize:13, fontWeight:700, transition:'all .15s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing:'-.01em', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--t1)'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--b1)'; e.currentTarget.style.color='var(--t2)'; e.currentTarget.style.transform=''; }}
          ><RotateCcw size={14} strokeWidth={2} />Try different filters</button>
        )}
      </div>
    </div>
  </div>
);
