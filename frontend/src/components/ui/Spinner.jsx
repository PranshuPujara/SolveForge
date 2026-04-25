export const Spinner = ({ size=20, color='var(--primary)' }) => (
  <div style={{
    width:size,
    height:size,
    border:`2.5px solid ${color}25`,
    borderTopColor:color,
    borderRadius:'50%',
    animation:'spin 0.8s linear infinite',
    flexShrink:0,
  }} />
);
