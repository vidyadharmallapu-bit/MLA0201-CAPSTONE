import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, GitBranch, Route } from 'lucide-react';
import { Accordion, CountUp, Reveal } from '../ui/primitives';
import { CompetencyQuestion, KnowledgeBaseRule, PolicyRule } from '../types';
import { SYNTHETIC_POLICY_METADATA } from '../data/policyRules';

const CQ_STEPS = ['Frame competency questions', 'Map questions to rules', 'Extract every condition', 'Validate coverage', 'Verify knowledge base'];
const ADHOC_STEPS = ['Skim the policy', 'Note salient rules', 'Transcribe conditions', 'Quick spot-check', 'Finalize knowledge base'];

interface Props {
  questions: CompetencyQuestion[];
  rules: PolicyRule[];
  cqKB: KnowledgeBaseRule[];
  adHocKB: KnowledgeBaseRule[];
}

export function Approaches({ questions, rules, cqKB, adHocKB }: Props) {
  const [mode, setMode] = useState<'CQ' | 'ADHOC'>('CQ');
  const isCQ = mode === 'CQ';

  const stats = useMemo(() => {
    const totalConditions = rules.reduce((s, r) => s + r.conditions.length, 0);
    const kb = isCQ ? cqKB : adHocKB;
    const extracted = kb.reduce((s, r) => s + r.extractedConditions.length, 0);
    const represented = isCQ ? rules.length : adHocKB.length;
    return {
      represented,
      missing: rules.length - represented,
      completeness: Math.round((extracted / totalConditions) * 1000) / 10,
      time: SYNTHETIC_POLICY_METADATA.budgetAllocationMinutes,
    };
  }, [isCQ, rules, cqKB, adHocKB]);

  const cqEntries = questions.map((q) => ({
    id: q.id,
    title: (
      <span>
        <span className="mono text-[var(--accent)] mr-2">{q.id}</span>
        {q.question}
      </span>
    ),
    meta: `${q.category} · ${q.associatedRuleIds.length} associated rule${q.associatedRuleIds.length > 1 ? 's' : ''}`,
    content: (
      <div className="space-y-3">
        <p>{q.rationale}</p>
        <div className="flex flex-wrap gap-2">
          {q.associatedRuleIds.map((id) => (
            <span key={id} className="mono rounded bg-[var(--muted)] px-2 py-1 text-[12px] text-[var(--accent-deep)]">
              {id}
            </span>
          ))}
        </div>
      </div>
    ),
  }));

  const adHocEntries = adHocKB.map((r) => ({
    id: r.id,
    title: (
      <span>
        <span className="mono text-[var(--accent)] mr-2">{r.ruleId}</span>
        {r.title}
      </span>
    ),
    meta: `${r.category} · ${r.status === 'verified' ? 'Fully captured' : `${r.omittedConditions?.length ?? 0} condition(s) omitted`}`,
    content: (
      <div className="space-y-4">
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-wide text-[var(--ink-2)] mb-2">Represented</div>
          <ul className="space-y-1.5">
            {r.extractedConditions.map((c, i) => (
              <li key={i} className="body-sm flex gap-2">
                <Check size={16} className="mt-1 shrink-0 text-[var(--accent)]" /> {c}
              </li>
            ))}
          </ul>
        </div>
        {r.omittedConditions && r.omittedConditions.length > 0 && (
          <div className="rounded-xl bg-[var(--red-soft)] p-4">
            <div className="text-[13px] font-semibold uppercase tracking-wide text-[var(--red)] mb-2 flex items-center gap-2">
              <AlertTriangle size={15} /> Omitted conditions
            </div>
            <ul className="space-y-1.5">
              {r.omittedConditions.map((c, i) => (
                <li key={i} className="text-[15px] text-[var(--red)] flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--red)]" /> {c}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="body-sm italic">“{r.developmentNotes}”</p>
      </div>
    ),
  }));

  return (
    <div className="mt-24">
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="eyebrow mb-4">Two development approaches</div>
            <h3 className="sub-title">Same policy. Same time. Different method.</h3>
          </div>
          <div className="inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
            <button
              onClick={() => setMode('CQ')}
              className={`rounded-full px-5 py-2.5 text-[15px] font-semibold transition-all ${isCQ ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'}`}
            >
              A · CQ-Guided
            </button>
            <button
              onClick={() => setMode('ADHOC')}
              className={`rounded-full px-5 py-2.5 text-[15px] font-semibold transition-all ${!isCQ ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'}`}
            >
              B · Ad Hoc
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <motion.div key={mode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel mt-8 overflow-hidden">
          <div className={`grid lg:grid-cols-[1.15fr_0.85fr] ${isCQ ? '' : 'lg:grid-cols-[1.15fr_0.85fr]'}`}>
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--accent-deep)]">
                  {isCQ ? <Route size={21} /> : <GitBranch size={21} />}
                </div>
                <div>
                  <div className="eyebrow !text-[11px]">Approach {isCQ ? 'A' : 'B'}</div>
                  <h4 className="text-[22px] font-semibold">
                    {isCQ ? 'Competency Question Guided' : 'Traditional Ad Hoc'}
                  </h4>
                </div>
              </div>
              <p className="body-sm mt-5 max-w-xl">
                {isCQ
                  ? 'Twelve competency questions first define what the base must know. Each rule is then extracted and checked against those questions before it is accepted.'
                  : 'The policy is read once and rules are recorded as they are noticed. Fine-print conditions and exceptions are easily lost under the same time pressure.'}
              </p>

              <div className="mt-9">
                <div className="eyebrow mb-5 !text-[11px]">Development workflow</div>
                <div className="flex flex-col gap-3">
                  {(isCQ ? CQ_STEPS : ADHOC_STEPS).map((step, i) => (
                    <div key={step} className="flex items-center gap-4">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                          isCQ ? 'bg-[var(--accent)] text-white' : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-2)]'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="h-px flex-1 bg-[var(--border)]" />
                      <span className="text-[16px] font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px border-t border-[var(--border)] bg-[var(--border)] lg:border-l lg:border-t-0">
              <Metric label="Rules represented" value={stats.represented} suffix={` / ${rules.length}`} />
              <Metric label="Missing rules" value={stats.missing} tone={stats.missing ? 'red' : 'green'} />
              <Metric label="Condition completeness" value={stats.completeness} decimals={1} suffix="%" tone={isCQ ? 'green' : 'amber'} />
              <Metric label="Development time" value={stats.time} suffix=" min" />
            </div>
          </div>
        </motion.div>
      </Reveal>

      <div className="mt-12">
        <Reveal>
          <div className="eyebrow mb-5">
            {isCQ ? `The ${questions.length} competency questions` : `${adHocKB.length} extracted rules · conditions at risk`}
          </div>
        </Reveal>
        <Accordion entries={isCQ ? cqEntries : adHocEntries} defaultOpen={isCQ ? questions[0]?.id : adHocKB[0]?.id} />
        <Reveal>
          <p className="body-sm mt-5">
            {isCQ
              ? 'Each question is inspectable here. Its rationale states the policy knowledge that must be discoverable.'
              : 'Amber entries lost sub-conditions; red-marked rules were omitted entirely from the ad hoc base.'}
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  suffix = '',
  decimals = 0,
  tone = 'green',
}: {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  tone?: 'green' | 'red' | 'amber';
}) {
  const color = tone === 'red' ? 'text-[var(--red)]' : tone === 'amber' ? 'text-[var(--amber)]' : 'text-[var(--accent-deep)]';
  return (
    <div className="bg-[var(--surface)] p-7">
      <div className="text-[13px] font-semibold uppercase tracking-wide text-[var(--ink-2)]">{label}</div>
      <div className={`numeral mt-3 text-[clamp(28px,3vw,42px)] font-semibold ${color}`}>
        <CountUp value={value} decimals={decimals} />
        <span className="text-[16px] font-medium text-[var(--ink-2)]">{suffix}</span>
      </div>
    </div>
  );
}
