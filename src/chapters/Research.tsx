import React from 'react';
import { motion } from 'framer-motion';
import { Compass, GitBranch, Layers3, Target } from 'lucide-react';
import { Reveal, SectionIntro, Stagger, StaggerItem } from '../ui/primitives';

const OBJECTIVES = [
  {
    n: '01',
    icon: Layers3,
    title: 'Extract atomic policy rules',
    text: 'Decompose a 26-rule scholarship policy into individually testable conditions and boundary clauses.',
  },
  {
    n: '02',
    icon: Compass,
    title: 'Author competency questions',
    text: 'Derive 12 competency questions that enumerate what a complete knowledge base must be able to answer.',
  },
  {
    n: '03',
    icon: GitBranch,
    title: 'Compare two workflows',
    text: 'Build CQ-guided and ad hoc knowledge bases under an identical 120-minute development budget.',
  },
  {
    n: '04',
    icon: Target,
    title: 'Measure the consequence',
    text: 'Evaluate both bases against 22 held-out queries and trace errors back to specific missing rules.',
  },
];

export function Research() {
  return (
    <section id="research" className="chapter section-pad border-t border-[var(--border)]">
      <div className="container-x">
        <SectionIntro
          eyebrow="Chapter 02 · Research"
          title={
            <>
              A study of what knowledge systems <em className="text-[var(--accent)]">leave out.</em>
            </>
          }
          description="Knowledge engineering is usually evaluated by the answers it produces. This study instead examines the rules that were never encoded — and measures what those absences cost."
        />

        <Reveal delay={0.1}>
          <div className="relative mt-16 overflow-hidden rounded-3xl bg-[var(--ink)] px-8 py-14 text-white sm:px-14 lg:px-20">
            <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -right-4 -top-8 h-72 w-72 rounded-full border border-white/10" />
            <div className="eyebrow mb-7 !text-[var(--accent-soft)]">Central research question</div>
            <p className="font-display text-[clamp(26px,3.4vw,46px)] leading-[1.18] max-w-4xl relative">
              Does competency-question-guided development detect missing scholarship rules more reliably than ad hoc
              development — and does that detection improve query accuracy?
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal direction="right">
            <div className="panel p-9 h-full">
              <div className="eyebrow mb-5">Working hypothesis</div>
              <h3 className="sub-title">Explicit questions expose implicit gaps.</h3>
              <p className="body mt-5 text-[var(--ink-2)]">
                If development is guided by competency questions that enumerate required policy knowledge, then the
                resulting knowledge base will represent more rules completely, leave fewer queries unanswered, and
                answer more held-out queries correctly than a base built ad hoc under the same time budget.
              </p>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--green-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent-deep)]">
                <span className="dot dot-green" /> Testable · falsifiable · measured locally
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.08}>
            <div className="panel p-9 h-full">
              <div className="eyebrow mb-5">Why it matters</div>
              <div className="space-y-5">
                {[
                  ['Silent failures', 'A missing rule does not raise an error. It quietly changes an eligibility decision.'],
                  ['Uneven coverage', 'Ad hoc extraction favours prominent clauses and drops fine-print exceptions.'],
                  ['No uncertainty signal', 'Most bases answer confidently even when the governing rule is absent.'],
                ].map(([title, text]) => (
                  <div key={title} className="flex gap-4">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                    <p className="body-sm">
                      <strong className="text-[var(--ink)]">{title}.</strong> {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-20">
          <Reveal>
            <div className="eyebrow mb-6">Study objectives</div>
          </Reveal>
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {OBJECTIVES.map((o) => {
              const Icon = o.icon;
              return (
                <StaggerItem key={o.n}>
                  <motion.div whileHover={{ y: -4 }} className="panel p-8 h-full flex gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--accent-deep)]">
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="mono text-[12px] text-[var(--accent)] mb-2">OBJ {o.n}</div>
                      <h3 className="text-[21px] font-semibold">{o.title}</h3>
                      <p className="body-sm mt-2">{o.text}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
