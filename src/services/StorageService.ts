/**
 * Typed wrapper around localStorage.
 * Each instance owns one key and validates stored data with a type guard,
 * so corrupted or outdated data falls back to a safe default instead of crashing the app.
 */
export class StorageService<T> {
  private readonly key: string;
  private readonly isValid: (value: unknown) => value is T;
  private readonly fallback: T;

  constructor(key: string, isValid: (value: unknown) => value is T, fallback: T) {
    this.key = key;
    this.isValid = isValid;
    this.fallback = fallback;
  }

  load(): T {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw === null) return this.fallback;
      const data: unknown = JSON.parse(raw);
      return this.isValid(data) ? data : this.fallback;
    } catch {
      return this.fallback;
    }
  }

  save(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch {
      // Storage can be full or disabled (private mode); the in-memory state still works.
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {
      // Storage can be disabled; there is nothing left to remove in that case.
    }
  }
}
