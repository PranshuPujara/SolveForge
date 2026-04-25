export const Button = ({ children, onClick, disabled, loading, variant='primary', size='md', fullWidth=false, className='', type='button' }) => {
  const S = { sm:{p:'6px 12px',fs:11,r:7}, md:{p:'9px 16px',fs:13,r:8}, lg:{p:'11px 20px',fs:14,r:9}, xl:{p:'13px 0',fs:15,r:10} }[size];
  const V = {
    primary:   { bg:'var(--primary)', color:'#000',       border:'transparent' },
    secondary: { bg:'var(--bg-el)',   color:'var(--t2)',  border:'var(--b1)' },
    ghost:     { bg:'transparent',    color:'var(--t2)',  border:'transparent' },
    danger:    { bg:'var(--red-bg)',  color:'var(--red)', border:'var(--red)40' },
  }[variant];

  return (
    <button type={type} onClick={onClick} disabled={disabled||loading} className={className}
      style={{
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7,
        padding:S.p, fontSize:S.fs, borderRadius:S.r,
        fontFamily:'var(--font)', fontWeight:700, cursor:'pointer', userSelect:'none',
        background:V.bg, color:V.color, border:`1.5px solid ${V.border}`,
        width:fullWidth?'100%':undefined,
        opacity:(disabled||loading)?.4:1,
        pointerEvents:(disabled||loading)?'none':'auto',
        transition:'all .15s', outline:'none', letterSpacing:'-.01em',
      }}
      onMouseEnter={e=>{ if(variant==='primary') e.currentTarget.style.filter='brightness(1.08)'; else e.currentTarget.style.background='var(--bg-hover)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.filter=''; e.currentTarget.style.background=V.bg; }}
      onMouseDown={e=>e.currentTarget.style.transform='scale(.98)'}
      onMouseUp={e=>e.currentTarget.style.transform=''}
    >
      {loading && <span style={{width:13,height:13,border:'2px solid currentColor',borderTopColor:'transparent',borderRadius:'50%',animation:'spin .7s linear infinite',flexShrink:0}} />}
      {children}
    </button>
  );
};
