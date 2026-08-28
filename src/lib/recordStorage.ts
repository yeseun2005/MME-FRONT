const RECORD_PREFIX = 'mme-record:';
const LEGACY_RECORDS_KEY = 'mme-records';

function recordStorageKey(recordId: string) {
  return `${RECORD_PREFIX}${encodeURIComponent(recordId)}`;
}

function localRecordStorageKeys() {
  const keys: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(RECORD_PREFIX)) keys.push(key);
  }
  return keys;
}

export function readLocalRecords<T>() {
  const records: Record<string, T> = {};
  const legacyValue = localStorage.getItem(LEGACY_RECORDS_KEY);

  if (legacyValue) {
    try {
      Object.assign(records, JSON.parse(legacyValue) as Record<string, T>);
    } catch {
      localStorage.removeItem(LEGACY_RECORDS_KEY);
    }
  }

  localRecordStorageKeys().forEach((storageKey) => {
    const value = localStorage.getItem(storageKey);
    if (!value) return;
    try {
      const recordId = decodeURIComponent(storageKey.slice(RECORD_PREFIX.length));
      records[recordId] = JSON.parse(value) as T;
    } catch {
      localStorage.removeItem(storageKey);
    }
  });

  return records;
}

export function writeLocalRecords<T>(records: Record<string, T>) {
  const nextStorageKeys = new Set<string>();
  Object.entries(records).forEach(([recordId, record]) => {
    const storageKey = recordStorageKey(recordId);
    nextStorageKeys.add(storageKey);
    localStorage.setItem(storageKey, JSON.stringify(record));
  });

  localRecordStorageKeys().forEach((storageKey) => {
    if (!nextStorageKeys.has(storageKey)) localStorage.removeItem(storageKey);
  });
  localStorage.removeItem(LEGACY_RECORDS_KEY);
}

export function removeLocalRecord(recordId: string) {
  localStorage.removeItem(recordStorageKey(recordId));
}

export function clearLocalRecords() {
  localRecordStorageKeys().forEach((storageKey) => localStorage.removeItem(storageKey));
  localStorage.removeItem(LEGACY_RECORDS_KEY);
}

export function localRecordCount() {
  return localRecordStorageKeys().length;
}