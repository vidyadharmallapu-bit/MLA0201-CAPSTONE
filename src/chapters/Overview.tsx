import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, Play, ScanSearch } from 'lucide-react';
import { CountUp, Reveal, Stagger, StaggerItem } from '../ui/primitives';

interface OverviewProps {
  onExplore: () => void;
  onDemo: () => void;
}

const HERO_NODES = [
  { id: 'scholarship', label: 'Scholarship', x: 280, y: 78, r: 34 },
  { id: 'eligibility', label: 'Eligibility', x: 112, y: 194, r: 27 },
  { id: 'income', label: 'Income', x: 448, y: 186, r: 27 },
  { id: 'academic', label: 'Academic Rules', x: 280, y: 282, r: 30 },
  { id: 'attendance', label: 'Attendance', x: 122, y: 410, r: 27 },
  { id: 'renewal', label: 'Renewal', x: 438, y: 414, r: 27 },
];

const HERO_EDGES: [string, string][] = [
  ['scholarship', 'eligibility'],
  ['scholarship', 'income'],
  ['scholarship', 'academic'],
  ['eligibility', 'attendance'],
  ['income', 'academic'],
  ['academic', 'renewal'],
  ['attendance', 'renewal'],
];

function HeroGraph() {
  const reduce = useReducedMotion();
  const node = (id: string) => HERO_NODES.find((n) => n.id === id)!;

  return (
    <div className="relative w-full">
      <div className="absolute -inset-6 rounded-full bg-[var(--accent-soft)]/15 blur-3xl" />
      <svg viewBox="0 0 560 500" className="relative w-full" role="img" aria-label="Animated scholarship knowledge graph">
        <defs>
          <radialGradient id="heroGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eef1e7" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="280" cy="250" r="230" fill="url(#heroGlow)" opacity="0.7" />
        <circle cx="280" cy="250" r="225" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 7" />
        <circle cx="280" cy="250" r="170" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 7" />

        {HERO_EDGES.map(([a, b], i) => {
          const s = node(a);
          const t = node(b);
          const mx = (s.x + t.x) / 2;
          const my = (s.y + t.y) / 2 - 26;
          return (
            <g key={i}>
              <path
                d={`M ${s.x} ${s.y} Q ${mx} ${my} ${t.x} ${t.y}`}
                fill="none"
                stroke="var(--accent-soft)"
                strokeWidth="1.5"
                opacity="0.55"
              />
              {!reduce && (
                <motion.path
                  d={`M ${s.x} ${s.y} Q ${mx} ${my} ${t.x} ${t.y}`}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }}
                  transition={{ duration: 3.4, delay: i * 0.42, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
                />
              )}
            </g>
          );
        })}

        {HERO_NODES.map((n, i) => (
          <motion.g
            key={n.id}
            animate={reduce ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 4.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {n.id === 'scholarship' && !reduce && (
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={n.r + 8}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1"
                animate={{ r: [n.r + 6, n.r + 20], opacity: [0.35, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <circle cx={n.x} cy={n.y} r={n.r} fill="#fff" stroke="var(--accent)" strokeWidth={n.id === 'scholarship' ? 2.5 : 1.8} filter="url(#softGlow)" />
            <circle cx={n.x} cy={n.y} r={n.id === 'scholarship' ? 11 : 7} fill="var(--accent)" />
            <text
              x={n.x}
              y={n.y + n.r + 20}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="var(--ink)"
              fontFamily="Inter, sans-serif"
            >
              {n.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export function Overview({ onExplore, onDemo }: OverviewProps) {
  const reduce = useReducedMotion();
  return (
    <>
      <section id="overview" className="chapter relative overflow-hidden">
        <div className="absolute right-[-10%] top-[-15%] h-[520px] w-[520px] rounded-full bg-[var(--muted)]/40 blur-3xl" />
        <div className="container-x relative pt-36 pb-20 lg:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
            <div>
              <Reveal>
                <div className="eyebrow mb-7 flex items-center gap-3">
                  <span className="h-px w-8 bg-[var(--accent)]" />
                  Computer Science Capstone Research
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="hero-title">Can We Detect What a Knowledge Base Doesn&apos;t Know?</h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl font-sans text-[clamp(21px,1.9vw,26px)] font-medium leading-[1.35] text-[var(--accent-deep)]">
                  Detecting Missing Scholarship Rules Using Competency Question Guided Knowledge Engineering Compared
                  with Ad Hoc Development to Improve Query Accuracy.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <p className="body-lg text-[var(--ink-2)] mt-5 max-w-xl">
                  An experimental comparison of competency-question-guided and ad hoc knowledge engineering for
                  improving scholarship policy query accuracy.
                </p>
              </Reveal>
              <Reveal delay={0.32}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button className="btn btn-primary" onClick={onExplore}>
                    Explore Research <ArrowRight size={18} />
                  </button>
                  <button className="btn btn-outline" onClick={onDemo}>
                    <Play size={16} /> Try Interactive Demo
                  </button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.2} direction="left">
              <HeroGraph />
              <div className="mt-2 flex items-center justify-center gap-2 text-[13px] text-[var(--ink-2)]">
                <ScanSearch size={15} className="text-[var(--accent)]" />
                Interactive graph explored in the Knowledge Base chapter
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
              {[
                { value: 26, label: 'Policy Rules', suffix: '' },
                { value: 2, label: 'Development Approaches', suffix: '' },
                { value: 22, label: 'Held-Out Queries', suffix: '' },
              ].map((item) => (
                <div key={item.label} className="bg-[var(--surface)] px-8 py-8">
                  <div className="kicker-number text-[var(--accent-deep)]">
                    <CountUp value={item.value} suffix={item.suffix} />
                  </div>
                  <div className="mt-3 text-[15px] font-medium text-[var(--ink-2)]">{item.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <button onClick={onExplore} className="mx-auto mt-14 flex flex-col items-center gap-2 text-[var(--ink-2)] hover:text-[var(--accent)] transition-colors">
              <span className="text-[13px] font-medium uppercase tracking-[0.2em]">Begin</span>
              <motion.span animate={reduce ? undefined : { y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                <ArrowDown size={20} />
              </motion.span>
            </button>
          </Reveal>
        </div>
      </section>

      <section id="problem-story" className="chapter section-pad border-t border-[var(--border)] bg-[var(--paper)]">
        <div className="container-x">
          <div className="max-w-4xl">
            <SectionTitle />
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal direction="right">
              <div className="panel h-full p-8">
                <div className="eyebrow mb-6">Original policy · Section 2</div>
                <PolicyFact label="Income ceiling" value="₹2,50,000" note="Gross annual household income" />
                <hr className="rule my-6" />
                <PolicyFact label="Irrigated land ceiling" value="5 acres" note="Agricultural asset limit · POL-R05" />
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.08}>
              <div className="panel h-full p-8">
                <div className="eyebrow mb-6">Example applicant</div>
                <PolicyFact label="Student income" value="₹2,00,000" note="Below the income ceiling" tone="green" />
                <hr className="rule my-6" />
                <PolicyFact label="Irrigated land owned" value="8 acres" note="Exceeds the 5-acre ceiling" tone="red" />
              </div>
            </Reveal>
          </div>

          <Stagger className="mt-8 grid gap-6 lg:grid-cols-2">
            <StaggerItem>
              <OutcomePanel
                tone="green"
                eyebrow="CQ-Guided Knowledge Base"
                title="Both conditions identified"
                lines={['Income condition checked — ₹2,00,000 ≤ ₹2,50,000', 'Land ceiling checked — 8 acres > 5 acres']}
                verdict="INELIGIBLE — violation detected"
                badge="Correct decision"
              />
            </StaggerItem>
            <StaggerItem>
              <OutcomePanel
                tone="red"
                eyebrow="Ad Hoc Knowledge Base"
                title="Land ceiling missed"
                lines={['Income condition checked — ₹2,00,000 ≤ ₹2,50,000', 'POL-R05 (land ceiling) absent from the KB']}
                verdict="Eligible — incorrect decision"
                badge="False acceptance"
              />
            </StaggerItem>
          </Stagger>

          <Reveal delay={0.1}>
            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--red-soft)] text-[var(--red)]">
                <ScanSearch size={19} />
              </div>
              <p className="body text-[var(--ink)]">
                An incomplete knowledge base can produce an incorrect eligibility decision — even when every rule it
                does contain is applied correctly. The failure is one of omission, not computation.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function SectionTitle() {
  return (
    <Reveal>
      <div className="eyebrow mb-5 flex items-center gap-3">
        <span className="h-px w-8 bg-[var(--accent)]" />
        The Research Problem
      </div>
      <h2 className="section-title">
        The Problem Is Not Always the Answer. <em className="text-[var(--accent)]">Sometimes It Is the Missing Rule.</em>
      </h2>
      <p className="body-lg text-[var(--ink-2)] mt-6">
        Two knowledge bases can apply identical logic and still disagree — because one never encoded the rule that
        mattered. Here is the failure mode this study isolates.
      </p>
    </Reveal>
  );
}

function PolicyFact({ label, value, note, tone }: { label: string; value: string; note: string; tone?: 'green' | 'red' }) {
  const color = tone === 'green' ? 'text-[var(--accent-deep)]' : tone === 'red' ? 'text-[var(--red)]' : 'text-[var(--ink)]';
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <div className="text-[13px] font-semibold uppercase tracking-wide text-[var(--ink-2)]">{label}</div>
        <div className="body-sm mt-1">{note}</div>
      </div>
      <div className={`numeral shrink-0 text-[clamp(28px,3vw,40px)] font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function OutcomePanel({
  tone,
  eyebrow,
  title,
  lines,
  verdict,
  badge,
}: {
  tone: 'green' | 'red';
  eyebrow: string;
  title: string;
  lines: string[];
  verdict: string;
  badge: string;
}) {
  const green = tone === 'green';
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`panel p-8 h-full ${green ? 'border-l-4 border-l-[var(--accent)]' : 'border-l-4 border-l-[var(--red)]'}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className={`badge ${green ? 'badge-green' : 'badge-red'}`}>{badge}</span>
        <span className="mono text-[12px] text-[var(--ink-2)]">{eyebrow}</span>
      </div>
      <h3 className="sub-title mt-5">{title}</h3>
      <ul className="mt-5 space-y-3">
        {lines.map((line) => (
          <li key={line} className="body-sm flex items-start gap-3">
            <span className={`dot mt-2 ${green ? 'dot-green' : 'dot-red'}`} />
            {line}
          </li>
        ))}
      </ul>
      <div
        className={`mt-6 rounded-xl px-5 py-4 font-semibold ${green ? 'bg-[var(--green-soft)] text-[var(--accent-deep)]' : 'bg-[var(--red-soft)] text-[var(--red)]'}`}
      >
        {verdict}
      </div>
    </motion.div>
  );
}
