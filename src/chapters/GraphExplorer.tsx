import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Crosshair, Minus, Plus, Search } from 'lucide-react';
import { Reveal, StatusBadge, Tone } from '../ui/primitives';
import { HeldOutQuery, KnowledgeBaseRule } from '../types';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  ruleIds: string[];
  root?: boolean;
}

const NODES: GraphNode[] = [
  { id: 'scholarship', label: 'Scholarship', x: 390, y: 65, ruleIds: ['POL-R01'] },
  { id: 'special', label: 'Special Conditions', x: 205, y: 78, ruleIds: ['POL-R24', 'POL-R25', 'POL-R26'] },
  { id: 'eligibility', label: 'Eligibility', x: 160, y: 195, ruleIds: ['POL-R01', 'POL-R02', 'POL-R03'] },
  { id: 'exclusions', label: 'Exclusions', x: 90, y: 330, ruleIds: ['POL-R21', 'POL-R22', 'POL-R23'] },
  { id: 'documents', label: 'Documents', x: 200, y: 455, ruleIds: ['POL-R12', 'POL-R13', 'POL-R14', 'POL-R15'] },
  { id: 'attendance', label: 'Attendance', x: 385, y: 505, ruleIds: ['POL-R10', 'POL-R11'] },
  { id: 'academic', label: 'Academic Performance', x: 570, y: 455, ruleIds: ['POL-R07', 'POL-R08', 'POL-R09'] },
  { id: 'land', label: 'Land Ownership', x: 680, y: 330, ruleIds: ['POL-R05'] },
  { id: 'income', label: 'Family Income', x: 615, y: 195, ruleIds: ['POL-R04', 'POL-R06'] },
  { id: 'renewal', label: 'Renewal', x: 490, y: 78, ruleIds: ['POL-R16', 'POL-R17', 'POL-R18'] },
  { id: 'student', label: 'Student', x: 390, y: 270, ruleIds: [], root: true },
];

const EDGES: [string, string][] = [
  ['student', 'scholarship'],
  ['student', 'eligibility'],
  ['student', 'income'],
  ['student', 'academic'],
  ['student', 'attendance'],
  ['student', 'documents'],
  ['student', 'renewal'],
  ['student', 'exclusions'],
  ['student', 'special'],
  ['income', 'land'],
  ['scholarship', 'eligibility'],
  ['scholarship', 'renewal'],
];

type NodeStatus = 'verified' | 'partial' | 'missing';

interface Props {
  cqKB: KnowledgeBaseRule[];
  adHocKB: KnowledgeBaseRule[];
  policyRules: { id: string; conditions: string[] }[];
  heldOutQueries: HeldOutQuery[];
}

export function GraphExplorer({ cqKB, adHocKB, policyRules, heldOutQueries }: Props) {
  const [mode, setMode] = useState<'CQ' | 'ADHOC'>('CQ');
  const [selectedId, setSelectedId] = useState('income');
  const [search, setSearch] = useState('');
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const stageRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number; moved: boolean } | null>(null);
  const reduce = useReducedMotion();

  const kb = mode === 'CQ' ? cqKB : adHocKB;
  const kbMap = useMemo(() => new Map(kb.map((r) => [r.ruleId, r])), [kb]);
  const policyMap = useMemo(() => new Map(policyRules.map((r) => [r.id, r])), [policyRules]);

  const statusFor = (node: GraphNode): NodeStatus => {
    if (node.root) return 'verified';
    if (node.ruleIds.length === 0) return 'verified';
    let missing = 0;
    let partial = 0;
    for (const rid of node.ruleIds) {
      const r = kbMap.get(rid);
      if (!r) missing++;
      else if (r.status === 'partially_represented' || (r.omittedConditions && r.omittedConditions.length > 0)) partial++;
    }
    if (missing > 0 && partial === 0 && missing === node.ruleIds.length) return 'missing';
    if (missing > 0 || partial > 0) return 'partial';
    return 'verified';
  };

  const colorFor = (s: NodeStatus) => (s === 'verified' ? '#58765D' : s === 'partial' ? '#C08A37' : '#A2433B');

  const selected = NODES.find((n) => n.id === selectedId)!;
  const selectedStatus = statusFor(selected);
  const presentRules = selected.ruleIds.map((id) => kbMap.get(id)).filter(Boolean) as KnowledgeBaseRule[];
  const missingRules = selected.ruleIds.filter((id) => !kbMap.has(id));
  const representedConditions = presentRules.flatMap((r) => r.extractedConditions);
  const missingConditions = [
    ...presentRules.flatMap((r) => r.omittedConditions ?? []),
    ...missingRules.flatMap((id) => policyMap.get(id)?.conditions ?? []),
  ];
  const relatedQueries = heldOutQueries.filter((q) => q.relevantRuleIds.some((id) => selected.ruleIds.includes(id)));

  const searchMatches = search.trim()
    ? NODES.filter((n) => n.label.toLowerCase().includes(search.trim().toLowerCase()))
    : [];

  const fit = () => {
    setScale(1);
    setTx(0);
    setTy(0);
  };

  const zoom = (factor: number) => {
    setScale((s) => Math.min(2.6, Math.max(0.55, s * factor)));
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const vx = ((e.clientX - rect.left) / rect.width) * 760;
      const vy = ((e.clientY - rect.top) / rect.height) * 560;
      setScale((s) => {
        const next = Math.min(2.6, Math.max(0.55, s * (e.deltaY < 0 ? 1.12 : 0.89)));
        const ratio = next / s;
        setTx((t) => vx - (vx - t) * ratio);
        setTy((t) => vy - (vy - t) * ratio);
        return next;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, tx, ty, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const dx = ((e.clientX - drag.current.x) / rect.width) * 760;
    const dy = ((e.clientY - drag.current.y) / rect.height) * 560;
    if (Math.abs(e.clientX - drag.current.x) + Math.abs(e.clientY - drag.current.y) > 4) drag.current.moved = true;
    setTx(drag.current.tx + dx);
    setTy(drag.current.ty + dy);
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const focusNode = (node: GraphNode) => {
    setSelectedId(node.id);
    setSearch('');
    setScale(1.35);
    setTx(390 - node.x * 1.35);
    setTy(280 - node.y * 1.35);
  };

  const tone: Tone = selectedStatus === 'verified' ? 'green' : selectedStatus === 'partial' ? 'amber' : 'red';

  return (
    <div className="mt-24">
      <Reveal>
        <div className="max-w-3xl">
          <div className="eyebrow mb-4">Interactive knowledge graph</div>
          <h3 className="sub-title">Explore the semantic structure of each knowledge base.</h3>
          <p className="body-sm mt-4">
            Switch modes to watch conditions change colour. Drag to pan, scroll to zoom, search for a concept, or click
            any node to inspect its rules and affected queries.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="panel mt-8 overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--paper)] p-1">
              <button
                onClick={() => setMode('CQ')}
                className={`rounded-full px-5 py-2.5 text-[15px] font-semibold transition-all ${mode === 'CQ' ? 'bg-[var(--accent)] text-white' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'}`}
              >
                CQ-Guided KB
              </button>
              <button
                onClick={() => setMode('ADHOC')}
                className={`rounded-full px-5 py-2.5 text-[15px] font-semibold transition-all ${mode === 'ADHOC' ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'}`}
              >
                Ad Hoc KB
              </button>
            </div>
            <div className="relative w-full lg:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-2)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a concept…"
                className="field !py-2.5 !pl-10 !text-[15px]"
              />
              {searchMatches.length > 0 && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-lg">
                  {searchMatches.map((n) => (
                    <button key={n.id} onClick={() => focusNode(n)} className="block w-full px-4 py-2.5 text-left text-[15px] hover:bg-[var(--muted)]">
                      {n.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.55fr_0.85fr]">
            <div className="relative p-4 sm:p-5">
              <div className="graph-stage" style={{ aspectRatio: '760 / 560' }}>
                <svg
                  ref={stageRef}
                  viewBox="0 0 760 560"
                  className="h-full w-full"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
                    {EDGES.map(([a, b], i) => {
                      const s = NODES.find((n) => n.id === a)!;
                      const t = NODES.find((n) => n.id === b)!;
                      const active = selectedId === a || selectedId === b;
                      return (
                        <g key={i}>
                          <path
                            d={`M ${s.x} ${s.y} C ${(s.x + t.x) / 2} ${(s.y + t.y) / 2 - 30}, ${(s.x + t.x) / 2} ${(s.y + t.y) / 2 + 30}, ${t.x} ${t.y}`}
                            fill="none"
                            stroke={active ? '#58765D' : '#d1d6c9'}
                            strokeWidth={active ? 2.4 : 1.4}
                            strokeDasharray={active ? 'none' : '5 5'}
                          />
                          {!reduce && active && (
                            <motion.circle
                              r="3.5"
                              fill="#58765D"
                              animate={{ offsetDistance: ['0%', '100%'] }}
                              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                              style={{ offsetPath: `path("M ${s.x} ${s.y} C ${(s.x + t.x) / 2} ${(s.y + t.y) / 2 - 30}, ${(s.x + t.x) / 2} ${(s.y + t.y) / 2 + 30}, ${t.x} ${t.y}")` } as React.CSSProperties}
                            />
                          )}
                        </g>
                      );
                    })}

                    {NODES.map((n) => {
                      const status = statusFor(n);
                      const c = colorFor(status);
                      const active = selectedId === n.id;
                      const r = n.root ? 30 : 22;
                      return (
                        <g
                          key={n.id}
                          className="cursor-pointer"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => {
                            if (!drag.current?.moved) setSelectedId(n.id);
                          }}
                        >
                          {active && <circle cx={n.x} cy={n.y} r={r + 9} fill={c} opacity="0.12" />}
                          <circle cx={n.x} cy={n.y} r={r} fill="#fff" stroke={c} strokeWidth={active ? 3 : 2} />
                          <circle cx={n.x} cy={n.y} r={n.root ? 9 : 6} fill={c} />
                          <text
                            x={n.x}
                            y={n.y + r + 18}
                            textAnchor="middle"
                            fontSize="12.5"
                            fontWeight={active ? 700 : 500}
                            fill="var(--ink)"
                            fontFamily="Inter, sans-serif"
                            className="select-none"
                          >
                            {n.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>

                <div className="absolute bottom-3 left-3 flex gap-1.5 rounded-full border border-[var(--border)] bg-white/95 p-1 shadow-sm">
                  <button onClick={() => zoom(1.2)} className="rounded-full p-2 hover:bg-[var(--muted)]" aria-label="Zoom in"><Plus size={16} /></button>
                  <button onClick={() => zoom(0.83)} className="rounded-full p-2 hover:bg-[var(--muted)]" aria-label="Zoom out"><Minus size={16} /></button>
                  <button onClick={fit} className="rounded-full p-2 hover:bg-[var(--muted)]" aria-label="Fit to screen"><Crosshair size={16} /></button>
                </div>
                <div className="mono absolute right-3 top-3 rounded-full border border-[var(--border)] bg-white/90 px-3 py-1 text-[11px] text-[var(--ink-2)]">
                  {Math.round(scale * 100)}%
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
                <div className="flex flex-wrap gap-5 text-[13px] text-[var(--ink-2)]">
                  <span className="flex items-center gap-2"><span className="dot dot-green" /> Fully represented</span>
                  <span className="flex items-center gap-2"><span className="dot dot-amber" /> Partially represented</span>
                  <span className="flex items-center gap-2"><span className="dot dot-red" /> Missing</span>
                </div>
                <span className="mono text-[11px] text-[var(--ink-2)]">{NODES.length} concepts · {EDGES.length} relations</span>
              </div>
            </div>

            <aside className="border-t border-[var(--border)] bg-[var(--paper)] p-6 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow !text-[11px]">Node inspector</span>
                <StatusBadge tone={tone}>
                  {selectedStatus === 'verified' ? 'Fully represented' : selectedStatus === 'partial' ? 'Partial' : 'Missing'}
                </StatusBadge>
              </div>
              <h4 className="mt-4 text-[24px] font-semibold">{selected.label}</h4>

              <InspectorSection title="Associated rule IDs">
                <div className="flex flex-wrap gap-2">
                  {selected.ruleIds.length ? (
                    selected.ruleIds.map((id) => (
                      <span key={id} className="mono rounded bg-white px-2 py-1 text-[12px] text-[var(--accent-deep)] border border-[var(--border)]">{id}</span>
                    ))
                  ) : (
                    <span className="text-[15px] text-[var(--ink-2)]">Root concept — no direct rule</span>
                  )}
                </div>
              </InspectorSection>

              <InspectorSection title="Represented conditions">
                <ConditionList items={representedConditions} empty="No conditions represented in this base." />
              </InspectorSection>

              <InspectorSection title="Missing conditions">
                <ConditionList items={missingConditions} empty="None — condition chain complete." tone="red" />
              </InspectorSection>

              <InspectorSection title="Related test queries">
                {relatedQueries.length ? (
                  <div className="space-y-2">
                    {relatedQueries.map((q) => (
                      <div key={q.id} className="rounded-lg border border-[var(--border)] bg-white p-3">
                        <div className="mono text-[11px] text-[var(--accent)] mb-1">{q.id} · {q.category}</div>
                        <p className="text-[14px] leading-snug text-[var(--ink-2)]">{q.query}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[15px] text-[var(--ink-2)]">No held-out query targets this concept directly.</p>
                )}
              </InspectorSection>
            </aside>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function InspectorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="eyebrow mb-3 !text-[11px]">{title}</div>
      {children}
    </div>
  );
}

function ConditionList({ items, empty, tone = 'green' }: { items: string[]; empty: string; tone?: 'green' | 'red' }) {
  if (!items.length) return <p className="text-[15px] text-[var(--ink-2)]">{empty}</p>;
  return (
    <ul className="space-y-2">
      {items.map((c, i) => (
        <li key={i} className={`flex gap-2 text-[14px] leading-snug ${tone === 'red' ? 'text-[var(--red)]' : 'text-[var(--ink-2)]'}`}>
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone === 'red' ? 'bg-[var(--red)]' : 'bg-[var(--accent)]'}`} />
          {c}
        </li>
      ))}
    </ul>
  );
}
