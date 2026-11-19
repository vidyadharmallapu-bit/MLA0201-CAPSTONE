import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eraser, FlaskConical, Info, Play, XCircle } from 'lucide-react';
import { Reveal } from '../ui/primitives';
import { HeldOutQuery, KnowledgeBaseRule, PolicyRule, QueryEvaluationResult } from '../types';
import { matchQueryAgainstKB, MatchingResult } from '../engine/ruleMatcher';
import { evaluateSingleQuery } from '../engine/evaluator';

type LabState = 'CORRECT' | 'INCORRECT' | 'PARTIALLY_ANSWERABLE' | 'UNANSWERED';

interface LabResult {
  state: LabState;
  answer: string;
  classification: string;
  classificationLabel: string;
  supporting: { id: string; title: string }[];
  missing: string[];
  reasoning: string;
  confidence: number;
}

interface Props {
  cqKB: KnowledgeBaseRule[];
  adHocKB: KnowledgeBaseRule[];
  policyRules: PolicyRule[];
  heldOutQueries: HeldOutQuery[];
}

const EXAMPLE = 'Can a student with ₹2,00,000 annual family income and 8 acres of irrigated land apply?';

export function TestingLab({ cqKB, adHocKB, policyRules, heldOutQueries }: Props) {
  const [input, setInput] = useState(EXAMPLE);
  const [presetId, setPresetId] = useState('custom');
  const [showRules, setShowRules] = useState(true);
  const [ran, setRan] = useState(true);

  const preset = heldOutQueries.find((q) => q.id === presetId) ?? null;

  const ruleTitles = useMemo(() => new Map(policyRules.map((r) => [r.id, r.title])), [policyRules]);

  const results = useMemo(() => {
    if (!ran || !input.trim()) return null;
    return {
      cq: buildResult(cqKB, 'CQ_GUIDED', preset, input, policyRules, ruleTitles),
      ad: buildResult(adHocKB, 'AD_HOC', preset, input, policyRules, ruleTitles),
    };
  }, [ran, input, preset, cqKB, adHocKB, policyRules, ruleTitles]);

  const run = () => {
    if (!input.trim()) return;
    setRan(true);
  };

  const selectPreset = (id: string) => {
    setPresetId(id);
    if (id === 'custom') {
      setInput('');
      setRan(false);
      return;
    }
    const q = heldOutQueries.find((x) => x.id === id);
    if (q) {
      setInput(q.query);
      setRan(true);
    }
  };

  const clear = () => {
    setInput('');
    setPresetId('custom');
    setRan(false);
  };

  return (
    <section id="testing-lab" className="chapter section-pad border-t border-[var(--border)]">
      <div className="container-x">
        <div className="max-w-3xl">
          <Reveal>
            <div className="eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--accent)]" />
              Chapter 05 · Testing Lab
            </div>
            <h2 className="section-title">Ask the same question. Watch the answers diverge.</h2>
            <p className="body-lg text-[var(--ink-2)] mt-6">
              A local, deterministic rule-matching engine queries both knowledge bases side by side. No cloud model, no
              generated probabilities — only the rules each base actually contains.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="panel mt-14 p-7 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ink)] text-white">
                  <FlaskConical size={20} />
                </div>
                <div>
                  <div className="text-[19px] font-semibold">Query console</div>
                  <div className="text-[14px] text-[var(--ink-2)]">Deterministic local demonstration · not a cloud AI model</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select className="field !w-auto !py-2.5 !text-[14px] max-w-full" value={presetId} onChange={(e) => selectPreset(e.target.value)}>
                  <option value="custom">Custom query…</option>
                  {heldOutQueries.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.id} · {q.category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-7">
              <label className="eyebrow !text-[11px]">Policy question</label>
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setPresetId('custom');
                  setRan(false);
                }}
                placeholder={EXAMPLE}
                rows={3}
                className="field mt-3 resize-y text-[18px] leading-relaxed"
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary btn-sm" onClick={run} disabled={!input.trim()}>
                  <Play size={16} /> Run comparison
                </button>
                <button className="btn btn-outline btn-sm" onClick={clear}>
                  <Eraser size={16} /> Clear input
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setShowRules((s) => !s)}>
                  <Info size={16} /> {showRules ? 'Hide' : 'Show'} supporting rules
                </button>
              </div>
              <span className="mono text-[12px] text-[var(--ink-2)]">
                ENGINE: LOCAL RULE MATCHING · {policyRules.length} RULES
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ResultPanel
            label="Approach A · CQ-Guided"
            accent="green"
            result={results?.cq ?? null}
            showRules={showRules}
            empty="Enter a question and run the comparison to inspect this knowledge base."
          />
          <ResultPanel
            label="Approach B · Ad Hoc"
            accent="amber"
            result={results?.ad ?? null}
            showRules={showRules}
            empty="Enter a question and run the comparison to inspect this knowledge base."
          />
        </div>

        <Reveal>
          <p className="body-sm mt-7 flex items-start gap-3">
            <Info size={17} className="mt-1 shrink-0 text-[var(--accent)]" />
            Preset queries are drawn from the held-out suite used in the evaluation. Selecting one runs the same
            deterministic evaluator that produced the reported metrics; custom text uses the local keyword-and-category
            matcher. Classifications shown for presets are the policy&apos;s expected classifications.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function buildResult(
  kb: KnowledgeBaseRule[],
  approach: 'CQ_GUIDED' | 'AD_HOC',
  preset: HeldOutQuery | null,
  input: string,
  policyRules: PolicyRule[],
  ruleTitles: Map<string, string>
): LabResult {
  const titles = (ids: string[]) => ids.map((id) => ({ id, title: ruleTitles.get(id) ?? policyRules.find((r) => r.id === id)?.title ?? id }));

  if (preset) {
    const r: QueryEvaluationResult = evaluateSingleQuery(preset, approach, kb, policyRules);
    const state: LabState =
      r.status === 'CORRECT' ? 'CORRECT' : r.status === 'INCORRECT' ? 'INCORRECT' : r.status === 'PARTIALLY_CORRECT' ? 'PARTIALLY_ANSWERABLE' : 'UNANSWERED';
    return {
      state,
      answer: r.generatedAnswer,
      classification: preset.expectedClassification,
      classificationLabel: 'Target classification',
      supporting: titles(r.matchedRuleIds),
      missing: r.omittedRuleIds,
      reasoning: r.reasoning,
      confidence: r.confidenceScore,
    };
  }

  const m: MatchingResult = matchQueryAgainstKB(input, kb, policyRules);
  const state: LabState =
    m.status === 'ANSWERABLE' ? 'CORRECT' : m.status === 'PARTIALLY_ANSWERABLE' ? 'PARTIALLY_ANSWERABLE' : 'UNANSWERED';
  return {
    state,
    answer: m.generatedAnswer,
    classification: m.identifiedCategory ?? 'Unclassified',
    classificationLabel: 'Matched category',
    supporting: m.matchedRules.map((r) => ({ id: r.ruleId, title: r.title })),
    missing: m.missingRulesHint ?? [],
    reasoning: m.explanation,
    confidence: m.confidence,
  };
}

const STATE_META: Record<LabState, { label: string; cls: string; icon: React.ReactNode }> = {
  CORRECT: { label: 'Correct', cls: 'badge-green', icon: <CheckCircle2 size={15} /> },
  INCORRECT: { label: 'Incorrect', cls: 'badge-red', icon: <XCircle size={15} /> },
  PARTIALLY_ANSWERABLE: { label: 'Partially Answerable', cls: 'badge-amber', icon: <AlertCircle size={15} /> },
  UNANSWERED: { label: 'Unanswered', cls: 'badge-neutral', icon: <AlertCircle size={15} /> },
};

function ResultPanel({
  label,
  accent,
  result,
  showRules,
  empty,
}: {
  label: string;
  accent: 'green' | 'amber';
  result: LabResult | null;
  showRules: boolean;
  empty: string;
}) {
  const border = accent === 'green' ? 'border-t-[var(--accent)]' : 'border-t-[var(--amber)]';
  const meta = result ? STATE_META[result.state] : null;

  return (
    <motion.div layout className={`panel overflow-hidden border-t-4 ${border}`}>
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-7 py-5">
        <span className="text-[17px] font-semibold">{label}</span>
        {meta && (
          <span className={`badge ${meta.cls}`}>
            {meta.icon} {meta.label}
          </span>
        )}
      </div>
      <div className="p-7">
        {!result ? (
          <p className="body-sm py-10 text-center">{empty}</p>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="eyebrow mb-2 !text-[11px]">Answer</div>
              <p className="body-sm !text-[var(--ink)] rounded-xl bg-[var(--paper)] p-5">{result.answer}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="eyebrow mb-2 !text-[11px]">{result.classificationLabel}</div>
                <p className="text-[16px] font-medium">{result.classification}</p>
              </div>
              <div>
                <div className="eyebrow mb-2 !text-[11px]">Matching confidence</div>
                <p className="numeral text-[16px] font-semibold">{result.confidence}%</p>
              </div>
            </div>

            {showRules && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 border-t border-[var(--border)] pt-6">
                <div>
                  <div className="eyebrow mb-3 !text-[11px]">Supporting policy rules</div>
                  {result.supporting.length ? (
                    <div className="flex flex-wrap gap-2">
                      {result.supporting.map((r) => (
                        <span key={r.id} className="chip !text-[12px]">
                          <span className="mono text-[var(--accent)]">{r.id}</span> {r.title}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[15px] text-[var(--ink-2)]">None matched.</p>
                  )}
                </div>
                <div>
                  <div className="eyebrow mb-3 !text-[11px]">Missing rules / conditions</div>
                  {result.missing.length ? (
                    <ul className="space-y-2">
                      {result.missing.map((m, i) => (
                        <li key={i} className="rounded-lg bg-[var(--red-soft)] px-3 py-2 text-[14px] text-[var(--red)]">
                          {m}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[15px] text-[var(--ink-2)]">None detected.</p>
                  )}
                </div>
                <div>
                  <div className="eyebrow mb-2 !text-[11px]">Reasoning</div>
                  <p className="text-[15px] leading-relaxed text-[var(--ink-2)]">{result.reasoning}</p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
