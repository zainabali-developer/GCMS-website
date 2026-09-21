import { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, Phone } from 'lucide-react';
import { listAll, updateRow, deleteRow } from '../../services/resource';
import type { ContactMessage } from '../../types/database';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/errors';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listAll<ContactMessage>('contact_messages', { orderBy: 'created_at', ascending: false });
      setMessages(data);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(msg: ContactMessage) {
    try {
      await updateRow('contact_messages', msg.id, { is_read: !msg.is_read });
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m)));
    } catch (err) {
      showToast(friendlyError(err), 'error');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRow('contact_messages', deleteTarget.id);
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      showToast('Message deleted.', 'success');
      setDeleteTarget(null);
    } catch (err) {
      showToast(friendlyError(err, 'Unable to delete this message.'), 'error');
    } finally {
      setDeleting(false);
    }
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-ink-900">Contact Messages</h1>
        <p className="text-sm text-ink-500">
          {messages.length} total{unreadCount > 0 && ` · ${unreadCount} unread`}
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Submissions from the public Contact page will appear here."
        />
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card key={msg.id} className={!msg.is_read ? 'border-emerald-300 bg-emerald-50/40' : ''}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink-900">{msg.full_name}</h3>
                    {!msg.is_read && <Badge tone="emerald">New</Badge>}
                    {msg.subject && <Badge tone="ink">{msg.subject}</Badge>}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                    <a href={`mailto:${msg.email}`} className="hover:text-emerald-700">
                      {msg.email}
                    </a>
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {msg.phone}
                      </span>
                    )}
                    <span>{new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-ink-700">{msg.message}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() => toggleRead(msg)}
                    aria-label={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                    title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                    className="rounded-md p-2 text-ink-500 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {msg.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(msg)}
                    aria-label="Delete message"
                    title="Delete message"
                    className="rounded-md p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete message"
        message={`Delete the message from "${deleteTarget?.full_name ?? ''}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
