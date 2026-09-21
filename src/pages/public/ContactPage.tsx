import { FormEvent, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { submitContactMessage } from '../../services/publicData';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/errors';

interface FormState {
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const EMPTY: FormState = { full_name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.full_name.trim()) errs.full_name = 'Please enter your name.';
    if (!form.email.trim()) errs.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address.';
    if (!form.message.trim()) errs.message = 'Please enter a message.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitContactMessage({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
      });
      showToast('Message submitted successfully.', 'success');
      setForm(EMPTY);
    } catch (err) {
      showToast(friendlyError(err, 'Unable to send your message. Please try again.'), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const mapSrc =
    settings.map_embed_url ||
    `https://www.google.com/maps?q=${encodeURIComponent(
      settings.address || 'Government College of Management Sciences, Jinnahabad Habibullah Colony, Abbottabad, Pakistan'
    )}&output=embed`;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Contact' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Contact Us</h1>
        <div className="rule-gold mt-4" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="space-y-5">
            {settings.address && (
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-800">Address</p>
                  <p className="text-sm text-ink-600">{settings.address}</p>
                </div>
              </div>
            )}
            {settings.phone && (
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-800">Phone</p>
                  <a href={`tel:${settings.phone}`} className="text-sm text-ink-600 hover:text-emerald-700">
                    {settings.phone}
                  </a>
                </div>
              </div>
            )}
            {settings.email && (
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-800">Email</p>
                  <a href={`mailto:${settings.email}`} className="text-sm text-ink-600 hover:text-emerald-700">
                    {settings.email}
                  </a>
                </div>
              </div>
            )}
            {settings.office_hours && (
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-800">Office Hours</p>
                  <p className="text-sm text-ink-600">{settings.office_hours}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-ink-100 shadow-card">
            <iframe
              title="GCMS Abbottabad location"
              src={mapSrc}
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-ink-100 bg-white p-6 shadow-card sm:p-8">
          <h2 className="font-serif text-lg font-semibold text-ink-900">Send us a message</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              required
              value={form.full_name}
              onChange={(e) => setField('full_name', e.target.value)}
              error={errors.full_name}
            />
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              error={errors.email}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
            <Input label="Subject" value={form.subject} onChange={(e) => setField('subject', e.target.value)} />
          </div>
          <Textarea
            label="Message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setField('message', e.target.value)}
            error={errors.message}
          />
          <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
            <Send className="h-4 w-4" /> Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
