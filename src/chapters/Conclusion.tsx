import React from 'react';
import { ArrowUpRight, CheckCircle2, FlaskConical } from 'lucide-react';
import { Accordion, CountUp, Reveal, Stagger, StaggerItem } from '../ui/primitives';
import { EvaluationMetrics } from '../types';

interface Props {
  metricsA: EvaluationMetrics;
  metricsB: EvaluationMetrics;
}

export function Conclusion({ metricsA, metricsB }: Props) {
  const accuracyDelta = Math.round((metricsA.queryAccuracyPct - metricsB.queryAccuracyPct) * 10) / 10;
  const coverageDelta = Math.round((metricsA.ruleCoveragePct - metricsB.ruleCoveragePct) * 10) / 10;
  const unansweredDelta = metricsB.unansweredQueries - metricsA.unansweredQueries;
  const confirmed = accuracyDelta > 0 && coverageDelta > 0 && unansweredDelta > 0;

  return (
    <section id="conclusion" className="chapter section-pad border-t border-[var(--border)]">
      <div className="container-x">
        <div className="max-w-4xl">
          <Reveal>
            <div className="eyebrow mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--accent)]" />
              Chapter 07 · Conclusion
            </div>
            <h2 className="section-title">
              Better Questions. Better Knowledge. <em className="text-[var(--accent)]">More Reliable Answers.</em>
            </h2>
            <p className="body-lg text-[var(--ink-2)] mt-7">
              The difference between the two approaches was not computational sophistication. It was whether the
              development process asked the questions that forced missing rules into the open.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid gap-5 md:grid-cols-3">
          <DeltaCard label="Query accuracy advantage" value={accuracyDelta} suffix=" pp" note={`${metricsA.queryAccuracyPct}% vs ${metricsB.queryAccuracyPct}%`} />
          <DeltaCard label="Rule coverage advantage" value={coverageDelta} suffix=" pp" note={`${metricsA.ruleCoveragePct}% vs ${metricsB.ruleCoveragePct}%`} />
          <DeltaCard label="Fewer unanswered queries" value={unansweredDelta} suffix="" note={`${metricsA.unansweredQueries} vs ${metricsB.unansweredQueries} queries`} />
        </Stagger>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal direction="right">
            <div className="panel p-9 h-full">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--green-soft)] text-[var(--accent-deep)]">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div className="eyebrow !text-[11px]">Hypothesis outcome</div>
                  <h3 className="text-[22px] font-semibold">{confirmed ? 'Supported by the experiment' : 'Not fully supported'}</h3>
                </div>
              </div>
              <p className="body mt-6 text-[var(--ink-2)]">
                {confirmed
                  ? `Under identical policy material and a ${metricsA.totalPolicyRules}-rule source encoded in the same time budget, competency-question-guided development produced higher query accuracy (+${accuracyDelta} percentage points), higher full rule coverage (+${coverageDelta} points), and ${unansweredDelta} fewer unanswered queries than ad hoc development.`
                  : `The predicted pattern did not hold across all three measures in this run. Accuracy difference: ${accuracyDelta} points; coverage difference: ${coverageDelta} points; unanswered-query difference: ${unansweredDelta}.`}
              </p>
              <p className="body-sm mt-5">
                This is a deterministic, single-run comparison. It supports the directional hypothesis but does not
                establish statistical significance.
              </p>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.08}>
            <div className="panel p-9 h-full">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--accent-deep)]">
                  <FlaskConical size={21} />
                </div>
                <div>
                  <div className="eyebrow !text-[11px]">Experimental limitations</div>
                  <h3 className="text-[22px] font-semibold">What this study does not claim</h3>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  'A synthetic demonstration policy, not a live government scheme.',
                  'A small held-out suite of 22 queries across nine categories.',
                  'A deterministic local matcher rather than a generative reasoning system.',
                  'One development run per approach; no repeated trials or significance test.',
                ].map((x) => (
                  <li key={x} className="body-sm flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 max-w-3xl">
          <Accordion
            entries={[
              {
                id: 'summary',
                title: 'Final research summary',
                meta: 'The finding in one paragraph',
                content: (
                  <p>
                    Competency questions acted as a specification for completeness. By stating in advance what the
                    knowledge base must be able to answer, they surfaced rules that a time-pressured ad hoc read
                    overlooked — most visibly the agricultural land ceiling, the orphan income exemption, medical
                    attendance condonation, and special-category riders. Those omissions propagated directly into
                    incorrect and unanswered queries. The study demonstrates that missing-rule detection is a
                    measurable engineering outcome, not a vague quality concern.
                  </p>
                ),
              },
              {
                id: 'future',
                title: 'Future research directions',
                meta: 'Where the work goes next',
                content: (
                  <div className="space-y-3">
                    {[
                      'Repeat the experiment with multiple developers and randomized policy order to test generalizability.',
                      'Expand the held-out suite and add statistical significance testing.',
                      'Evaluate hybrid workflows where ad hoc extraction is followed by automated CQ-based gap audits.',
                      'Apply the method to real public scholarship policies with expert-validated gold standards.',
                    ].map((x) => (
                      <p key={x} className="flex gap-3">
                        <ArrowUpRight size={17} className="mt-1 shrink-0 text-[var(--accent)]" />
                        {x}
                      </p>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function DeltaCard({ label, value, suffix, note }: { label: string; value: number; suffix: string; note: string }) {
  return (
    <StaggerItem>
      <div className="panel p-8 h-full">
        <div className="text-[14px] font-semibold uppercase tracking-wide text-[var(--ink-2)]">{label}</div>
        <div className="numeral mt-5 text-[clamp(44px,5vw,68px)] font-semibold text-[var(--accent-deep)]">
          +<CountUp value={value} decimals={Number.isInteger(value) ? 0 : 1} />
          <span className="text-[24px]">{suffix}</span>
        </div>
        <div className="mono mt-3 text-[13px] text-[var(--ink-2)]">{note}</div>
      </div>
    </StaggerItem>
  );
}
