import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, FlaskConical, Menu, X } from 'lucide-react';
import { CHAPTERS } from './chapterList';

interface Props {
  activeSection: string;
  onNavigate: (id: string) => void;
}

export function Navbar({ activeSection, onNavigate }: Props) {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(h > 0 ? document.documentElement.scrollTop / h : 0);
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress * 100}%` }} />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all ${
          scrolled ? 'border-b border-[var(--border)] bg-[var(--bg)]/92 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="container-x flex items-center justify-between gap-4 py-4">
          <button onClick={() => go('overview')} className="flex items-center gap-3 text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ink)] text-[14px] font-bold text-white">
              SI
            </span>
            <span className="hidden sm:block">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Capstone Research
              </span>
              <span className="block text-[15px] font-semibold leading-tight">Scholarship Rule Intelligence</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => go(c.id)}
                className={`whitespace-nowrap rounded-full px-2.5 py-2 text-[12.5px] font-medium transition-colors ${
                  activeSection === c.id ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-2)] hover:bg-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <span className="mono mr-1 text-[9px] opacity-60">{String(i + 1).padStart(2, '0')}</span>
                {c.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go('testing-lab')}
              className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-[var(--accent)] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--accent-deep)] sm:inline-flex"
            >
              <FlaskConical size={15} /> Live Demo <ArrowUpRight size={14} />
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="rounded-lg p-2 text-[var(--ink)] hover:bg-[var(--muted)] lg:hidden"
              aria-label="Toggle navigation"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-0 top-[73px] z-40 max-h-[calc(100vh-73px)] overflow-y-auto border-b border-[var(--border)] bg-[var(--bg)] px-5 py-4 shadow-lg lg:hidden"
        >
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => go(c.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[16px] font-medium ${
                activeSection === c.id ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-2)] hover:bg-[var(--muted)]'
              }`}
            >
              <span className="mono text-[11px] opacity-60">{String(i + 1).padStart(2, '0')}</span>
              {c.label}
            </button>
          ))}
        </motion.div>
      )}
    </>
  );
}
