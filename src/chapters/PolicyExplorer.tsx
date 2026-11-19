import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Drawer, Reveal, StatusBadge, Tone } from '../ui/primitives';
import { CompetencyQuestion, KnowledgeBaseRule, PolicyRule } from '../types';

const CATEGORIES = [
  'Eligibility',
  'Income',
  'Academic',
  'Attendance',
  'Documents',
  'Renewal',
  'Deadline',
  'Exclusions',
  'Special',
] as const;

const categoryLabel = (c: string) => (c === 'Special' ? 'Special Conditions' : c);

function adHocTone(ruleId: string, kb: KnowledgeBaseRule[]): { tone: Tone; label: string } {
  const r = kb.find((k) => k.ruleId === ruleId);
  if (!r) return { tone: 'red', label: 'Missing' };
  if (r.omittedConditions && r.omittedConditions.length > 0) return { tone: 'amber', label: 'Partial' };
  return { tone: 'green', label: 'Verified' };
}

interface Props {
  rules: PolicyRule[];
  cqKB: KnowledgeBaseRule[];
  adHocKB: KnowledgeBaseRule[];
  questions: CompetencyQuestion[];
}

export function PolicyExplorer({ rules, cqKB, adHocKB, questions }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [selected, setSelected] = useState<PolicyRule | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rules.filter(
      (r) =>
        (category === 'All' || r.category === category) &&
        (!q ||
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q))
    );
  }, [rules, query, category]);

  const relatedCQs = selected ? questions.filter((q) => q.associatedRuleIds.includes(selected.id)) : [];
  const cqRule = selected ? cqKB.find((k) => k.ruleId === selected.id) : undefined;
  const adRule = selected ? adHocKB.find((k) => k.ruleId === selected.id) : undefined;
  const adStatus = selected ? adHocTone(selected.id, adHocKB) : null;

  return (
    <div className="container-x">
      <div className="max-w-3xl">
        <Reveal>
          <div className="eyebrow mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--accent)]" />
            Chapter 04 · Knowledge Base
          </div>
          <h2 className="section-title">The policy, decomposed.</h2>
          <p className="body-lg text-[var(--ink-2)] mt-6">
            Twenty-six atomic rules across nine categories. Browse the source policy and inspect exactly how each
            approach represented it — without reading all 26 descriptions at once.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <div className="panel mt-14 overflow-hidden">
          <div className="grid lg:grid-cols-[290px_1fr]">
            <aside className="border-b border-[var(--border)] bg-[var(--paper)] p-6 lg:border-b-0 lg:border-r">
              <div className="relative">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-2)]" />
                <input
                  className="field !pl-11 text-[15px]"
                  placeholder="Search rules or IDs…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="eyebrow mt-7 mb-3 !text-[11px]">Categories</div>
              <nav className="flex flex-wrap gap-2 lg:flex-col">
                {['All', ...CATEGORIES].map((cat) => {
                  const count = cat === 'All' ? rules.length : rules.filter((r) => r.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[15px] transition-colors ${
                        category === cat ? 'bg-[var(--ink)] text-white font-semibold' : 'text-[var(--ink-2)] hover:bg-[var(--muted)]'
                      }`}
                    >
                      <span>{cat === 'All' ? 'All rules' : categoryLabel(cat)}</span>
                      <span className={`mono text-[12px] ${category === cat ? 'text-white/60' : 'text-[var(--ink-2)]/70'}`}>{count}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            <div className="p-6 lg:p-8">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[14px] font-medium text-[var(--ink-2)]">
                  Showing <strong className="text-[var(--ink)]">{filtered.length}</strong> of {rules.length} rules
                </span>
                <span className="mono text-[12px] text-[var(--ink-2)]">SOURCE: SYNTH-SCHOLARSHIP-2026</span>
              </div>

              {filtered.length === 0 ? (
                <div className="py-16 text-center text-[var(--ink-2)]">No rules match your search.</div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {filtered.map((rule) => {
                    const ad = adHocTone(rule.id, adHocKB);
                    return (
                      <button
                        key={rule.id}
                        onClick={() => setSelected(rule)}
                        className="group w-full py-6 text-left first:pt-0"
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="mono rounded-md bg-[var(--muted)] px-2.5 py-1 text-[12px] font-semibold text-[var(--accent-deep)]">
                            {rule.id}
                          </span>
                          <span className="chip !py-1 !text-[12px]">{categoryLabel(rule.category)}</span>
                          <span className="ml-auto flex items-center gap-2">
                            <StatusBadge tone={ad.tone}>Ad hoc · {ad.label}</StatusBadge>
                          </span>
                        </div>
                        <h3 className="mt-3 text-[20px] font-semibold group-hover:text-[var(--accent-deep)] transition-colors">
                          {rule.title}
                        </h3>
                        <p className="body-sm mt-1.5 line-clamp-2">{rule.description}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        eyebrow={selected ? `${selected.id} · ${categoryLabel(selected.category)}` : ''}
        title={selected?.title ?? ''}
      >
        {selected && (
          <div className="space-y-8">
            <p className="body">{selected.description}</p>

            <div>
              <div className="eyebrow mb-3">Conditions</div>
              <ul className="space-y-3">
                {selected.conditions.map((c, i) => (
                  <li key={i} className="body-sm flex gap-3">
                    <span className="mono mt-1 text-[12px] text-[var(--accent)]">{String(i + 1).padStart(2, '0')}</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)]">
              <div className="bg-[var(--surface)] p-5">
                <div className="eyebrow mb-2 !text-[11px]">Source reference</div>
                <p className="text-[15px] font-medium">{selected.sourceSection}</p>
              </div>
              <div className="bg-[var(--surface)] p-5">
                <div className="eyebrow mb-2 !text-[11px]">Requirement</div>
                <p className="text-[15px] font-medium">{selected.isMandatory ? 'Mandatory' : 'Conditional / optional'}</p>
              </div>
            </div>

            <div>
              <div className="eyebrow mb-3">Knowledge base representation</div>
              <div className="space-y-3">
                <RepresentationRow
                  name="CQ-Guided KB"
                  status={<StatusBadge tone="green">Verified</StatusBadge>}
                  extracted={cqRule?.extractedConditions ?? []}
                  omitted={[]}
                />
                <RepresentationRow
                  name="Ad Hoc KB"
                  status={<StatusBadge tone={adStatus!.tone}>{adStatus!.label}</StatusBadge>}
                  extracted={adRule?.extractedConditions ?? []}
                  omitted={adRule?.omittedConditions ?? (adRule ? [] : selected.conditions)}
                />
              </div>
            </div>

            <div>
              <div className="eyebrow mb-3">Associated competency questions</div>
              {relatedCQs.length ? (
                <div className="space-y-3">
                  {relatedCQs.map((cq) => (
                    <div key={cq.id} className="panel-flat p-4">
                      <div className="mono text-[12px] text-[var(--accent)] mb-1">{cq.id}</div>
                      <p className="text-[16px] font-medium">{cq.question}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="body-sm">No competency question directly references this rule.</p>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function RepresentationRow({
  name,
  status,
  extracted,
  omitted,
}: {
  name: string;
  status: React.ReactNode;
  extracted: string[];
  omitted: string[];
}) {
  return (
    <div className="panel-flat p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">{name}</span>
        {status}
      </div>
      <div className="mt-4 space-y-2">
        {extracted.length > 0 && (
          <div className="text-[14px] text-[var(--ink-2)]">
            <strong className="text-[var(--ink)]">Represented:</strong> {extracted.join(' · ')}
          </div>
        )}
        {omitted.length > 0 && (
          <div className="rounded-lg bg-[var(--red-soft)] p-3 text-[14px] text-[var(--red)]">
            <strong>{"Not represented: "}</strong>
            {omitted.join(' · ')}
          </div>
        )}
        {extracted.length === 0 && omitted.length === 0 && (
          <div className="text-[14px] text-[var(--ink-2)]">No encoding present in this knowledge base.</div>
        )}
      </div>
    </div>
  );
}
