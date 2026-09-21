export function friendlyError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = String((error as { message: unknown }).message ?? '');
    if (msg.includes('duplicate key')) return 'An entry with that value already exists.';
    if (msg.toLowerCase().includes('jwt') || msg.toLowerCase().includes('not authenticated')) {
      return 'Your session has expired. Please log in again.';
    }
    if (msg.includes('row-level security') || msg.includes('permission denied')) {
      return "You don't have permission to do that.";
    }
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      return 'Unable to reach the server. Check your connection and try again.';
    }
    if (msg.trim().length > 0) return msg;
  }
  return fallback;
}
