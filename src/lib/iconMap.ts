import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';

export function resolveIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Sparkles;
  const icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? Sparkles;
}
