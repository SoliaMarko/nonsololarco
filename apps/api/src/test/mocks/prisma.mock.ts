import { vi } from 'vitest';

export function createMockPrisma() {
  return {
    bandMember: { findMany: vi.fn() },
    track: { count: vi.fn(), findMany: vi.fn() },
    band: { findUnique: vi.fn() },
  };
}

export type MockPrisma = ReturnType<typeof createMockPrisma>;
