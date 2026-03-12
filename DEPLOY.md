# Guía de Despliegue — Drone ROI Calculator

Dos opciones: **Vercel** (más simple) y **VPS en DigitalOcean** (más control).

---

## Opción 1: Vercel (Recomendado para empezar)

### Requisitos
- Cuenta en [vercel.com](https://vercel.com)
- Repositorio en GitHub/GitLab/Bitbucket

### Pasos

1. **Conecta tu repositorio:**
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa el repositorio `drone-roi-calculator`

2. **Configuración (automática):**
   Vercel detecta Next.js y configura todo. Verifica:
   - **Framework Preset:** Next.js
   - **Root Directory:** `.` (raíz del repo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

3. **Deploy:**
   - Haz clic en **"Deploy"**
   - En ~1-2 minutos tendrás una URL tipo `drone-roi-calculator.vercel.app`

4. **Dominio personalizado (opcional):**
   - Settings → Domains → Agrega tu dominio
   - Configura los DNS según las instrucciones de Vercel:
     - **A Record:** `76.76.21.21`
     - **CNAME:** `cname.vercel-dns.com`

### CI/CD automático
Cada `git push` a `main`/`master` genera un deploy automático. Los pull requests generan preview deployments.

### Variables de entorno
Si en el futuro necesitas env vars:
- Settings → Environment Variables → Agregar

---

## Opción 2: VPS en DigitalOcean

### Arquitectura
```
Internet → Nginx (80/443) → Next.js app (Docker :3000)
                ↓
          Let's Encrypt SSL
```

### Requisitos
- Cuenta en [DigitalOcean](https://digitalocean.com)
- Dominio apuntando al IP del droplet
- SSH key configurada

### Paso 1: Crear Droplet

En DigitalOcean:
- **Image:** Ubuntu 24.04
- **Plan:** Basic $6/mes (1 vCPU, 1GB RAM) es suficiente
- **Region:** La más cercana a tus usuarios (ej: `NYC1` o `SFO3`)
- **Authentication:** SSH Key (recomendado)

### Paso 2: Configurar el servidor

Copia tu SSH key y conéctate:
```bash
ssh root@<IP_DEL_DROPLET>
```

Ejecuta el script de setup (instala Docker, firewall, usuario deploy):
```bash
# Desde tu máquina local:
ssh root@<IP> 'bash -s' < scripts/vps-setup.sh
```

### Paso 3: Clonar y desplegar

```bash
# Conéctate como usuario deploy
ssh deploy@<IP>

# Clona el repositorio
git clone https://github.com/<tu-usuario>/drone-roi-calculator.git ~/app
cd ~/app

# Edita el dominio en nginx config
nano nginx/default.conf
# Cambia "tu-dominio.com" por tu dominio real

# Levanta los contenedores
docker compose up -d --build
```

Verifica que funciona: `http://<IP>` debería mostrar la app.

### Paso 4: Configurar SSL con Let's Encrypt

```bash
# Obtener certificado (reemplaza con tu dominio y email)
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/lib/letsencrypt \
  -d tu-dominio.com \
  --email tu-email@ejemplo.com \
  --agree-tos \
  --no-eff-email

# Ahora edita nginx/default.conf:
# 1. Descomenta el bloque "HTTP → HTTPS redirect" al inicio
# 2. Descomenta las líneas ssl_certificate, ssl_certificate_key, ssl_protocols, ssl_ciphers
# 3. Descomenta "listen 443 ssl;"
# 4. Asegúrate de que tu-dominio.com esté correcto en todas partes

# Reinicia nginx
docker compose restart nginx
```

### Paso 5: Renovación automática de SSL

El contenedor `certbot` ya renueva automáticamente cada 12h. Agrega un cron para reiniciar nginx:

```bash
# Como root
crontab -e
# Agregar:
0 5 1 */2 * docker compose -f /home/deploy/app/docker-compose.yml restart nginx
```

### Actualizar la app

```bash
ssh deploy@<IP>
cd ~/app
git pull
docker compose up -d --build
```

### Comandos útiles

```bash
# Ver logs
docker compose logs -f app
docker compose logs -f nginx

# Reiniciar todo
docker compose restart

# Reconstruir sin cache
docker compose build --no-cache
docker compose up -d

# Ver estado
docker compose ps
```

---

## Comparación rápida

| Aspecto | Vercel | VPS DigitalOcean |
|---|---|---|
| **Costo** | Gratis (hobby) | $6/mes mínimo |
| **Setup** | 2 minutos | 15-30 minutos |
| **SSL** | Automático | Manual (Let's Encrypt) |
| **CI/CD** | Automático (git push) | Manual (git pull + rebuild) |
| **Escalabilidad** | Automática | Manual |
| **Control** | Limitado | Total |
| **Dominio custom** | Fácil | Requiere DNS |
| **Ventaja** | Simplicidad | Sin vendor lock-in |

---

## Archivos de infraestructura

| Archivo | Propósito |
|---|---|
| `Dockerfile` | Build multi-stage con `output: standalone` |
| `.dockerignore` | Excluye node_modules, .git, .next del build context |
| `docker-compose.yml` | Orquesta app + nginx + certbot |
| `nginx/default.conf` | Reverse proxy, gzip, headers de seguridad, cache estático |
| `scripts/vps-setup.sh` | Setup inicial del servidor (Docker, firewall, usuario) |
| `next.config.ts` | `output: "standalone"` para Docker optimizado |
