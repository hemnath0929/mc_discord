/**
 * Local Development Server (Zero-Dependency Node.js)
 * Automatically loads .env and handles both static assets and the /api/submit endpoint.
 * Run using: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      process.env[key] = val;
    }
  });
}

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoint: /api/submit
  if (req.url === '/api/submit' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const {
          name,
          nickname,
          age,
          occupation,
          edition,
          gameUsername,
          gameType,
          gameVersion
        } = data;

        if (!name || !age || !edition || !gameUsername) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Please fill all required fields.' }));
          return;
        }

        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        const inviteUrl = process.env.DISCORD_INVITE_URL || 'https://discord.gg/wnVuJzrDn';

        // Check if webhook is valid or dummy
        if (!webhookUrl || webhookUrl.includes('YOUR_WEBHOOK_ID') || webhookUrl === 'test') {
          console.log('[LOCAL SERVER] Received application in test mode:', data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: true,
              simulated: true,
              message: 'Test mode successful! (Add real webhook in .env to receive live Discord alerts)',
              discordInvite: inviteUrl
            })
          );
          return;
        }

        const isJava = edition.toLowerCase().includes('java');
        const editionBadge = isJava ? '☕ Java Edition' : '📱 Bedrock Edition';
        const accountBadge = (gameType && gameType.toLowerCase().includes('original'))
          ? '🟢 Original (Premium)'
          : '🟠 Cracked';
        const embedColor = isJava ? 0x00f0ff : 0x10b981;

        const discordPayload = {
          username: 'Shadow Peakes Whitelist Bot',
          avatar_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/diamond-sword.png',
          embeds: [
            {
              title: '⚔️ New Player Application Received',
              description: `**${name}** has submitted an application to join **SHADOW PEAKES**!`,
              color: embedColor,
              fields: [
                { name: '👤 Full Name', value: `\`${name}\``, inline: true },
                { name: '🏷️ Nickname', value: nickname ? `\`${nickname}\`` : '_None_', inline: true },
                { name: '🎂 Age', value: `\`${age} years old\``, inline: true },
                { name: '💼 Occupation', value: `\`${occupation || 'Not specified'}\``, inline: true },
                { name: '🎮 Minecraft Edition', value: `**${editionBadge}**`, inline: true },
                { name: '🆔 In-Game Name (IGN)', value: `\`${gameUsername}\``, inline: true },
                { name: '🛡️ Account Type', value: accountBadge, inline: true },
                { name: '📦 Game Version', value: `\`${gameVersion || 'Latest'}\``, inline: true }
              ],
              thumbnail: {
                url: isJava
                  ? `https://mc-heads.net/avatar/${encodeURIComponent(gameUsername)}/100`
                  : 'https://mc-heads.net/avatar/MHF_Steve/100'
              },
              footer: { text: 'Shadow Peakes Player Whitelist • Review & Assign Roles' },
              timestamp: new Date().toISOString()
            }
          ]
        };

        const discordRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discordPayload)
        });

        if (!discordRes.ok) {
          const errText = await discordRes.text();
          console.error('[Discord Webhook Error]:', discordRes.status, errText);
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Discord webhook rejected the payload.', details: errText }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: true,
            message: 'Application dispatched to Discord successfully!',
            discordInvite: inviteUrl
          })
        );
      } catch (err) {
        console.error('[Server Error]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 SHADOW PEAKES Server is running!`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`⚙️ Webhook status: ${process.env.DISCORD_WEBHOOK_URL ? 'Loaded from .env' : 'Running in Test Mode'}`);
  console.log(`=================================================\n`);
});
