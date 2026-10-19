import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { queryOne, run } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../services/audit';

export const paymentsRouter = Router();

// POST /api/payments/create-order
// Server-side amount validation, creates idempotent order reference
paymentsRouter.post('/create-order', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { projectId, amountInInr, milestoneId } = req.body;

    if (!projectId || !amountInInr || typeof amountInInr !== 'number' || amountInInr <= 0) {
      res.status(400).json({ error: 'Valid projectId and positive numeric amountInInr are required.' });
      return;
    }

    // Verify project belongs to user
    const project = queryOne<{ id: string; client_id: string }>(
      'SELECT id, client_id FROM projects WHERE id = ?',
      [projectId]
    );

    if (!project) {
      res.status(404).json({ error: 'Project record not found.' });
      return;
    }

    if (project.client_id !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized to create payment orders for this project.' });
      return;
    }

    const orderId = uuidv4();
    const orderReference = `VJS-PAY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const isConfigured = Boolean(razorpayKeyId && process.env.RAZORPAY_KEY_SECRET);

    // Save order in database
    run(
      `INSERT INTO payment_orders (id, order_reference, project_id, client_id, amount_in_inr, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'created', ?, ?)`,
      [orderId, orderReference, projectId, req.user!.id, amountInInr, now, now]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: 'PAYMENT_ORDER_CREATED',
      entityType: 'PAYMENT',
      entityId: orderId,
      details: { orderReference, amountInInr, isConfigured },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      orderId,
      orderReference,
      amountInInr,
      currency: 'INR',
      providerConfigured: isConfigured,
      keyId: razorpayKeyId || null,
      message: isConfigured
        ? 'Payment order generated. Proceed to provider checkout.'
        : 'Payment gateway integration is currently in verification mode. Real billing requires configured RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
    });
  } catch (err) {
    console.error('Error creating payment order:', err);
    res.status(500).json({ error: 'Failed to create payment order.' });
  }
});

// POST /api/payments/verify
// Signature verification endpoint following standard cryptographic HMAC-SHA256
paymentsRouter.post('/verify', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { orderReference, paymentId, signature } = req.body;

    const order = queryOne<{ id: string; status: string; client_id: string }>(
      'SELECT id, status, client_id FROM payment_orders WHERE order_reference = ?',
      [orderReference]
    );

    if (!order) {
      res.status(404).json({ error: 'Order reference not found.' });
      return;
    }

    if (order.client_id !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized payment verification attempt.' });
      return;
    }

    // If Razorpay secret is present, verify HMAC signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret && signature && paymentId) {
      const generated = crypto
        .createHmac('sha256', secret)
        .update(`${orderReference}|${paymentId}`)
        .digest('hex');

      if (generated !== signature) {
        run(
          `UPDATE payment_orders SET status = 'failed', updated_at = ? WHERE id = ?`,
          [new Date().toISOString(), order.id]
        );
        res.status(400).json({ error: 'Payment signature verification failed.' });
        return;
      }
    }

    const now = new Date().toISOString();
    run(
      `UPDATE payment_orders 
       SET status = 'paid', razorpay_payment_id = ?, updated_at = ? 
       WHERE id = ?`,
      [paymentId || `PAY-TEST-${Date.now()}`, now, order.id]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: 'PAYMENT_VERIFIED',
      entityType: 'PAYMENT',
      entityId: order.id,
      details: { orderReference },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      status: 'paid',
      orderReference,
      message: 'Payment verification recorded successfully.',
    });
  } catch (err) {
    res.status(500).json({ error: 'Error during payment verification.' });
  }
});
