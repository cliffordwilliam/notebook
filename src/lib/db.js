import { neon } from '@neondatabase/serverless';
import { get } from 'svelte/store';
import { credentials } from '../stores/credentials.js';
import { AuthError, SchemaError } from './errors.js';
import { navigate } from '../stores/router.js';
import { toasts } from '../stores/toasts.js';

export function handleError(error) {
  if (error instanceof AuthError) {
    credentials.clear();
    navigate('login');
  } else if (error instanceof SchemaError) {
    navigate('error', { message: error.message });
  } else {
    toasts.add(error.message || 'Something went wrong.', 'error');
  }
}

function getSql() {
  const conn = get(credentials);
  if (!conn) throw new AuthError('No connection string. Please reconnect.');
  return neon(conn);
}

function classify(e) {
  if (e instanceof AuthError || e instanceof SchemaError) throw e;
  const authCodes = ['28P01', '28000', '3D000', '08006', '08001', '08004', '08003'];
  const schemaCodes = ['42P01', '42703', '42601', '42804'];
  if (authCodes.includes(e.code)) throw new AuthError(e.message);
  if (schemaCodes.includes(e.code)) throw new SchemaError(e.message);
  throw e;
}

export async function dbGetNotes() {
  try {
    return await getSql()`
      SELECT id, title, content,
             created_at AS "createdAt",
             updated_at AS "updatedAt"
      FROM notes
      ORDER BY updated_at DESC
    `;
  } catch (e) { classify(e); }
}

export async function dbGetNote(id) {
  try {
    const rows = await getSql()`
      SELECT id, title, content,
             created_at AS "createdAt",
             updated_at AS "updatedAt"
      FROM notes WHERE id = ${id}
    `;
    if (!rows[0]) throw new Error(`Note not found: ${id}`);
    return rows[0];
  } catch (e) { classify(e); }
}

export async function dbCreateNote(title, content) {
  try {
    const rows = await getSql()`
      INSERT INTO notes (title, content)
      VALUES (${title}, ${content})
      RETURNING id, title, content,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
    `;
    return rows[0];
  } catch (e) { classify(e); }
}

export async function dbUpdateNote(id, title, content) {
  try {
    await getSql()`
      UPDATE notes
      SET title = ${title}, content = ${content}, updated_at = NOW()
      WHERE id = ${id}
    `;
  } catch (e) { classify(e); }
}

export async function dbDeleteNote(id) {
  try {
    await getSql()`DELETE FROM notes WHERE id = ${id}`;
  } catch (e) { classify(e); }
}
