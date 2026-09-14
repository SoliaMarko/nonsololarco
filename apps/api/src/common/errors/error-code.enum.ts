/**
 * Machine-readable error codes returned in every error response.
 *
 * The client maps these to translated strings; it never renders the
 * accompanying `message`, which is English and written for logs and
 * developers. Adding a code here therefore means adding a translation on the
 * frontend — a code with no translation falls back to a generic message and
 * the user learns nothing.
 *
 * Codes are stable API surface. Rename one and every client mapping breaks
 * silently, so treat them the way you would treat a route.
 */
export enum ErrorCode {
  /** Request body or query failed DTO validation. `details` lists the fields. */
  VALIDATION_FAILED = 'VALIDATION_FAILED',

  /** No credentials, or credentials that did not verify. */
  UNAUTHORIZED = 'UNAUTHORIZED',

  /** Authenticated, but not allowed to touch this particular resource. */
  FORBIDDEN = 'FORBIDDEN',

  /** The addressed resource does not exist. */
  NOT_FOUND = 'NOT_FOUND',

  /** The write conflicts with something that already exists. */
  CONFLICT = 'CONFLICT',

  /**
   * The database is unreachable or rejected the connection.
   *
   * Kept distinct from `INTERNAL_ERROR` because it is the one server-side
   * failure a user can sometimes wait out, and the one an operator can fix
   * without a deploy.
   */
  DATABASE_UNAVAILABLE = 'DATABASE_UNAVAILABLE',

  /** Anything unrecognised. The stack trace is logged, never returned. */
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
