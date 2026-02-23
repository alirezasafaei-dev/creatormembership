import type { Db } from './db';
import { ApiError } from './http';
import { hashPassword, randomToken, verifyPassword } from './security';
import { normalizeEmail } from './normalize';

export type AuthUser = { id: string; email: string; role: string; name: string };

export async function signUp(db: Db, input: { email: string; password: string; name?: string }) {
  const email = normalizeEmail(input.email);
  const passwordHash = hashPassword(input.password);
  try {
    const r = await db.pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, email, role, name`,
      [email, passwordHash, input.name || ''],
    );
    return r.rows[0] as AuthUser;
  } catch (e: any) {
    if (String(e?.code) === '23505') {
      throw new ApiError('AUTH_EMAIL_EXISTS', 'Email already exists', 409);
    }
    throw e;
  }
}

export async function signIn(db: Db, input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const r = await db.pool.query(
    `SELECT id, email, role, name, password_hash FROM users WHERE email=$1`,
    [email],
  );
  if (r.rowCount !== 1) throw new ApiError('AUTH_INVALID_CREDENTIALS', 'Invalid credentials', 401);
  const row = r.rows[0] as any;
  if (!verifyPassword(input.password, row.password_hash)) {
    throw new ApiError('AUTH_INVALID_CREDENTIALS', 'Invalid credentials', 401);
  }
  return { id: row.id, email: row.email, role: row.role, name: row.name } as AuthUser;
}

export async function createSession(
  db: Db,
  userId: string,
  meta?: {
    userAgent?: string;
    ipAddress?: string;
  },
) {
  const token = randomToken(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14); // 14d
  const userAgent = String(meta?.userAgent || '').slice(0, 512);
  const ipAddress = String(meta?.ipAddress || '').slice(0, 128);
  await db.pool.query(
    `INSERT INTO sessions (user_id, token, expires_at, user_agent, ip_address, last_seen_at)
     VALUES ($1, $2, $3, $4, $5, now())`,
    [userId, token, expiresAt, userAgent, ipAddress],
  );
  // Keep a bounded number of active sessions per user.
  await db.pool.query(
    `DELETE FROM sessions
      WHERE user_id=$1
        AND id IN (
          SELECT id FROM sessions
           WHERE user_id=$1
           ORDER BY created_at DESC
           OFFSET 20
        )`,
    [userId],
  );
  return { token, expiresAt: expiresAt.toISOString() };
}

export async function getUserBySession(db: Db, token: string): Promise<AuthUser | null> {
  const r = await db.pool.query(
    `WITH active AS (
       UPDATE sessions s
          SET last_seen_at = now()
        WHERE s.token = $1
          AND s.expires_at > now()
      RETURNING s.user_id
     )
     SELECT u.id, u.email, u.role, u.name
       FROM active
       JOIN users u ON u.id = active.user_id`,
    [token],
  );
  if (r.rowCount !== 1) return null;
  return r.rows[0] as AuthUser;
}

export async function getUserById(db: Db, userId: string): Promise<AuthUser | null> {
  const r = await db.pool.query(
    `SELECT id, email, role, name FROM users WHERE id=$1`,
    [userId],
  );
  if (r.rowCount !== 1) return null;
  return r.rows[0] as AuthUser;
}

export async function revokeSession(db: Db, token: string): Promise<boolean> {
  const r = await db.pool.query(`DELETE FROM sessions WHERE token=$1 RETURNING id`, [token]);
  return r.rowCount === 1;
}

export async function revokeAllSessions(db: Db, userId: string): Promise<number> {
  const r = await db.pool.query(`DELETE FROM sessions WHERE user_id=$1 RETURNING id`, [userId]);
  return Number(r.rowCount || 0);
}

export async function revokeSessionByIdForUser(db: Db, userId: string, sessionId: string): Promise<boolean> {
  const r = await db.pool.query(`DELETE FROM sessions WHERE user_id=$1 AND id=$2 RETURNING id`, [userId, sessionId]);
  return r.rowCount === 1;
}

export async function listUserSessions(db: Db, userId: string, currentToken: string) {
  const r = await db.pool.query(
    `SELECT id, created_at, last_seen_at, expires_at, user_agent, ip_address,
            (token = $2) AS is_current
       FROM sessions
      WHERE user_id=$1
      ORDER BY created_at DESC`,
    [userId, currentToken],
  );
  return r.rows as Array<{
    id: string;
    created_at: string;
    last_seen_at: string;
    expires_at: string;
    user_agent: string;
    ip_address: string;
    is_current: boolean;
  }>;
}

export async function rotateSession(
  db: Db,
  token: string,
  meta?: {
    userAgent?: string;
    ipAddress?: string;
  },
) {
  const removed = await db.pool.query(
    `DELETE FROM sessions WHERE token=$1 AND expires_at > now() RETURNING user_id`,
    [token],
  );
  if (removed.rowCount !== 1) throw new ApiError('AUTH_INVALID_TOKEN', 'Invalid token', 401);
  const userId = String(removed.rows[0].user_id);
  const session = await createSession(db, userId, meta);
  return { userId, session };
}
