import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

type Direction = 'up' | 'down' | 'left' | 'right';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  once?: boolean;
}

export function Reveal({ children, delay = 0, direction = 'up', className = '', once = true }: RevealProps) {
  const reduce = useReducedMotion();
  const offsets: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: 26 },
    down: { x: 0, y: -26 },
    left: { x: 26, y: 0 },
    right: { x: -26, y: 0 },
  };
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.18, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = '', gap = 0.09 }: { children: React.ReactNode; className?: string; gap?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({ value, decimals = 0, suffix = '', prefix = '', duration = 1400, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={`numeral ${className}`}>
      {prefix}
      {(reduce && inView ? value : display).toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <div className="eyebrow mb-5 flex items-center gap-3">
        <span className="h-px w-8 bg-[var(--accent)]" />
        {eyebrow}
      </div>
      <h2 className="section-title">{title}</h2>
      {description && <div className="body-lg text-[var(--ink-2)] mt-6 max-w-2xl">{description}</div>}
    </Reveal>
  );
}

export type Tone = 'green' | 'amber' | 'red' | 'neutral';

export function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const cls =
    tone === 'green'
      ? 'badge-green'
      : tone === 'amber'
        ? 'badge-amber'
        : tone === 'red'
          ? 'badge-red'
          : 'badge-neutral';
  return <span className={`badge ${cls}`}>{children}</span>;
}

export interface AccordionEntry {
  id: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  content: React.ReactNode;
}

export function Accordion({ entries, defaultOpen }: { entries: AccordionEntry[]; defaultOpen?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const isOpen = open === entry.id;
        return (
          <div className="accordion-item" key={entry.id}>
            <button className="accordion-trigger" onClick={() => setOpen(isOpen ? null : entry.id)} aria-expanded={isOpen}>
              <span className="flex flex-col gap-1">
                <span>{entry.title}</span>
                {entry.meta && <span className="text-[13px] text-[var(--ink-2)] font-normal">{entry.meta}</span>}
              </span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="mt-1 text-[var(--accent)]">
                <ChevronDown size={19} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-1 border-t border-[var(--border)] body-sm">{entry.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="sticky top-0 z-10 bg-[var(--surface)]/95 backdrop-blur border-b border-[var(--border)] px-7 py-5 flex items-start justify-between gap-4">
              <div>
                {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
                <div className="sub-title">{title}</div>
              </div>
              <button className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors" onClick={onClose} aria-label="Close panel">
                <X size={22} />
              </button>
            </div>
            <div className="px-7 py-7">{children}</div>
            {footer && <div className="px-7 py-5 border-t border-[var(--border)] bg-[var(--paper)]">{footer}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function StatBlock({
  label,
  value,
  hint,
  tone = 'green',
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: Tone;
}) {
  const dot = tone === 'green' ? 'dot-green' : tone === 'amber' ? 'dot-amber' : tone === 'red' ? 'dot-red' : '';
  return (
    <div>
      <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--ink-2)]">
        <span className={`dot ${dot}`} /> {label}
      </div>
      <div className="kicker-number mt-3">{value}</div>
      {hint && <p className="body-sm mt-2">{hint}</p>}
    </div>
  );
}
