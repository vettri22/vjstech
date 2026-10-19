import { v4 as uuidv4 } from 'uuid';
import { run, query } from '../db';
import { AuditEvent } from '../types';

export function logAuditEvent(params: {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string | string[];
  details?: Record<string, any>;
  ipAddress?: string | string[];
}): void {
  try {
    const id = uuidv4();
    const now = new Date().toISOString();
    const detailsJson = params.details ? JSON.stringify(params.details) : undefined;
    const ipStr = Array.isArray(params.ipAddress) ? params.ipAddress[0] : params.ipAddress;
    const entityIdStr = Array.isArray(params.entityId) ? params.entityId[0] : params.entityId;

    run(
      `INSERT INTO audit_events (id, user_id, action, entity_type, entity_id, details_json, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        params.userId || null,
        params.action,
        params.entityType,
        entityIdStr || null,
        detailsJson || null,
        ipStr || null,
        now,
      ]
    );
  } catch (err) {
    console.error('Failed to record audit event:', err);
  }
}

export function getAuditEvents(limit = 100): AuditEvent[] {
  return query<AuditEvent>(
    `SELECT * FROM audit_events ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );
}
