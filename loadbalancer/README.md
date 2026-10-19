# VJS TECH — High Availability & Load Balancer Architecture

This directory details the dual-tier load balancing strategy implemented for **VJS TECH**:

---

## Architecture Overview

```
Client Traffic (Mobile / Desktop Browsers)
                    │
                    ▼
┌───────────────────────────────────────────────┐
│     Tier 1: NGINX Edge Load Balancer          │
│  - SSL / HTTPS Padlock Termination (TLS 1.3)  │
│  - Static Asset Gzip / Brotli Caching         │
│  - IP Rate Limiting Zones (5r/m on /login)    │
│  - 301 Permanent Redirects                    │
│  - Round-Robin / Least Connections Balancing  │
└───────────────────────┬───────────────────────┘
                        │
                        ▼ (Reverse Proxy HTTP)
┌───────────────────────────────────────────────┐
│     Tier 2: Node.js Multi-Core Cluster        │
│  - Node.js native `cluster` load balancer     │
│  - Distributes requests across CPU cores      │
│  - Auto-healing: restarts crashed workers     │
│  - SSR Meta Injection & In-Memory Cache       │
│  - Express REST APIs & Client Portal Engine   │
└───────────────────────────────────────────────┘
```

---

## 1. Internal Tier: Node.js Cluster Load Balancer

### How to Run:
In the `server` directory:
```bash
# Start the clustered multi-worker load balancer
npm run cluster
```
By default, the load balancer inspects `os.cpus().length` and forks up to 4 worker processes. You can customize the worker pool size with the `WEB_CONCURRENCY` environment variable:
```bash
WEB_CONCURRENCY=8 npm run cluster
```

### Features:
- **Round-Robin Connection Balancing**: Uses the operating system's built-in TCP socket sharing across Node worker processes.
- **Self-Healing Workers**: If any worker crashes unexpectedly, the primary process catches the `exit` signal and automatically forks a replacement worker instantly.
- **Graceful Termination**: Handles `SIGINT` and `SIGTERM` cleanly, committing database buffers to disk before exiting.

---

## 2. External Tier: NGINX Reverse Proxy Load Balancer

The configuration is located at `loadbalancer/nginx.conf`.

### Key Features:
- **HTTPS Padlock & Strict TLS**: Configured for TLS 1.2 and TLS 1.3 with high-security ciphers, HTTP Strict Transport Security (HSTS), and automatic 301 redirection from HTTP to HTTPS.
- **Brute-Force Login Rate Limiting**: Enforces `limit_req_zone` specifically on `/api/auth/login` (5 requests/minute per IP) with HTTP 429 status response.
- **Static Asset Caching**: 1-year immutable caching for static assets (`.svg`, `.png`, `.webp`, `.js`, `.css`) with Gzip compression.
- **Health Check Proxying**: Direct proxying to `/api/health` without access logging to keep metrics clean.

### Deployment on Linux VPS / Production:
```bash
# Copy configuration to NGINX sites directory
sudo cp loadbalancer/nginx.conf /etc/nginx/sites-available/vjstech.conf

# Enable site
sudo ln -s /etc/nginx/sites-available/vjstech.conf /etc/nginx/sites-enabled/

# Test syntax
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx
```
