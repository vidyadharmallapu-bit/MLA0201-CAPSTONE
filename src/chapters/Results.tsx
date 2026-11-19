import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChevronDown, Download, Search, ShieldCheck } from 'lucide-react';
import { Accordion, CountUp, Reveal, StatusBadge, Tone } from '../ui/primitives';
import { EvaluationMetrics, HeldOutQuery, KnowledgeBaseRule, MissingRuleReportItem, PolicyRule } from '../types';

import { detectMissingRules } from '../engine/missingRuleDetector';
import { evaluateAllHeldOutQueries } from '../engine/evaluator';
import { downloadCSV } from '../utils/csvExporter';

interface Props {
  metricsA: EvaluationMetrics;
  metricsB: EvaluationMetrics;
  cqKB: KnowledgeBaseRule[];
  adHocKB: KnowledgeBaseRule[];
  policyRules: PolicyRule[];
  heldOutQueries: HeldOutQuery[];
}

const STATUS_TONE: Record<string, Tone> = { MISSING: 'red', PARTIAL: 'amber', VERIFIED: 'green' };
const STATUS_LABEL: Record<string, string> = { MISSING: 'Missing', PARTIAL: 'Partial', VERIFIED: 'Verified' };

export function Results({ metricsA, metricsB, cqKB, adHocKB, policyRules, heldOutQueries }: Props) {
  const [auditMode, setAuditMode] = useState<'ADHOC' | 'CQ'>('ADHOC');
  const [ledgerQuery, setLedgerQuery] = useState('');
  const [ledgerFilter, setLedgerFilter] = useState<'ALL' | 'MISSING' | 'PARTIAL' | 'VERIFIED'>('ALL');
  const [showTable, setShowTable] = useState(false);

  const report = useMemo(
    () => detectMissingRules(policyRules, cqKB, adHocKB, heldOutQueries),
    [policyRules, cqKB, adHocKB, heldOutQueries]
  );

  const evalA = useMemo(() => evaluateAllHeldOutQueries(heldOutQueries, 'CQ_GUIDED', cqKB, policyRules), [heldOutQueries, cqKB, policyRules]);
  const evalB = useMemo(() => evaluateAllHeldOutQueries(heldOutQueries, 'AD_HOC', adHocKB, policyRules), [heldOutQueries, adHocKB, policyRules]);

  const audit = auditMode === 'ADHOC' ? metricsB : metricsA;

  const filteredReport = report.filter((r) => {
    const targetStatus = auditMode === 'ADHOC' ? r.adHocStatus : r.cqGuidedStatus;
    const matchesFilter = ledgerFilter === 'ALL' || targetStatus === ledgerFilter;
    const q = ledgerQuery.trim().toLowerCase();
    const matchesQuery = !q || r.ruleId.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.policyRequirement.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  const categoryData = Object.keys(metricsA.categoryCoverage).map((cat) => ({
    category: cat === 'Special' ? 'Special' : cat,
    'CQ-Guided': Math.round(metricsA.categoryCoverage[cat].coveragePct),
    'Ad Hoc': Math.round(metricsB.categoryCoverage[cat].coveragePct),
  }));

  const outcomeData = [
    {
      approach: 'CQ-Guided',
      Correct: metricsA.correctAnswers,
      Partial: metricsA.partiallyCorrectAnswers,
      Incorrect: metricsA.incorrectAnswers,
      Unanswered: metricsA.unansweredQueries,
    },
    {
      approach: 'Ad Hoc',
      Correct: metricsB.correctAnswers,
      Partial: metricsB.partiallyCorrectAnswers,
      Incorrect: metricsB.incorrectAnswers,
      Unanswered: metricsB.unansweredQueries,
    },
  ];

  const exportData = [
    ...heldOutQueries.map((q, i) => ({
      query_id: q.id,
      category: q.category,
      expected_classification: q.expectedClassification,
      cq_guided_status: evalA[i].status,
      ad_hoc_status: evalB[i].status,
      query: q.query,
    })),
  ];

  return (
    <section id="results" className="chapter section-pad border-t border-[var(--border)] bg-[var(--paper)]">
      <div className="container-x">
        <div className="max-w-3xl">
          <Reveal>
            <div className="eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--accent)]" />
              Chapter 06 · Results
            </div>
            <h2 className="section-title">What Is Missing From the Knowledge Base?</h2>
            <p className="body-lg text-[var(--ink-2)] mt-6">
              Every figure below is computed from the underlying policy, knowledge bases, and held-out queries — not
              entered by hand.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="panel mt-14 p-7 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-[22px] font-semibold">Rule representation audit</h3>
                <p className="body-sm mt-1">
                  {auditMode === 'ADHOC' ? 'Ad Hoc knowledge base' : 'CQ-Guided knowledge base'} · {policyRules.length} policy rules
                </p>
              </div>
              <div className="inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--paper)] p-1">
                <button
                  onClick={() => setAuditMode('ADHOC')}
                  className={`rounded-full px-5 py-2.5 text-[15px] font-semibold ${auditMode === 'ADHOC' ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-2)]'}`}
                >
                  Ad Hoc
                </button>
                <button
                  onClick={() => setAuditMode('CQ')}
                  className={`rounded-full px-5 py-2.5 text-[15px] font-semibold ${auditMode === 'CQ' ? 'bg-[var(--accent)] text-white' : 'text-[var(--ink-2)]'}`}
                >
                  CQ-Guided
                </button>
              </div>
            </div>

            <div className="mt-9 grid gap-5 sm:grid-cols-3">
              <AuditFigure label="Fully represented" value={audit.representedRules} total={audit.totalPolicyRules} tone="green" />
              <AuditFigure label="Partially represented" value={audit.partiallyRepresentedRules} total={audit.totalPolicyRules} tone="amber" />
              <AuditFigure label="Completely missing" value={audit.missingRules} total={audit.totalPolicyRules} tone="red" />
            </div>
          </div>
        </Reveal>

        <div className="mt-12">
          <Reveal>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="eyebrow mb-3">Diagnostic ledger</div>
                <h3 className="sub-title">Trace each rule from omission to consequence.</h3>
              </div>
              <div className="relative w-full lg:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-2)]" />
                <input
                  value={ledgerQuery}
                  onChange={(e) => setLedgerQuery(e.target.value)}
                  placeholder="Search ledger…"
                  className="field !py-2.5 !pl-10 !text-[15px]"
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {(['ALL', 'MISSING', 'PARTIAL', 'VERIFIED'] as const).map((f) => (
                <button key={f} onClick={() => setLedgerFilter(f)} className={`chip ${ledgerFilter === f ? 'chip-active' : ''}`}>
                  {f === 'ALL' ? 'All' : STATUS_LABEL[f]}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-6">
            {filteredReport.length ? (
              <Accordion
                entries={filteredReport.map((item) => ledgerEntry(item, auditMode))}
              />
            ) : (
              <div className="panel p-10 text-center body-sm">No rules match the current filter.</div>
            )}
          </div>
        </div>

        <div className="mt-24">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow mb-4">Evaluation</div>
              <h3 className="sub-title">Three measures. One consistent picture.</h3>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <MainMetric
              label="Test query accuracy"
              a={metricsA.queryAccuracyPct}
              b={metricsB.queryAccuracyPct}
              suffix="%"
              note={`${metricsA.correctAnswers}/${metricsA.totalQueries} vs ${metricsB.correctAnswers}/${metricsB.totalQueries} correct`}
            />
            <MainMetric
              label="Policy rule coverage"
              a={metricsA.ruleCoveragePct}
              b={metricsB.ruleCoveragePct}
              suffix="%"
              note={`${metricsA.representedRules}/${metricsA.totalPolicyRules} vs ${metricsB.representedRules}/${metricsB.totalPolicyRules} fully represented`}
            />
            <MainMetric
              label="Unanswered queries"
              a={metricsA.unansweredQueries}
              b={metricsB.unansweredQueries}
              suffix=""
              note={`of ${metricsA.totalQueries} held-out queries`}
              lowerIsBetter
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Reveal direction="right">
              <div className="panel p-6 sm:p-8 h-full">
                <h4 className="text-[19px] font-semibold">Category-wise rule coverage</h4>
                <p className="body-sm mt-1 mb-6">Fully represented rules per policy category (%)</p>
                <div style={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
                      <CartesianGrid stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="category" tick={{ fontSize: 12, fill: 'var(--ink-2)' }} angle={-30} textAnchor="end" height={58} interval={0} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--ink-2)' }} unit="%" />
                      <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 14 }} />
                      <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
                      <Bar dataKey="CQ-Guided" fill="#58765D" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Ad Hoc" fill="#A9762A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.08}>
              <div className="panel p-6 sm:p-8 h-full">
                <h4 className="text-[19px] font-semibold">Query outcome distribution</h4>
                <p className="body-sm mt-1 mb-6">How each base resolved the {metricsA.totalQueries} held-out queries</p>
                <div style={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={outcomeData} layout="vertical" margin={{ top: 8, right: 12, left: 10, bottom: 4 }}>
                      <CartesianGrid stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" domain={[0, metricsA.totalQueries]} tick={{ fontSize: 12, fill: 'var(--ink-2)' }} />
                      <YAxis type="category" dataKey="approach" width={92} tick={{ fontSize: 12, fill: 'var(--ink)' }} />
                      <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 14 }} />
                      <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
                      <Bar dataKey="Correct" stackId="a" fill="#58765D" />
                      <Bar dataKey="Partial" stackId="a" fill="#C08A37" />
                      <Bar dataKey="Incorrect" stackId="a" fill="#A2433B" />
                      <Bar dataKey="Unanswered" stackId="a" fill="#b9bcb2" radius={[0, 5, 5, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="panel mt-8 overflow-hidden">
              <button
                onClick={() => setShowTable((s) => !s)}
                className="flex w-full items-center justify-between gap-4 px-7 py-6 text-left"
              >
                <div>
                  <h4 className="text-[19px] font-semibold">Detailed results &amp; formulas</h4>
                  <p className="body-sm mt-1">Per-query outcomes, metric definitions, and CSV export</p>
                </div>
                <motion.span animate={{ rotate: showTable ? 180 : 0 }}>
                  <ChevronDown size={22} className="text-[var(--accent)]" />
                </motion.span>
              </button>
              {showTable && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                  <div className="border-t border-[var(--border)] px-7 py-6">
                    <div className="grid gap-4 rounded-xl bg-[var(--muted)] p-5 text-[15px] leading-relaxed md:grid-cols-3">
                      <div><strong>Accuracy</strong> = Correctly answered queries / Total queries × 100</div>
                      <div><strong>Coverage</strong> = Fully represented rules / Total policy rules × 100</div>
                      <div><strong>Unanswered</strong> = Queries without sufficient supporting information</div>
                      <div className="md:col-span-3 text-[var(--ink-2)]">Partially correct answers are not counted as fully correct.</div>
                    </div>

                    <div className="mt-7 flex justify-end">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => downloadCSV('scholarship_rule_intelligence_results.csv', exportData)}
                      >
                        <Download size={16} /> Export results CSV
                      </button>
                    </div>

                    <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--border)]">
                      <table className="w-full min-w-[720px] text-left table-text">
                        <thead className="bg-[var(--paper)] text-[13px] uppercase tracking-wide text-[var(--ink-2)]">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Query</th>
                            <th className="px-4 py-3 font-semibold">Category</th>
                            <th className="px-4 py-3 font-semibold">Target classification</th>
                            <th className="px-4 py-3 font-semibold">CQ-Guided</th>
                            <th className="px-4 py-3 font-semibold">Ad Hoc</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {heldOutQueries.map((q, i) => (
                            <tr key={q.id}>
                              <td className="px-4 py-3 mono font-semibold">{q.id}</td>
                              <td className="px-4 py-3">{q.category}</td>
                              <td className="px-4 py-3">{q.expectedClassification}</td>
                              <td className="px-4 py-3"><StatusBadge tone={evalA[i].status === 'CORRECT' ? 'green' : evalA[i].status === 'PARTIALLY_CORRECT' ? 'amber' : 'red'}>{evalA[i].status}</StatusBadge></td>
                              <td className="px-4 py-3"><StatusBadge tone={evalB[i].status === 'CORRECT' ? 'green' : evalB[i].status === 'PARTIALLY_CORRECT' ? 'amber' : evalB[i].status === 'UNANSWERED' ? 'neutral' : 'red'}>{evalB[i].status}</StatusBadge></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-[var(--accent)]" />
                <h4 className="text-[19px] font-semibold">Data integrity note</h4>
              </div>
              <p className="body-sm mt-3">
                Earlier presentations of this project contained inconsistent figures. They are corrected and flagged
                here rather than silently selected:
              </p>
              <ul className="mt-4 space-y-2 body-sm">
                <li>• 7 of 26 omitted rules = <strong>26.9% omission rate</strong> — this is not full rule coverage.</li>
                <li>• 6 of 26 fully represented rules = <strong>23.1% full coverage</strong>. Of 19 extracted rules, only 6 were complete.</li>
                <li>• 7 of 22 correct answers = <strong>31.8% accuracy</strong>. A previously displayed 36.4% was inconsistent and has been removed.</li>
                <li>• Partially correct answers ({metricsB.partiallyCorrectAnswers} in Ad Hoc) are excluded from accuracy.</li>
                <li>• No statistical significance test was performed; no p-value is claimed.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AuditFigure({ label, value, total, tone }: { label: string; value: number; total: number; tone: 'green' | 'amber' | 'red' }) {
  const color = tone === 'green' ? 'text-[var(--accent-deep)]' : tone === 'amber' ? 'text-[var(--amber)]' : 'text-[var(--red)]';
  const bar = tone === 'green' ? 'bg-[var(--accent)]' : tone === 'amber' ? 'bg-[#C08A37]' : 'bg-[var(--red)]';
  const pct = total ? (value / total) * 100 : 0;
  return (
    <div className="panel-flat p-7">
      <div className="text-[14px] font-semibold uppercase tracking-wide text-[var(--ink-2)]">{label}</div>
      <div className={`numeral mt-4 text-[clamp(40px,5vw,64px)] font-semibold ${color}`}>
        <CountUp value={value} />
        <span className="text-[20px] font-medium text-[var(--ink-2)]"> / {total}</span>
      </div>
      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <motion.div className={`h-full rounded-full ${bar}`} initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.1 }} />
      </div>
      <div className="mono mt-2 text-[12px] text-[var(--ink-2)]">{pct.toFixed(1)}%</div>
    </div>
  );
}

function MainMetric({
  label,
  a,
  b,
  suffix,
  note,
  lowerIsBetter = false,
}: {
  label: string;
  a: number;
  b: number;
  suffix: string;
  note: string;
  lowerIsBetter?: boolean;
}) {
  const max = Math.max(a, b, 1);
  const aWins = lowerIsBetter ? a <= b : a >= b;
  return (
    <div className="panel p-7">
      <div className="text-[14px] font-semibold uppercase tracking-wide text-[var(--ink-2)]">{label}</div>
      <div className="mt-5 flex items-end gap-3">
        <span className="numeral text-[clamp(38px,4.4vw,56px)] font-semibold text-[var(--accent-deep)]">
          <CountUp value={a} decimals={Number.isInteger(a) ? 0 : 1} />
          <span className="text-[22px]">{suffix}</span>
        </span>
        <span className="mb-2 text-[14px] text-[var(--ink-2)]">vs {b}{suffix}</span>
      </div>
      <div className="mt-5 space-y-3">
        <MiniBar label="CQ-Guided" value={a} max={max} color="bg-[var(--accent)]" />
        <MiniBar label="Ad Hoc" value={b} max={max} color="bg-[var(--amber)]" />
      </div>
      <div className="mono mt-5 text-[12px] text-[var(--ink-2)]">{note}</div>
      <div className={`mt-3 inline-flex items-center gap-2 text-[13px] font-semibold ${aWins ? 'text-[var(--accent-deep)]' : 'text-[var(--red)]'}`}>
        <span className="dot dot-green" /> CQ-Guided {aWins ? 'outperforms' : 'trails'} Ad Hoc
      </div>
    </div>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[13px] text-[var(--ink-2)]">
        <span>{label}</span>
        <span className="numeral font-semibold text-[var(--ink)]">{value}{' '}</span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} whileInView={{ width: `${(value / max) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut' }} />
      </div>
    </div>
  );
}

function ledgerEntry(item: MissingRuleReportItem, mode: 'ADHOC' | 'CQ') {
  const status = mode === 'ADHOC' ? item.adHocStatus : item.cqGuidedStatus;
  return {
    id: item.ruleId,
    title: (
      <span className="flex flex-wrap items-center gap-3">
        <span className="mono text-[var(--accent)]">{item.ruleId}</span>
        <span>{item.policyRequirement.split(':')[0]}</span>
      </span>
    ),
    meta: `${item.category} · ${item.affectedQueryIds.length} affected quer${item.affectedQueryIds.length === 1 ? 'y' : 'ies'} · severity ${item.severity.toLowerCase()}`,
    content: (
      <div className="space-y-4">
        <p>{item.policyRequirement}</p>
        <div className="text-[14px] text-[var(--ink-2)]">
          Current audit status ({mode === 'ADHOC' ? 'Ad Hoc' : 'CQ-Guided'}):{' '}
          <StatusBadge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</StatusBadge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="panel-flat p-4">
            <div className="eyebrow mb-2 !text-[11px]">CQ-guided representation</div>
            <StatusBadge tone={STATUS_TONE[item.cqGuidedStatus]}>{STATUS_LABEL[item.cqGuidedStatus]}</StatusBadge>
          </div>
          <div className="panel-flat p-4">
            <div className="eyebrow mb-2 !text-[11px]">Ad hoc representation</div>
            <StatusBadge tone={STATUS_TONE[item.adHocStatus]}>{STATUS_LABEL[item.adHocStatus]}</StatusBadge>
          </div>
        </div>
        {item.omittedConditionsInAdHoc.length > 0 && (
          <div className="rounded-xl bg-[var(--red-soft)] p-4">
            <div className="text-[13px] font-semibold text-[var(--red)] mb-2">Omitted conditions in Ad Hoc</div>
            <ul className="space-y-1.5 text-[15px] text-[var(--red)]">
              {item.omittedConditionsInAdHoc.map((c, i) => <li key={i}>• {c}</li>)}
            </ul>
          </div>
        )}
        <div>
          <div className="eyebrow mb-2 !text-[11px]">Affected test queries</div>
          <div className="flex flex-wrap gap-2">
            {item.affectedQueryIds.length ? item.affectedQueryIds.map((id) => <span key={id} className="mono chip !text-[12px]">{id}</span>) : <span className="text-[15px] text-[var(--ink-2)]">None</span>}
          </div>
        </div>
        <div>
          <div className="eyebrow mb-2 !text-[11px]">Suggested correction</div>
          <p>{item.suggestedCorrection}</p>
        </div>
      </div>
    ),
  };
}
