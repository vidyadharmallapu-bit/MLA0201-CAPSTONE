import React, { useCallback, useEffect, useState } from 'react';
import { Navbar } from './ui/Navbar';
import { CHAPTERS } from './ui/chapterList';
import { Overview } from './chapters/Overview';
import { Research } from './chapters/Research';
import { Methodology } from './chapters/Methodology';
import { PolicyExplorer } from './chapters/PolicyExplorer';
import { Approaches } from './chapters/Approaches';
import { GraphExplorer } from './chapters/GraphExplorer';
import { TestingLab } from './chapters/TestingLab';
import { Results } from './chapters/Results';
import { Conclusion } from './chapters/Conclusion';

import { INITIAL_POLICY_RULES } from './data/policyRules';
import { INITIAL_COMPETENCY_QUESTIONS } from './data/competencyQuestions';
import { INITIAL_CQ_GUIDED_KB, INITIAL_AD_HOC_KB } from './data/knowledgeBases';
import { HELD_OUT_QUERIES } from './data/heldOutQueries';

import { evaluateAllHeldOutQueries } from './engine/evaluator';
import { calculateMetrics } from './engine/metrics';

export function App() {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const evalA = evaluateAllHeldOutQueries(HELD_OUT_QUERIES, 'CQ_GUIDED', INITIAL_CQ_GUIDED_KB, INITIAL_POLICY_RULES);
  const evalB = evaluateAllHeldOutQueries(HELD_OUT_QUERIES, 'AD_HOC', INITIAL_AD_HOC_KB, INITIAL_POLICY_RULES);
  const metricsA = calculateMetrics(HELD_OUT_QUERIES, evalA, INITIAL_CQ_GUIDED_KB, INITIAL_POLICY_RULES);
  const metricsB = calculateMetrics(HELD_OUT_QUERIES, evalB, INITIAL_AD_HOC_KB, INITIAL_POLICY_RULES);

  useEffect(() => {
    const onScroll = () => {
      const offset = window.scrollY + 160;
      let current = CHAPTERS[0].id as string;
      for (const chapter of CHAPTERS) {
        const el = document.getElementById(chapter.id);
        if (el && el.offsetTop <= offset) current = chapter.id;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const resetDemoData = () => {
    ['capstone_cqs', 'capstone_cq_kb', 'capstone_adhoc_kb'].forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar activeSection={activeSection} onNavigate={scrollTo} />

      <main>
        <Overview onExplore={() => scrollTo('research')} onDemo={() => scrollTo('testing-lab')} />
        <Research />
        <Methodology />

        <section id="knowledge-base" className="chapter section-pad border-t border-[var(--border)]">
          <PolicyExplorer
            rules={INITIAL_POLICY_RULES}
            cqKB={INITIAL_CQ_GUIDED_KB}
            adHocKB={INITIAL_AD_HOC_KB}
            questions={INITIAL_COMPETENCY_QUESTIONS}
          />
          <div className="container-x">
            <Approaches
              questions={INITIAL_COMPETENCY_QUESTIONS}
              rules={INITIAL_POLICY_RULES}
              cqKB={INITIAL_CQ_GUIDED_KB}
              adHocKB={INITIAL_AD_HOC_KB}
            />
            <GraphExplorer
              cqKB={INITIAL_CQ_GUIDED_KB}
              adHocKB={INITIAL_AD_HOC_KB}
              policyRules={INITIAL_POLICY_RULES}
              heldOutQueries={HELD_OUT_QUERIES}
            />
          </div>
        </section>

        <TestingLab
          cqKB={INITIAL_CQ_GUIDED_KB}
          adHocKB={INITIAL_AD_HOC_KB}
          policyRules={INITIAL_POLICY_RULES}
          heldOutQueries={HELD_OUT_QUERIES}
        />
        <Results
          metricsA={metricsA}
          metricsB={metricsB}
          cqKB={INITIAL_CQ_GUIDED_KB}
          adHocKB={INITIAL_AD_HOC_KB}
          policyRules={INITIAL_POLICY_RULES}
          heldOutQueries={HELD_OUT_QUERIES}
        />
        <Conclusion metricsA={metricsA} metricsB={metricsB} />
      </main>

      <footer className="border-t border-white/10 bg-[var(--ink)] text-white">
        <div className="container-x flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-[14px] font-bold">SI</span>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)]">
                Computer Science Capstone Research
              </div>
              <div className="mt-1 text-[17px] font-semibold">Scholarship Rule Intelligence</div>
              <div className="mt-1 text-[15px] text-white/55">
                Detecting missing scholarship rules through competency-question-guided knowledge engineering.
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <button onClick={resetDemoData} className="text-[14px] text-white/55 underline underline-offset-4 hover:text-white">
              Reset demonstration data
            </button>
            <div className="mono text-[12px] text-white/40">
              LOCAL DETERMINISTIC ENGINE · NO CLOUD MODEL · ALL FIGURES COMPUTED FROM SOURCE DATA
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
