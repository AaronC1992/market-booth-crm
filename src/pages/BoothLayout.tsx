import { useState } from 'react';
import Layout from '../components/layout/Layout';
import BoothDetail from '../components/booths/BoothDetail';
import { booths as initialBooths } from '../data/mockData';
import type { Booth, BoothStatus } from '../types';
import { useDark } from '../context/DarkModeContext';

// â”€â”€ Status fill / border / text colors for booth cells â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const S_BG: Record<BoothStatus, string> = {
  open:        '#86efac',
  booked:      '#93c5fd',
  reserved:    '#fde68a',
  past_due:    '#fca5a5',
  maintenance: '#e2e8f0',
};
const S_BD: Record<BoothStatus, string> = {
  open:        '#16a34a',
  booked:      '#2563eb',
  reserved:    '#d97706',
  past_due:    '#dc2626',
  maintenance: '#94a3b8',
};
const S_TX: Record<BoothStatus, string> = {
  open:        '#14532d',
  booked:      '#1e3a8a',
  reserved:    '#78350f',
  past_due:    '#7f1d1d',
  maintenance: '#475569',
};

const LEGEND: { s: BoothStatus; label: string }[] = [
  { s: 'open',        label: 'Available'    },
  { s: 'booked',      label: 'Booked'       },
  { s: 'reserved',    label: 'Reserved'     },
  { s: 'past_due',    label: 'Past Due'     },
  { s: 'maintenance', label: 'Maintenance'  },
];

// â”€â”€ Tiny booth cell (number only, status-colored) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Cell({
  b, w = 40, h = 28, onClick,
}: { b: Booth; w?: number; h?: number; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      title={b.vendorName ? `${b.number} â€” ${b.vendorName}` : b.number}
      style={{
        width: w, height: h,
        backgroundColor: S_BG[b.status],
        border: `1px solid ${S_BD[b.status]}`,
        color: S_TX[b.status],
        fontSize: 10, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', userSelect: 'none', flexShrink: 0,
        letterSpacing: '-0.02em',
      }}
    >
      {b.number}
    </div>
  );
}

// â”€â”€ A horizontal row of booth cells â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BRow({
  booths, onClick, dark,
}: { booths: Booth[]; onClick: (b: Booth) => void; dark: boolean }) {
  return (
    <div style={{
      display: 'flex', gap: 1.5, padding: '1.5px',
      backgroundColor: dark ? '#1e293b' : '#f8fafc',
    }}>
      {booths.map(b => <Cell key={b.id} b={b} onClick={() => onClick(b)} />)}
    </div>
  );
}

// â”€â”€ Back-to-back cluster: two rows sharing a thin spine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Cluster({
  r1, r2, onClick, dark,
}: { r1: Booth[]; r2: Booth[]; onClick: (b: Booth) => void; dark: boolean }) {
  return (
    <div style={{
      border: `1.5px solid ${dark ? '#374151' : '#6b7280'}`,
      display: 'inline-flex', flexDirection: 'column',
    }}>
      <BRow booths={r1} onClick={onClick} dark={dark} />
      <div style={{ height: 1, backgroundColor: dark ? '#4b5563' : '#9ca3af' }} />
      <BRow booths={r2} onClick={onClick} dark={dark} />
    </div>
  );
}

// â”€â”€ Vertical text label (for room labels on walls) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function WallLabel({ text, dark }: { text: string; dark: boolean }) {
  return (
    <div style={{
      writingMode: 'vertical-rl',
      transform: 'rotate(180deg)',
      fontSize: 9, fontWeight: 800,
      textTransform: 'uppercase', letterSpacing: '0.14em',
      color: dark ? '#94a3b8' : '#6b7280',
      padding: '6px 0',
    }}>
      {text}
    </div>
  );
}

// â”€â”€ Horizontal aisle strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HAisle({ label, dark }: { label: string; dark: boolean }) {
  return (
    <div style={{
      width: '100%', height: 18,
      backgroundColor: dark ? '#0f172a' : '#e5e7eb',
      borderTop: `1px solid ${dark ? '#374151' : '#d1d5db'}`,
      borderBottom: `1px solid ${dark ? '#374151' : '#d1d5db'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{
        fontSize: 7, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.12em',
        color: dark ? '#4b5563' : '#9ca3af',
      }}>{label}</span>
    </div>
  );
}

// â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function BoothLayout() {
  const { dark } = useDark();
  const [booths, setBooths] = useState<Booth[]>(initialBooths);
  const [selected, setSelected] = useState<Booth | null>(null);

  const handleStatusChange = (boothId: string, newStatus: BoothStatus) => {
    setBooths(prev => prev.map(b => b.id === boothId ? { ...b, status: newStatus } : b));
    setSelected(prev => prev?.id === boothId ? { ...prev, status: newStatus } : prev);
  };

  const g = (id: string) => booths.find(b => b.id === id)!;
  const click = (b: Booth) => setSelected(b);

  // Structural color tokens
  const wall    = dark ? '#475569' : '#334155';
  const floor   = dark ? '#0b1120' : '#f0ede6';
  const panel   = dark ? '#1e293b' : '#ffffff';
  const roomBg  = dark ? '#1a2535' : '#f1f5f9';
  const roomBdr = dark ? '#374151' : '#94a3b8';
  const lblClr  = dark ? '#94a3b8' : '#475569';
  const panelBg = dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';

  return (
    <Layout title="Booth Layout" subtitle="Interactive floor plan â€” click any booth to view details">
      {selected && (
        <BoothDetail booth={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
      )}

      {/* â”€â”€ Legend â”€â”€ */}
      <div className={`rounded-xl border p-3 mb-4 shadow-sm ${panelBg}`}>
        <div className="flex flex-wrap gap-x-5 gap-y-2 items-center">
          <span className={`text-[11px] font-bold uppercase tracking-wider shrink-0 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Status
          </span>
          {LEGEND.map(({ s, label }) => (
            <div key={s} className="flex items-center gap-1.5">
              <span style={{
                width: 14, height: 14, display: 'inline-block', borderRadius: 2,
                backgroundColor: S_BG[s], border: `1px solid ${S_BD[s]}`,
              }} />
              <span className={`text-xs ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
            </div>
          ))}
          <span className={`ml-auto text-[11px] italic ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
            Click any booth for details
          </span>
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          FLOOR PLAN
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className={`rounded-xl border-2 shadow-xl overflow-x-auto ${dark ? 'border-slate-600' : 'border-slate-400'}`}>
        <div style={{
          backgroundColor: floor,
          padding: 14,
          minWidth: 680,
          fontFamily: '"Courier New", Courier, monospace',
        }}>
          {/* â”€â”€ Building outer wall â”€â”€ */}
          <div style={{ border: `4px solid ${wall}`, backgroundColor: panel }}>

            {/* â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” */}
            {/* â”‚  ROW 1 â€” building title / header                       â”‚ */}
            {/* â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ */}
            <div style={{ display: 'flex', borderBottom: `2px solid ${wall}` }}>
              <div style={{ flex: 1, padding: '8px 14px', borderRight: `2px solid ${wall}` }}>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em', color: dark ? '#e2e8f0' : '#0f172a' }}>
                  Sunshine Flea Market
                </div>
                <div style={{ fontSize: 10, color: lblClr, marginTop: 2 }}>
                  52 Booths &nbsp;Â·&nbsp; Indoor + Outdoor &nbsp;Â·&nbsp; Interactive Floor Plan
                </div>
              </div>
              {/* CONCESSION label (right wall) */}
              <div style={{
                width: 50, backgroundColor: roomBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <WallLabel text="Concession" dark={dark} />
              </div>
            </div>

            {/* â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” */}
            {/* â”‚  ROW 2 â€” entrance strip                                â”‚ */}
            {/* â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ */}
            <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: `2px solid ${wall}` }}>
              {/* Front-wall booths */}
              <div style={{
                padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 3,
                borderRight: `2px solid ${wall}`,
              }}>
                <span style={{
                  fontSize: 8, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: lblClr, marginRight: 5, whiteSpace: 'nowrap',
                }}>Front Wall</span>
                {['b-fw1', 'b-fw2', 'b-fw3', 'b-fw4'].map(id => (
                  <Cell key={id} b={g(id)} onClick={() => click(g(id))} />
                ))}
              </div>
              {/* Check-in area */}
              <div style={{
                flex: 1,
                backgroundColor: dark ? 'rgba(30,58,138,0.15)' : '#eff6ff',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '10px 20px',
                borderRight: `2px solid ${wall}`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: dark ? '#93c5fd' : '#1d4ed8' }}>
                  Check In Area
                </div>
                <div style={{ fontSize: 9, color: dark ? '#60a5fa' : '#3b82f6', marginTop: 3 }}>
                  Management Office
                </div>
              </div>
              {/* MEN restroom */}
              <div style={{
                width: 48, backgroundColor: roomBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <WallLabel text="MEN" dark={dark} />
              </div>
            </div>

            {/* â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” */}
            {/* â”‚  ROW 3 â€” main floor (booth clusters + rooms)           â”‚ */}
            {/* â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ */}
            <div style={{ display: 'flex', alignItems: 'stretch' }}>

              {/* â”€â”€ Interior cluster area â”€â”€ */}
              <div style={{
                flex: 1, padding: '14px 16px',
                display: 'flex', gap: 0, alignItems: 'flex-start',
              }}>
                {/* Column 1: Sections Aâ€“D */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: lblClr, marginBottom: 6 }}>
                    Section Aâ€“D
                  </div>
                  {/* A/B back-to-back */}
                  <Cluster
                    r1={['b-a1', 'b-a2', 'b-a3', 'b-a4'].map(g)}
                    r2={['b-b1', 'b-b2', 'b-b3', 'b-b4'].map(g)}
                    onClick={click} dark={dark}
                  />
                  <HAisle label="Aisle" dark={dark} />
                  {/* C/D back-to-back */}
                  <Cluster
                    r1={['b-c1', 'b-c2', 'b-c3', 'b-c4'].map(g)}
                    r2={['b-d1', 'b-d2', 'b-d3', 'b-d4'].map(g)}
                    onClick={click} dark={dark}
                  />
                </div>

                {/* Vertical main aisle between column groups */}
                <div style={{
                  width: 28, alignSelf: 'stretch', margin: '0 12px',
                  backgroundColor: dark ? '#0f172a' : '#e5e7eb',
                  borderLeft: `1px solid ${dark ? '#374151' : '#d1d5db'}`,
                  borderRight: `1px solid ${dark ? '#374151' : '#d1d5db'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                    fontSize: 7, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.12em', color: dark ? '#4b5563' : '#9ca3af',
                  }}>Main Aisle</span>
                </div>

                {/* Column 2: Sections Eâ€“H */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: lblClr, marginBottom: 6 }}>
                    Section Eâ€“H
                  </div>
                  {/* E/F back-to-back */}
                  <Cluster
                    r1={['b-e1', 'b-e2', 'b-e3', 'b-e4'].map(g)}
                    r2={['b-f1', 'b-f2', 'b-f3', 'b-f4'].map(g)}
                    onClick={click} dark={dark}
                  />
                  <HAisle label="Aisle" dark={dark} />
                  {/* G/H back-to-back */}
                  <Cluster
                    r1={['b-g1', 'b-g2', 'b-g3', 'b-g4'].map(g)}
                    r2={['b-h1', 'b-h2', 'b-h3', 'b-h4'].map(g)}
                    onClick={click} dark={dark}
                  />
                </div>
              </div>

              {/* â”€â”€ Corner booths + WOMEN â”€â”€ */}
              <div style={{
                display: 'flex', alignItems: 'stretch',
                borderLeft: `2px solid ${wall}`,
              }}>
                {/* Corner column */}
                <div style={{
                  width: 78, padding: '10px 8px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 6,
                }}>
                  <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: lblClr, marginBottom: 2 }}>
                    Corner
                  </div>
                  {['b-cb1', 'b-cb2', 'b-cb3', 'b-cb4'].map(id => (
                    <Cell key={id} b={g(id)} w={56} h={40} onClick={() => click(g(id))} />
                  ))}
                </div>
                {/* WOMEN restroom */}
                <div style={{
                  width: 48, backgroundColor: roomBg,
                  borderLeft: `1px solid ${roomBdr}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <WallLabel text="WOMEN" dark={dark} />
                </div>
              </div>

            </div>{/* end row 3 */}

            {/* â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” */}
            {/* â”‚  SOUTH AISLE                                           â”‚ */}
            {/* â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ */}
            <div style={{
              borderTop: `2px solid ${wall}`,
              borderBottom: `2px solid ${wall}`,
              height: 26,
              backgroundColor: dark ? '#0f172a' : '#e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.16em', color: dark ? '#4b5563' : '#94a3b8',
              }}>â—„  South Aisle  â–º</span>
            </div>

            {/* â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” */}
            {/* â”‚  ROW 4 â€” food court + outdoor + ramp                   â”‚ */}
            {/* â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ */}
            <div style={{ display: 'flex', alignItems: 'stretch' }}>

              {/* Food court */}
              <div style={{ flex: 1, padding: '10px 14px', borderRight: `2px solid ${wall}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: dark ? '#fbbf24' : '#b45309', marginBottom: 7 }}>
                  â˜… Food Court
                </div>
                <div style={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
                  {['b-fc1', 'b-fc2', 'b-fc3', 'b-fc4'].map(id => (
                    <Cell key={id} b={g(id)} w={54} h={44} onClick={() => click(g(id))} />
                  ))}
                  {/* Seating */}
                  <div style={{
                    flex: 1, marginLeft: 8, minHeight: 44,
                    border: `1.5px dashed ${roomBdr}`,
                    backgroundColor: dark ? '#0f172a' : '#fffbeb',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: dark ? '#78716c' : '#a16207' }}>
                      Seating Area
                    </span>
                    <span style={{ fontSize: 7, color: dark ? '#44403c' : '#d4aa55', marginTop: 2 }}>~30 seats</span>
                  </div>
                </div>
              </div>

              {/* Outdoor spots */}
              <div style={{ padding: '10px 14px', borderRight: `2px solid ${wall}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: lblClr, marginBottom: 7 }}>
                  Outdoor Spots
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {['b-os1', 'b-os2'].map(id => (
                      <Cell key={id} b={g(id)} onClick={() => click(g(id))} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {['b-os3', 'b-os4'].map(id => (
                      <Cell key={id} b={g(id)} onClick={() => click(g(id))} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Ramp / exit */}
              <div style={{
                flex: 1,
                backgroundColor: roomBg,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: dark ? '#6b7280' : '#94a3b8' }}>
                  RAMP
                </div>
                <div style={{ fontSize: 24, color: dark ? '#374151' : '#d1d5db', lineHeight: 1, marginTop: 4 }}>â†’</div>
                <div style={{ fontSize: 8, color: dark ? '#4b5563' : '#cbd5e1', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Exit / Loading
                </div>
              </div>

            </div>{/* end row 4 */}

          </div>{/* end building */}
        </div>
      </div>
    </Layout>
  );
}
