import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpenCheck, Braces, GitCompareArrows, ListChecks, ScanSearch } from 'lucide-react';
import { CountUp, Reveal, Stagger, StaggerItem } from '../ui/primitives';
import { INITIAL_POLICY_RULES, SYNTHETIC_POLICY_METADATA } from '../data/policyRules';
import { HELD_OUT_QUERIES } from '../data/heldOutQueries';
import { INITIAL_COMPETENCY_QUESTIONS } from '../data/competencyQuestions';

const STEPS = [
  {
    n: '01',
    icon: BookOpenCheck,
    title: 'Policy Selection',
    text: 'A synthetic 26-rule scholarship policy is fixed as the single source of truth for both teams.',
  },
  {
    n: '02',
    icon: ListChecks,
    title: 'Rule Extraction',
    text: 'The policy is decomposed into atomic rules, conditions, and exception clauses.',
  },
  {
    n: '03',
    icon: GitCompareArrows,
    title: 'Two Workflows',
    text: 'CQ-guided and ad hoc engineering proceed independently under identical constraints.',
  },
  {
    n: '04',
    icon: Braces,
    title: 'Knowledge Bases',
    text: 'Each team encodes its rules into a queryable knowledge base with condition fidelity.',
  },
  {
    n: '05',
    icon: ScanSearch,
    title: 'Held-Out Testing',
    text: 'Unseen queries probe edge cases, exceptions, and rules likely to be overlooked.',
  },
  {
    n: '06',
    icon: Braces,
    title: 'Evaluation',
    text: 'Accuracy, rule coverage, and unanswered rates are computed from the underlying data.',
  },
];

export function Methodology() {
  const reduce = useReducedMotion();
  const rules = INITIAL_POLICY_RULES.length;
  const minutes = SYNTHETIC_POLICY_METADATA.budgetAllocationMinutes;
  const queries = HELD_OUT_QUERIES.length;
  const cqs = INITIAL_COMPETENCY_QUESTIONS.length;

  return (
    <section id="methodology" className="chapter section-pad border-t border-[var(--border)] bg-[var(--paper)]">
      <div className="container-x">
        <div className="max-w-3xl">
          <Reveal>
            <div className="eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--accent)]" />
              Chapter 03 · Methodology
            </div>
            <h2 className="section-title">One experiment. Six controlled stages.</h2>
            <p className="body-lg text-[var(--ink-2)] mt-6">
              Every variable is held constant except the development workflow itself. That isolation is what makes the
              differences attributable to method rather than material.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-16">
          <div className="hidden lg:block absolute left-0 right-0 top-[58px] h-px bg-[var(--border)]" />
          {!reduce && (
            <motion.div
              className="hidden lg:block absolute left-0 top-[57px] h-[3px] bg-[var(--accent)]"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
          )}
          <Stagger gap={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <StaggerItem key={s.n}>
                  <div className="relative h-full">
                    <div className="flex items-center gap-4 lg:block">
                      <div className="relative z-10 flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] lg:mb-6">
                        <Icon size={25} className="text-[var(--accent)]" />
                        <span className="mono absolute -right-2 -top-2 rounded-full bg-[var(--ink)] px-2 py-0.5 text-[10px] font-bold text-white">
                          {s.n}
                        </span>
                      </div>
                      <div className="lg:hidden">
                        <h3 className="text-[20px] font-semibold">{s.title}</h3>
                      </div>
                    </div>
                    <h3 className="hidden text-[20px] font-semibold lg:block">{s.title}</h3>
                    <p className="body-sm mt-3">{s.text}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>

        <Reveal delay={0.1}>
          <div className="panel mt-20 overflow-hidden">
            <div className="grid md:grid-cols-[0.42fr_0.58fr]">
              <div className="bg-[var(--ink)] px-9 py-10 text-white">
                <div className="eyebrow mb-5 !text-[var(--accent-soft)]">Experimental control</div>
                <h3 className="font-display text-[clamp(26px,2.6vw,36px)] leading-tight">Held constant across both approaches.</h3>
                <p className="mt-5 text-[15px] leading-relaxed text-white/65">
                  Only the development workflow differs. Policy material, time, and evaluation suite are identical.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
                {[
                  { label: 'Same policy', value: rules, suffix: ' rules' },
                  { label: 'Same time budget', value: minutes, suffix: ' min' },
                  { label: 'Same held-out suite', value: queries, suffix: ' queries' },
                  { label: 'Competency questions', value: cqs, suffix: ' authored' },
                ].map((x) => (
                  <div key={x.label} className="bg-[var(--surface)] px-7 py-8">
                    <div className="text-[13px] font-semibold uppercase tracking-wide text-[var(--ink-2)]">{x.label}</div>
                    <div className="numeral mt-3 text-[clamp(26px,3vw,38px)] font-semibold text-[var(--accent-deep)]">
                      <CountUp value={x.value} />
                      <span className="text-[17px] font-medium text-[var(--ink-2)]">{x.suffix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-[var(--border)] bg-[var(--green-soft)] px-9 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 font-semibold text-[var(--accent-deep)]">
                <span className="dot dot-green" /> The only variable: development workflow
              </div>
              <div className="flex items-center gap-2 text-[15px] text-[var(--accent-deep)]">
                CQ-guided <ArrowRight size={16} /> Ad hoc
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="body-sm mt-8 max-w-3xl">
            <strong className="text-[var(--ink)]">Materials note.</strong> {SYNTHETIC_POLICY_METADATA.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
