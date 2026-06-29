# YKsystems — Full-Stack-Webanwendung

Premium-Plattform für **YKsystems** — maßgeschneiderte High-Performance-Gaming-Systeme
und Custom Systems auf Manufaktur-Niveau. Self-hosted, containerisiert, mit geschütztem
Admin-Dashboard (Drag-and-Drop, Live-Edit, 2FA).

> **Crafted. Tested. Delivered.**

---

## 1. Technologie-Stack

| Bereich        | Technologie                                             |
| -------------- | ------------------------------------------------------- |
| Framework      | **Next.js 14** (App Router) + **TypeScript**            |
| Styling        | **Tailwind CSS** (Dark Mode `#121212`, Akzent `#c7ff4a`)|
| Datenbank      | **PostgreSQL 16** (Container, persistentes Volume)      |
| ORM            | **Prisma**                                              |
| Auth           | Eigenes Session-JWT (`jose`) + **TOTP-2FA** (`otplib`)  |
| Drag-and-Drop  | **dnd-kit**                                             |
| Mailversand    | **nodemailer** (SMTP, optional)                         |
| Container      | **Docker** + **Docker Compose**                         |

Die Architektur ist bewusst **modular** gehalten, damit zukünftige Module
(z. B. PDF-Rechnungsgenerierung für Ratenzahlungen, Testprotokolle im Corporate Design)
ohne Umbau ergänzt werden können.

---

## 2. Projektstruktur

```
yksite/
├── docker-compose.yml          # Web + DB-Container, Volumes
├── Dockerfile                  # Multi-Stage Build (Next.js standalone)
├── docker-entrypoint.sh        # DB-Sync (prisma db push) + Seeding + Start
├── .env.example                # Vorlage für die Konfiguration
├── prisma/
│   ├── schema.prisma           # Datenmodell (AdminUser, System, Inquiry)
│   └── seed.ts                 # Admin + 3 Standard-System-Klassen
└── src/
    ├── middleware.ts           # Schützt /admin (Edge, JWT-Prüfung)
    ├── app/
    │   ├── page.tsx            # Öffentliche Startseite
    │   ├── impressum/          # Rechtstexte
    │   ├── datenschutz/
    │   ├── login/              # Admin-Login (Passwort + 2FA)
    │   ├── admin/              # Geschütztes Dashboard + 2FA-Setup
    │   └── api/                # REST-Endpunkte (auth, systems, inquiries, upload, media)
    ├── components/
    │   ├── public/             # Hero, Säulen, System-Klassen, Konfigurator, Footer …
    │   └── admin/              # Dashboard, DnD-Editor-Karten, 2FA-Setup
    └── lib/                    # prisma, auth, session, mailer, uploads, format
```

Persistente Daten liegen in **Docker-Volumes**:

- `./data` → PostgreSQL-Datenbank
- `./uploads` → hochgeladene Produktbilder

---

## 3. Funktionsumfang

**Öffentliche Seite**

- Hero, 4 Vertrauens-Säulen, 3 System-Klassen (live aus der DB), Ablauf-Timeline,
  Philosophie, FAQ — alles im edlen Dark-Mode-Design mit flüssigen Hover-Scale-Effekten.
- **Multi-Step-Konfigurator** (6 Schritte) mit Fortschrittsbalken in `#c7ff4a`,
  Pflicht-Checkbox für die Datenschutz-Zustimmung. Anfragen werden strukturiert
  gespeichert und (bei konfiguriertem SMTP) an `kontakt@yk-systems.de` gesendet.
- Reiner E-Mail-Support — keine Telefonnummer im öffentlichen Bereich.
- Footer mit Impressum & Datenschutz (echte Unternehmensdaten, Kleinunternehmer-Hinweis).

**Admin-Dashboard** (`/login` → `/admin`)

- Login mit **Passwort + 6-stelligem 2FA-Code**.
- **Beim ersten Start** wird die 2FA-Einrichtung per QR-Code erzwungen.
- **Drag-and-Drop**-Sortierung der System-Karten (`order_index` wird sofort gespeichert).
- **Live-Edit** von Preisen, Texten, Performance-Klasse und Verfügbarkeit
  („Sofort lieferbar“ / „In Produktion“ / „Ausverkauft“).
- **CRUD** für Systeme inkl. **lokalem Bild-Upload** in das Upload-Volume.
- Übersicht aller eingegangenen Anfragen.

---

## 4. Schnellstart auf Linux (Fedora)

Getestet für **Fedora 38+**. Alle Befehle im Projektordner ausführen.

### 4.1 Docker installieren

```bash
# Docker Engine + Compose-Plugin
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Dienst starten und automatisch beim Booten aktivieren
sudo systemctl enable --now docker

# (Optional) eigenen Benutzer zur docker-Gruppe hinzufügen, danach neu einloggen
sudo usermod -aG docker "$USER"
# Danach: einmal ab- und wieder anmelden, damit die Gruppe greift.
```

> **SELinux-Hinweis (Fedora):** Die Bind-Mounts `./data` und `./uploads` funktionieren
> in der Regel direkt. Falls der DB- oder Web-Container keine Schreibrechte hat,
> siehe Abschnitt **Troubleshooting**.

### 4.2 Projekt holen und konfigurieren

```bash
git clone <REPO-URL> yksite
cd yksite

# Konfiguration anlegen
cp .env.example .env

# Sichere Geheimnisse erzeugen und in die .env eintragen
openssl rand -base64 48   # -> Wert für SESSION_SECRET
```

`.env` bearbeiten und **mindestens** folgende Werte setzen:

```env
POSTGRES_PASSWORD=<starkes-passwort>
DATABASE_URL=postgresql://yksystems:<starkes-passwort>@db:5432/yksystems?schema=public
ADMIN_EMAIL=admin@yk-systems.de
ADMIN_PASSWORD=<starkes-admin-passwort>
SESSION_SECRET=<openssl-rand-wert>
```

> Wichtig: `POSTGRES_PASSWORD` und das Passwort in `DATABASE_URL` müssen identisch sein.

### 4.3 Starten

```bash
# Baut die Images und startet Web + Datenbank im Hintergrund
docker compose up -d --build

# Logs verfolgen (Schema-Sync + Seeding sichtbar)
docker compose logs -f web
```

Die Anwendung läuft anschließend auf **http://localhost:3000**.

### 4.4 Erste Anmeldung & 2FA

1. http://localhost:3000/login öffnen.
2. Mit `ADMIN_EMAIL` + `ADMIN_PASSWORD` aus der `.env` anmelden.
3. Du wirst **automatisch zur 2FA-Einrichtung** geleitet: QR-Code mit einer
   Authenticator-App (z. B. Google Authenticator, Aegis) scannen und den
   6-stelligen Code bestätigen.
4. Ab jetzt verlangt jeder Login **Passwort + 2FA-Code**.

---

## 5. Betrieb & Wartung

```bash
docker compose ps                 # Status
docker compose logs -f web        # Live-Logs der Web-App
docker compose restart web        # Web-App neu starten
docker compose down               # Stoppen (Daten bleiben in ./data & ./uploads)
docker compose up -d --build      # Nach Code-Änderungen neu bauen & starten
```

**Backup** (Datenbank + Bilder):

```bash
# Datenbank-Dump
docker compose exec db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup_$(date +%F).sql
# Bilder liegen direkt in ./uploads (mitsichern)
tar czf uploads_$(date +%F).tar.gz uploads
```

---

## 6. Produktivbetrieb (VPS)

Für den öffentlichen Betrieb einen Reverse-Proxy mit TLS vorschalten
(z. B. **Caddy** oder **Nginx**) und auf `localhost:3000` weiterleiten.
Beispiel `Caddyfile`:

```
yk-systems.de {
    reverse_proxy localhost:3000
}
```

Caddy holt das HTTPS-Zertifikat automatisch. Dadurch werden die Session-Cookies
korrekt als `Secure` ausgeliefert (in der App bereits via `NODE_ENV=production` aktiv).

**E-Mail-Versand aktivieren:** In der `.env` die `SMTP_*`-Werte deines Mailproviders
eintragen. Ohne SMTP-Konfiguration werden Anfragen weiterhin in der Datenbank
gespeichert und sind im Dashboard einsehbar — nur der automatische Mailversand entfällt.

---

## 7. Lokale Entwicklung (ohne Docker)

```bash
npm install
cp .env.example .env   # DATABASE_URL auf eine lokale/Container-DB zeigen lassen
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev            # http://localhost:3000
```

---

## 8. Troubleshooting

- **Web-Container startet nicht / „Datenbank nicht erreichbar“:**
  Der Entrypoint wartet auf die DB und wiederholt `prisma db push`. Prüfe mit
  `docker compose logs db`, ob PostgreSQL fehlerfrei hochfährt, und ob
  `POSTGRES_PASSWORD` und `DATABASE_URL` zusammenpassen.
- **SELinux blockiert die Volumes (Fedora):** Den `:Z`-Flag an die Bind-Mounts
  hängen, z. B. in `docker-compose.yml`: `- ./uploads:/app/uploads:Z` und
  `- ./data:/var/lib/postgresql/data:Z`. Alternativ:
  `sudo chcon -Rt svirt_sandbox_file_t ./data ./uploads`.
- **2FA-Code wird abgelehnt:** Uhrzeit des Servers prüfen (TOTP ist zeitbasiert):
  `sudo timedatectl set-ntp true`.
- **Admin-Passwort vergessen:** In der `.env` ein neues `ADMIN_PASSWORD` setzen und
  den `AdminUser`-Datensatz in der DB löschen
  (`docker compose exec db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c 'DELETE FROM "AdminUser";'`),
  dann `docker compose restart web` — der Seed legt den Admin neu an (2FA wird neu eingerichtet).

---

## 9. Sicherheitshinweise

- Niemals die echte `.env` committen (steht in `.gitignore`).
- `SESSION_SECRET`, `ADMIN_PASSWORD` und `POSTGRES_PASSWORD` müssen stark und einzigartig sein.
- Es gibt **keine öffentliche Registrierung** — Admin-Zugang ausschließlich über die `.env`.
- 2FA ist verpflichtend und kann nicht übersprungen werden.
- Hinweis zu Abhängigkeiten: Es verbleiben zwei `npm audit`-Findings innerhalb der von
  Next.js **gebündelten** Abhängigkeiten, die erst ein Next-16-Major-Upgrade behebt. Das
  Projekt bleibt bewusst auf der stabilen, gepatchten Linie **Next 14.2.x**. Vor einem
  produktiven Major-Upgrade die Release-Notes prüfen.

---

## 10. Roadmap (durch die Architektur vorbereitet)

- PDF-Rechnungsgenerierung (Ratenzahlung) im Corporate Design
- Automatisierte Testprotokolle (24h-Stresstest) als PDF
- Erweitertes Anfragen-Management (Status, Notizen, Angebotsversand)

---

© YKsystems · Inhaber: Yakaria Michael Yoboua · Rüdesheim am Rhein
