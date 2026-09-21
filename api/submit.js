/**
 * Vercel Serverless Function: /api/submit
 * Handles player whitelist submissions and securely forwards rich embeds to Discord Webhook.
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const {
      name,
      nickname,
      age,
      occupation,
      edition,
      gameUsername,
      gameType,
      gameVersion
    } = req.body || {};

    // Validate required fields
    if (!name || !age || !edition || !gameUsername) {
      return res.status(400).json({ error: 'Please fill in all mandatory application fields.' });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const inviteUrl = process.env.DISCORD_INVITE_URL || 'https://discord.gg/wnVuJzrDn';

    // If webhook is not configured yet, return simulated success with notice
    if (!webhookUrl || webhookUrl.includes('YOUR_WEBHOOK_ID') || webhookUrl === 'test') {
      console.warn('[SHADOW PEAKES] Webhook URL not configured. Simulating response.');
      return res.status(200).json({
        success: true,
        simulated: true,
        message: 'Application received in test mode! Configure DISCORD_WEBHOOK_URL in .env or Vercel settings.',
        discordInvite: inviteUrl
      });
    }

    // Determine edition color & badges
    const isJava = edition.toLowerCase().includes('java');
    const editionBadge = isJava ? '☕ Java Edition' : '📱 Bedrock Edition';
    const accountBadge = (gameType && gameType.toLowerCase().includes('original'))
      ? '🟢 Original (Premium)'
      : '🟠 Cracked';
    const embedColor = isJava ? 0xff2442 : 0xdc2626; // Ruby Red for Java, Crimson for Bedrock

    // Construct Discord Rich Embed
    const discordPayload = {
      username: 'Shadow Peakes Whitelist Bot',
      avatar_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/diamond-sword.png',
      embeds: [
        {
          title: '⚔️ New Player Application Received',
          description: `**${name}** has submitted an application to join **SHADOW PEAKES**!`,
          color: embedColor,
          fields: [
            {
              name: '👤 Full Name',
              value: `\`${name}\``,
              inline: true
            },
            {
              name: '🏷️ Nickname',
              value: nickname ? `\`${nickname}\`` : '_None_',
              inline: true
            },
            {
              name: '🎂 Age',
              value: `\`${age} years old\``,
              inline: true
            },
            {
              name: '💼 Occupation',
              value: `\`${occupation || 'Not specified'}\``,
              inline: true
            },
            {
              name: '🎮 Minecraft Edition',
              value: `**${editionBadge}**`,
              inline: true
            },
            {
              name: '🆔 In-Game Name (IGN)',
              value: `\`${gameUsername}\``,
              inline: true
            },
            {
              name: '🛡️ Account Type',
              value: accountBadge,
              inline: true
            },
            {
              name: '📦 Game Version',
              value: `\`${gameVersion || 'Latest'}\``,
              inline: true
            }
          ],
          thumbnail: {
            url: isJava
              ? `https://mc-heads.net/avatar/${encodeURIComponent(gameUsername)}/100`
              : 'https://mc-heads.net/avatar/MHF_Steve/100'
          },
          footer: {
            text: 'Shadow Peakes Player Whitelist • Review & Assign Roles'
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Dispatch to Discord
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(discordPayload)
    });

    if (!discordResponse.ok) {
      const errText = await discordResponse.text();
      console.error('[Discord Webhook Error]:', discordResponse.status, errText);
      return res.status(502).json({
        error: `Discord Webhook error: ${discordResponse.statusText}`,
        details: errText
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Application successfully forwarded to Discord!',
      discordInvite: inviteUrl
    });
  } catch (error) {
    console.error('[Submit Handler Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing application.' });
  }
}
