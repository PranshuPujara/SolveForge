export const Card = ({ children, className='', style={} }) => (
  <div className={className} style={{ background:'var(--bg-card)', border:'1.5px solid var(--b1)', borderRadius:12, padding:'16px 18px', ...style }}>
    {children}
  </div>
);
export const SectionLabel = ({ children }) => <div className="lbl" style={{ marginBottom:10 }}>{children}</div>;
