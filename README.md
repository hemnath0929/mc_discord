# ⚔️ SHADOW PEAKES - Minecraft Verification & Community Web Portal

A modern, dark Minecraft-themed website for **SHADOW PEAKES** designed to screen new players, collect their in-game details, forward applications directly to Discord via **Discord Webhooks**, and unlock the Discord server invite link.

---

## 🚀 Features

1. **Brand Hero & Server Showcase**:
   - Live Minecraft SMP Crossplay status indicator (1.20 - 1.21+).
   - Quick stats and server highlights (Active players, 24/7 uptime, Anti-griefing).
2. **Multi-Step Player Verification Wizard**:
   - **Step 1**: Personal Info (Name, Nickname, Age, Occupation).
   - **Step 2**: Minecraft Setup with dynamic **Java** vs **Bedrock** edition switcher (conditional inputs for IGN, Original/Cracked account type, Game version).
   - **Step 3**: Instant submission feedback with Minecraft Achievement badge, player summary, avatar preview, and glowing **Join Discord Server** button.
3. **Discord Integration**:
   - Submissions are transformed into rich, color-coded Discord Embeds sent directly to your admin Discord channel.
   - Secure backend routing via `/api/submit` to protect your Webhook URL.
4. **Sponsors & Collab / Ad Sections**:
   - Netherite, Diamond, and Gold sponsor showcase cards.
   - Content Creator partner highlights and dedicated advertising slot.

---

## 🛠️ Quick Local Setup

You don't need any complex installation. Node.js built-in server is included!

1. Open this project directory in your terminal:
   ```bash
   cd "d:\personal project\web for dc"
   ```

2. Start the local server:
   ```bash
   node server.js
   ```
   *(or run `npm run dev`)*

3. Open your browser and go to:
   ```
   http://localhost:3000
   ```

---

## ⚙️ Discord Webhook & Invite Configuration

1. Open your `.env` file in the project folder:
   ```env
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
   DISCORD_INVITE_URL=https://discord.gg/yourservercode
   ```

2. **How to get your Discord Webhook URL**:
   - Open Discord -> Go to your Server.
   - Right-click or gear icon on your admin channel (e.g. `#player-applications`).
   - Click **Integrations** -> **Webhooks** -> **New Webhook**.
   - Copy the Webhook URL and paste it in `.env`.

3. Restart the server (`node server.js`). All submissions will now alert your Discord channel live!

---

## 🌐 Deploying to Vercel (Free Hosting)

1. Push this project to your **GitHub** repository.
2. Log in to [Vercel](https://vercel.com).
3. Click **"Add New Project"** and import your GitHub repository.
4. In the **Environment Variables** section on Vercel, add:
   - `DISCORD_WEBHOOK_URL`: Your actual Discord webhook URL.
   - `DISCORD_INVITE_URL`: Your Discord permanent server invite.
5. Click **Deploy**. Vercel will launch your website with automatic SSL/HTTPS in less than a minute!
