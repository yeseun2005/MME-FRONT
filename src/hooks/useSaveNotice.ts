import { useEffect, useState } from 'react';
import type { SaveNotice } from '../types';

export function useSaveNotice() {
  const [saveNotice, setSaveNotice] = useState<SaveNotice | null>(null);

  useEffect(() => {
    if (!saveNotice) return;
    const timer = window.setTimeout(() => setSaveNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [saveNotice]);

  function notify(title: string, detail: string) {
    setSaveNotice({ id: Date.now(), title, detail });
  }

  return { saveNotice, notify, dismiss: () => setSaveNotice(null) };
}