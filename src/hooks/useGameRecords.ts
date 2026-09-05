import { useCallback, useEffect, useState } from 'react';
import type { GameRecord, RecordMode } from '../types';
import {
  clearLocalRecords,
  readLocalRecords,
  removeLocalRecord,
  writeLocalRecords,
} from '../lib/recordStorage';

function normalizeRecords(records: Record<string, GameRecord>) {
  return Object.fromEntries(
    Object.entries(records).map(([key, record]) => {
      // 과거 버전이 저장해 둔 blob URL은 이미 무효이므로 버린다.
      const { videoUrl: _legacyVideoUrl, ...rest } = record as GameRecord & { videoUrl?: string };
      return [key, rest.mode === '빠른 대전' ? { ...rest, tier: '언랭' } : rest];
    }),
  );
}

export function useGameRecords() {
  const [records, setRecords] = useState<Record<string, GameRecord>>({});

  useEffect(() => {
    const saved = readLocalRecords<GameRecord>();
    if (Object.keys(saved).length) {
      const normalized = normalizeRecords(saved);
      setRecords(normalized);
      writeLocalRecords(normalized);
    }
  }, []);

  const saveRecord = useCallback((date: string, mode: RecordMode, data: Omit<GameRecord, 'date' | 'mode'>) => {
    setRecords((current) => {
      const next = { ...current, [`${date}-${mode}`]: { date, mode, ...data } };
      writeLocalRecords(next);
      return next;
    });
  }, []);

  const deleteRecord = useCallback((date: string, mode: RecordMode) => {
    setRecords((current) => {
      const key = `${date}-${mode}`;
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      removeLocalRecord(key);
      return next;
    });
  }, []);

  const clearRecords = useCallback(() => {
    setRecords({});
    clearLocalRecords();
  }, []);

  return { records, saveRecord, deleteRecord, clearRecords };
}