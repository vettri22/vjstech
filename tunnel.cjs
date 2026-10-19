const localtunnel = require('localtunnel');
const https = require('https');

const PORT = 3000;
const SUBDOMAIN = 'vjstech';

// Keep event loop alive
setInterval(() => {}, 1000 * 60);

function getTunnelPassword() {
  return new Promise((resolve) => {
    https.get('https://loca.lt/mytunnelpassword', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data.trim()));
    }).on('error', () => {
      https.get('https://api.ipify.org', (res2) => {
        let data2 = '';
        res2.on('data', chunk => data2 += chunk);
        res2.on('end', () => resolve(data2.trim()));
      }).on('error', () => resolve('Unknown IP'));
    });
  });
}

async function connectTunnel() {
  const ip = await getTunnelPassword();
  console.log('====================================================');
  console.log(`[VJS TECH] Public Live Access Tunnel`);
  console.log(`[VJS TECH] Preferred Subdomain: ${SUBDOMAIN}`);
  console.log(`[VJS TECH] Tunnel Password / IP: ${ip}`);
  console.log('====================================================');

  return new Promise((resolve) => {
    localtunnel({
      port: PORT,
      subdomain: SUBDOMAIN,
      local_host: 'localhost',
    }).then(tunnel => {
      console.log(`[VJS TECH] Tunnel is actively connected: ${tunnel.url}`);

      tunnel.on('close', () => {
        console.warn('[VJS TECH] Tunnel socket closed. Will reconnect...');
        resolve();
      });

      tunnel.on('error', (err) => {
        console.error('[VJS TECH] Tunnel socket error:', err.message);
        try { tunnel.close(); } catch (_) {}
        resolve();
      });
    }).catch(err => {
      console.error('[VJS TECH] Failed to connect tunnel:', err.message);
      resolve();
    });
  });
}

async function startLoop() {
  while (true) {
    await connectTunnel();
    console.log('[VJS TECH] Reconnecting in 3 seconds...');
    await new Promise(r => setTimeout(r, 3000));
  }
}

startLoop();
