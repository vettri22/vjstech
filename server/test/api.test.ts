import test from 'node:test';
import assert from 'node:assert/strict';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:5000';

test('1. System Health API & Database Connectivity', async () => {
  const res = await fetch(`${BASE_URL}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
  assert.equal(data.database, 'connected');
});

test('2. Confirmed Team Members API', async () => {
  const res = await fetch(`${BASE_URL}/api/team`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(Array.isArray(data.team), true);
  assert.ok(data.team.length >= 1);
});

test('3. Public Portfolio API (Accurate Projects Only)', async () => {
  const res = await fetch(`${BASE_URL}/api/portfolio`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(Array.isArray(data.projects), true);
  const slugs = data.projects.map((p: any) => p.slug);
  assert.ok(slugs.includes('devbites'));
  assert.ok(slugs.includes('mine-energy-ai'));
  assert.ok(slugs.includes('neural-x'));
});

const adminTestEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@vjstech.local';
const adminTestPassword = process.env.ADMIN_INITIAL_PASSWORD || 'AdminTestPass@2026';

test('4. Official Admin Authentication', async () => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bypass-ratelimit': 'true' },
    body: JSON.stringify({
      email: adminTestEmail,
      password: adminTestPassword,
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.token);
  assert.equal(data.user.role, 'admin');
  assert.equal(data.user.email, adminTestEmail);
});

test('5. Admin Client Provisioning & Client Isolation', async () => {
  // Login as admin
  const adminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bypass-ratelimit': 'true' },
    body: JSON.stringify({
      email: adminTestEmail,
      password: adminTestPassword,
    }),
  });
  const { token: adminToken } = await adminLogin.json();

  // Create isolated client
  const testClientEmail = `client_${Date.now()}@vjstech-test.in`;
  const createRes = await fetch(`${BASE_URL}/api/auth/create-client`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      email: testClientEmail,
      password: 'ClientPassword@123456',
      fullName: 'Test Enterprise Client',
      organization: 'VJS Partner Org',
    }),
  });
  assert.equal(createRes.status, 201);

  // Client logs in with their newly provisioned credentials
  const clientLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bypass-ratelimit': 'true' },
    body: JSON.stringify({
      email: testClientEmail,
      password: 'ClientPassword@123456',
    }),
  });
  assert.equal(clientLogin.status, 200);
  const clientData = await clientLogin.json();
  assert.equal(clientData.user.role, 'client');

  // Verify client CANNOT access admin endpoints (IDOR Guard)
  const forbiddenRes = await fetch(`${BASE_URL}/api/enquiries`, {
    headers: { Authorization: `Bearer ${clientData.token}` },
  });
  assert.equal(forbiddenRes.status, 403);
});

test('6. 301 Permanent Redirects', async () => {
  const legacyRes = await fetch(`${BASE_URL}/portfolio`, { redirect: 'manual' });
  assert.equal(legacyRes.status, 301);
  assert.equal(legacyRes.headers.get('location'), '/work');

  const slashRes = await fetch(`${BASE_URL}/services/`, { redirect: 'manual' });
  assert.equal(slashRes.status, 301);
  assert.equal(slashRes.headers.get('location'), '/services');
});

test('7. Search Engine Directives: Robots.txt & Sitemap.xml', async () => {
  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  assert.equal(robotsRes.status, 200);
  assert.ok(robotsRes.headers.get('content-type')?.includes('text/plain'));

  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  assert.equal(sitemapRes.status, 200);
  assert.ok(sitemapRes.headers.get('content-type')?.includes('xml'));
});

test('8. Contact Enquiry & Anti-Spam Bot Protection', async () => {
  // Test bot honeypot submission
  const botRes = await fetch(`${BASE_URL}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Bot User',
      email: 'bot@spam.com',
      clientCategory: 'Startup',
      services: ['Website Development'],
      projectTitle: 'Spam Title',
      projectDescription: 'Spam description longer than ten characters',
      preferredContactMethod: 'Email',
      consentGiven: true,
      website_hp: 'I am a malicious bot filling hidden fields',
    }),
  });
  // Should silently succeed with pseudo-success without saving spam to database
  assert.equal(botRes.status, 200);
  const botJson = await botRes.json();
  assert.equal(botJson.success, true);
});
