import { useCallback, useEffect, useState } from 'react';
import type { GameRecord, RecordMode } from '../types';
import {
  clearLocalRecords,
  readLocalRecords,
  removeLocalRecord,
  writeLocalRecords,
} from '../lib/recordStorage';

function normalizeQuickPlayRanks(records: Record<string, GameRecord>) {
  return Object.fromEntries(
    Object.entries(records).map(([key, record]) => [
      key,
      record.mode === '빠른 대전' ? { ...record, tier: '언랭' } : record,
    ]),
  );
}

export function useGameRecords() {
  const [records, setRecords] = useState<Record<string, GameRecord>>({});

  useEffect(() => {
    const saved = readLocalRecords<GameRecord>();
    if (Object.keys(saved).length) {
      const normalized = normalizeQuickPlayRanks(saved);
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