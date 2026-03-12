#!/usr/bin/env bash
# ──────────────────────────────────────────────────────
# VPS initial setup script for drone-roi-calculator
# Run on a fresh Ubuntu 22.04/24.04 DigitalOcean droplet
# Usage: ssh root@<IP> 'bash -s' < scripts/vps-setup.sh
# ──────────────────────────────────────────────────────
set -euo pipefail

echo "══════ Updating system ══════"
apt-get update && apt-get upgrade -y

echo "══════ Installing Docker ══════"
apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
| tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "══════ Enabling firewall ══════"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "══════ Creating deploy user ══════"
if ! id "deploy" &>/dev/null; then
    adduser --disabled-password --gecos "" deploy
    usermod -aG docker deploy
    mkdir -p /home/deploy/.ssh
    cp /root/.ssh/authorized_keys /home/deploy/.ssh/
    chown -R deploy:deploy /home/deploy/.ssh
    chmod 700 /home/deploy/.ssh
fi

echo "══════ Setup complete ══════"
echo "Next steps:"
echo "  1. ssh deploy@<IP>"
echo "  2. git clone <your-repo> ~/app && cd ~/app"
echo "  3. docker compose up -d --build"
