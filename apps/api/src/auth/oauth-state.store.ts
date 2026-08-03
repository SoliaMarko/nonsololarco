import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import type { Request } from 'express';

type StoreCallback = (err: Error | null, state?: string) => void;
type VerifyCallback = (
  err: Error | null,
  ok: boolean,
  info?: { message: string },
) => void;

// Enough time to complete the redirect round trip to the provider and back.
const STATE_TTL_MS = 5 * 60 * 1000;

/**
 * Stateless CSRF-protection state store for Passport's OAuth2 strategies
 * (Google, GitHub).
 *
 * Passport's built-in `state: true` option needs express-session to persist
 * a nonce between the redirect to the provider and the callback — this app
 * is intentionally session-free (stateless JWT cookie auth), so instead we
 * sign a random nonce + expiry with a server secret and verify the
 * signature on callback. Nothing is stored server-side, so this scales the
 * same way the rest of the app does.
 *
 * Without this, an attacker can start their own OAuth flow, capture the
 * provider redirect URL, and trick a victim into completing it — linking
 * the victim's browser session to the attacker's provider account (a login
 * CSRF). Passport's callback flow rejects any request whose `state` doesn't
 * verify, closing that off.
 *
 * The store/verify methods are overloaded (2-arg and 3-arg forms) only to
 * satisfy @types/passport-oauth2's StateStore interface — passport picks a
 * call form by inspecting `.length`, and we always want the simple 2-arg
 * (store) / 3-arg (verify) form, so the extra `meta` parameter is unused.
 */
export class OAuthStateStore {
  constructor(private readonly secret: string) {}

  store(req: Request, callback: StoreCallback): void;
  store(req: Request, meta: unknown, callback: StoreCallback): void;
  store(_req: Request, callback: StoreCallback): void {
    const nonce = randomBytes(16).toString('hex');
    const expiresAt = Date.now() + STATE_TTL_MS;
    const payload = `${nonce}.${expiresAt}`;

    callback(null, `${payload}.${this.sign(payload)}`);
  }

  verify(req: Request, state: string, callback: VerifyCallback): void;
  verify(req: Request, state: string, meta: unknown, callback: VerifyCallback): void;
  verify(_req: Request, providedState: string, callback: VerifyCallback): void {
    const parts = providedState?.split('.') ?? [];

    if (parts.length !== 3) {
      return callback(null, false, {
        message: 'Invalid authorization request state.',
      });
    }

    const [nonce, expiresAtRaw, signature] = parts;
    const expected = this.sign(`${nonce}.${expiresAtRaw}`);

    const signaturesMatch =
      signature.length === expected.length &&
      timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

    if (!signaturesMatch) {
      return callback(null, false, {
        message: 'Invalid authorization request state.',
      });
    }

    const expiresAt = Number(expiresAtRaw);

    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      return callback(null, false, {
        message: 'Authorization request state has expired.',
      });
    }

    return callback(null, true);
  }

  private sign(payload: string): string {
    return createHmac('sha256', this.secret).update(payload).digest('hex');
  }
}
