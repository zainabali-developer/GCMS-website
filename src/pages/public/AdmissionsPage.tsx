import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, FileText, CalendarClock, Wallet, ListChecks } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import {
  getAdmissionsInfo,
  getAdmissionSteps,
  getAdmissionFaqs,
} from '../../services/publicData';
import type { AdmissionsInfo, AdmissionStep, AdmissionFaq } from '../../types/database';
import { friendlyError } from '../../lib/errors';

function FaqItem({ faq }: { faq: AdmissionFaq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink-100 py-4">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-medium text-ink-800">{faq.question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{faq.answer}</p>}
    </div>
  );
}

function List({ text }: { text: string | null }) {
  const items = (text ?? '').split('\n').map((v) => v.trim()).filter(Boolean);
  if (items.length === 0) return <p className="text-sm text-ink-500">Information will be updated by the college.</p>;
  return (
    <ul className="space-y-2 text-sm text-ink-600">
      {items.map((v, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" /> {v}
        </li>
      ))}
    </ul>
  );
}

export default function AdmissionsPage() {
  const [info, setInfo] = useState<AdmissionsInfo | null>(null);
  const [steps, setSteps] = useState<AdmissionStep[]>([]);
  const [faqs, setFaqs] = useState<AdmissionFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [i, s, f] = await Promise.all([getAdmissionsInfo(), getAdmissionSteps(), getAdmissionFaqs()]);
      setInfo(i);
      setSteps(s);
      setFaqs(f);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="container-page py-10">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="container-page py-10">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Admissions' }]} />
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Admissions</h1>
          <div className="rule-gold mt-4" />
          <p className="mt-5 leading-relaxed text-ink-600">
            {info?.overview ||
              'Admission details will be announced by the college. Please check back here or contact the admissions office for the latest updates.'}
          </p>
        </div>
        <Link to="/contact">
          <Button size="lg">Contact Admissions</Button>
        </Link>
      </div>

      {steps.length > 0 && (
        <section className="mt-14">
          <SectionHeading title="Admission Process" />
          <ol className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step.id} className="rounded-lg border border-ink-100 bg-white p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 font-serif text-sm font-semibold text-white">
                  {step.step_number}
                </span>
                <h3 className="mt-3 font-serif text-base font-semibold text-ink-900">{step.title}</h3>
                {step.description && <p className="mt-1.5 text-sm text-ink-600">{step.description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section id="eligibility" className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink-900">
            <ListChecks className="h-5 w-5 text-emerald-700" /> Eligibility
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600">
            {info?.eligibility || 'Information will be updated by the college.'}
          </p>
        </Card>
        <Card>
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink-900">
            <FileText className="h-5 w-5 text-emerald-700" /> Required Documents
          </h2>
          <div className="mt-3">
            <List text={info?.required_documents ?? null} />
          </div>
        </Card>
        <Card>
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink-900">
            <CalendarClock className="h-5 w-5 text-emerald-700" /> Important Dates
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600">
            {info?.important_dates || 'Admission dates will be announced by the college.'}
          </p>
        </Card>
        <Card id="fees">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink-900">
            <Wallet className="h-5 w-5 text-emerald-700" /> Fee Information
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600">
            {info?.fee_info || 'Fee details will be announced by the college.'}
          </p>
        </Card>
      </section>

      {faqs.length > 0 && (
        <section className="mt-14 max-w-3xl">
          <SectionHeading title="Frequently Asked Questions" />
          <div className="mt-6">
            {faqs.map((faq) => (
              <FaqItem key={faq.id} faq={faq} />
            ))}
          </div>
        </section>
      )}

      {info?.contact_note && (
        <section className="mt-14 rounded-lg bg-emerald-50/60 p-6">
          <p className="text-sm text-ink-700">{info.contact_note}</p>
        </section>
      )}
    </div>
  );
}
