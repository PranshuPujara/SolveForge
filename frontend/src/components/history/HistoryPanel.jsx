import { useState } from 'react';
import { Trash2, AlertCircle, ExternalLink, Swords, Clock } from 'lucide-react';
import { getHistory, clearHistory } from '../../utils/localStorage';

/* ── URL builder ─────────────────────────────────── */
const buildUrl = (item) => {
  if (item.includes(':')) {
    const [platform, ...rest] = item.split(':');
    const id = rest.join(':');
    if (platform === 'codeforces') {
      const parts = id.split('-');
      if (parts.length >= 2) {
        const idx = parts[parts.length - 1];
        const contestId = parts.slice(0, -1).join('-');
        return `https://codeforces.com/problemset/problem/${contestId}/${idx}`;
      }
    }
  }
  const parts = item.split('-');
  if (parts.length >= 2) {
    const idx = parts[parts.length - 1];
    const cid = parts.slice(0, -1).join('-');
    return `https://codeforces.com/problemset/problem/${cid}/${idx}`;
  }
  return null;
};

const getDisplayId = (item) => item.includes(':') ? item.split(':').slice(1).join(':') : item;
const getPlatform  = (item) => item.includes(':') ? item.split(':')[0] : 'codeforces';

const PLAT_COLOR = { codeforces: 'var(--blue)', leetcode: 'var(--orange)', gfg: 'var(--green)' };

/* ── Animated re-attempt button ─────────────────── */
const ReattemptButton = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(true);
    onClick();
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setClicked(false); }}
      title="Re-attempt this problem"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: hovered ? 6 : 0,
        padding: hovered ? '5px 12px 5px 8px' : '5px 8px',
        borderRadius: 8,
        flexShrink: 0,
        cursor: 'pointer',
        background: clicked
          ? 'var(--primary)'
          : hovered
            ? 'var(--primary-bg)'
            : 'transparent',
        border: `1px solid ${hovered || clicked ? 'var(--primary)' : 'var(--b1)'}`,
        color: clicked ? '#000' : hovered ? 'var(--primary)' : 'var(--t3)',
        transition: 'all .2s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: clicked ? 'scale(0.92)' : hovered ? 'scale(1.04)' : 'scale(1)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <Swords
        size={13}
        strokeWidth={2}
        style={{
          transition: 'transform .25s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: clicked ? 'rotate(-20deg) scale(1.1)' : 'rotate(0)',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontFamily: 'var(--mono)',
          fontWeight: 700,
          letterSpacing: '0.02em',
          maxWidth: hovered ? 80 : 0,
          opacity: hovered ? 1 : 0,
          transition: 'all .2s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
        }}
      >
        Retry
      </span>
    </button>
  );
};

/* ── Single history row ──────────────────────────── */
const HistoryRow = ({ item, index, onReattempt }) => {
  const [hovered, setHovered] = useState(false);
  const url = buildUrl(item);
  const displayId = getDisplayId(item);
  const platform = getPlatform(item);
  const pc = PLAT_COLOR[platform] || 'var(--t3)';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 9,
        background: hovered ? 'var(--bg-hover)' : 'transparent',
        transition: 'all .15s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Clickable problem link — the main row area */}
      <button
        type="button"
        onClick={() => { if (url) window.open(url, '_blank', 'noopener,noreferrer'); }}
        disabled={!url}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: 0,
          borderRadius: 7,
          cursor: url ? 'pointer' : 'default',
          background: 'transparent',
          border: 'none',
          textAlign: 'left',
          flex: 1,
          minWidth: 0,
        }}
      >
        <span style={{
          fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--mono)',
          width: 24, textAlign: 'right', flexShrink: 0,
        }}>
          {index + 1}
        </span>
        {/* Platform dot */}
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: pc, flexShrink: 0,
          boxShadow: hovered ? `0 0 6px ${pc}` : 'none',
          transition: 'box-shadow .2s',
        }} />
        <span style={{
          fontSize: 12.5, color: hovered ? 'var(--t1)' : 'var(--t2)',
          fontFamily: 'var(--mono)', fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', flex: 1,
          transition: 'color .15s',
        }}>
          {displayId}
        </span>
        {url && (
          <ExternalLink
            size={12} strokeWidth={1.8} color="var(--t3)"
            style={{ flexShrink: 0, opacity: hovered ? 1 : 0.5, transition: 'opacity .15s' }}
          />
        )}
      </button>

      {/* Re-attempt button — sits to the right of each row */}
      {onReattempt && (
        <ReattemptButton onClick={() => onReattempt(item)} />
      )}
    </div>
  );
};

/* ── HistoryPanel ─────────────────────────────────── */
export const HistoryPanel = ({ onClear, onReattempt, forceOpen = false }) => {
  const [open, setOpen] = useState(forceOpen);
  const [confirm, setConfirm] = useState(false);

  const history = getHistory();
  const pct = Math.min((history.length / 200) * 100, 100);
  const barColor = pct > 80 ? 'var(--red)' : pct > 50 ? 'var(--yellow)' : 'var(--primary)';

  const doClear = () => {
    if (!confirm) { setConfirm(true); return; }
    clearHistory();
    onClear?.();
    setConfirm(false);
    if (!forceOpen) setOpen(false);
  };

  const inner = (
    <>
      {history.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '28px 16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <Clock size={28} strokeWidth={1.4} color="var(--t3)" style={{ opacity: 0.5 }} />
          <p style={{
            fontSize: 12, color: 'var(--t3)',
            fontFamily: 'var(--mono)', lineHeight: 1.5,
          }}>
            No history yet — start picking problems!
          </p>
        </div>
      ) : (
        <>
          {/* Legend row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 8, padding: '0 10px',
          }}>
            <p style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
              Click to open · hover for retry
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {Object.entries(PLAT_COLOR).map(([name, color]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
                  <span style={{
                    fontSize: 9, color: 'var(--t3)', fontFamily: 'var(--mono)',
                    textTransform: 'capitalize',
                  }}>
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable list */}
          <div style={{
            maxHeight: forceOpen ? 'none' : 200,
            overflowY: forceOpen ? 'visible' : 'auto',
            display: 'flex', flexDirection: 'column', gap: 1,
          }}>
            {history.map((item, i) => (
              <HistoryRow key={item} item={item} index={i} onReattempt={onReattempt} />
            ))}
          </div>

          {/* Clear button */}
          <button type="button" onClick={doClear} style={{
            marginTop: 12, padding: '8px', borderRadius: 8, cursor: 'pointer',
            fontSize: 12, fontFamily: 'var(--mono)', width: '100%',
            background: confirm ? 'var(--red-bg)' : 'transparent',
            border: `1px solid ${confirm ? 'var(--red)60' : 'var(--b0)'}`,
            color: confirm ? 'var(--red)' : 'var(--t3)',
            transition: 'all .15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            {confirm
              ? <><AlertCircle size={14} strokeWidth={2} />Confirm clear</>
              : <><Trash2 size={14} strokeWidth={1.8} />Clear History</>
            }
          </button>
        </>
      )}
    </>
  );

  if (forceOpen) return inner;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>{history.length}/200</span>
          <div style={{ width: 64, height: 3, background: 'var(--bg-press)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: barColor, borderRadius: 99,
              transition: 'width .4s',
            }} />
          </div>
        </div>
        <button type="button" onClick={() => setOpen(v => !v)}
          style={{
            fontSize: 11, color: 'var(--t3)', cursor: 'pointer',
            background: 'none', border: 'none', fontFamily: 'var(--mono)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
        >
          {open ? 'hide ▲' : 'view ▼'}
        </button>
      </div>
      {open && <div className="anim-in">{inner}</div>}
    </div>
  );
};
