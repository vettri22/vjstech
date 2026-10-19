const localtunnel = require('localtunnel');
const https = require('https');

const PORT = 3000;
const SUBDOMAIN = 'vjstech';

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

async function startTunnel() {
  const ip = await getTunnelPassword();
  console.log('====================================================');
  console.log(`[VJS TECH] Public Live Access Tunnel`);
  console.log(`[VJS TECH] Tunnel URL: https://${SUBDOMAIN}.loca.lt`);
  console.log(`[VJS TECH] Tunnel Password / IP: ${ip}`);
  console.log('====================================================');

  try {
    const tunnel = await localtunnel({
      port: PORT,
      subdomain: SUBDOMAIN,
      local_host: 'localhost',
    });

    console.log(`[VJS TECH] Tunnel is actively connected: ${tunnel.url}`);

    tunnel.on('close', () => {
      console.warn('[VJS TECH] Tunnel closed. Reconnecting in 3 seconds...');
      setTimeout(startTunnel, 3000);
    });

    tunnel.on('error', (err) => {
      console.error('[VJS TECH] Tunnel error:', err.message);
      try { tunnel.close(); } catch (_) {}
      setTimeout(startTunnel, 3000);
    });
  } catch (err) {
    console.error('[VJS TECH] Failed to start tunnel:', err.message);
    setTimeout(startTunnel, 3000);
  }
}

startTunnel();
