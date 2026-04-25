import { useState } from 'react';
export const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position:'relative', display:'inline-flex' }}
      onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show && <span style={{ position:'absolute', bottom:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)', zIndex:99,
        background:'var(--bg-press)', border:'1px solid var(--b2)', borderRadius:6, padding:'5px 10px',
        fontSize:11, color:'var(--t1)', whiteSpace:'nowrap', pointerEvents:'none', fontFamily:'var(--mono)', boxShadow:'0 4px 16px #0008' }}>
        {text}
      </span>}
    </span>
  );
};
