# ============================================================
#  YKsystems – Multi-Stage Dockerfile (Next.js standalone)
# ============================================================

# ---- Stage 1: Dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
# libc6-compat wird von manchen nativen Modulen unter Alpine benötigt
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
# Reproduzierbarer Install; fällt auf "npm install" zurück, falls kein Lockfile vorhanden
RUN npm ci || npm install

# ---- Stage 2: Build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma-Client generieren und Next.js bauen
RUN npx prisma generate
RUN npm run build

# ---- Stage 3: Runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Laufzeit-Abhängigkeiten der Prisma-Engines (musl/openssl)
RUN apk add --no-cache libc6-compat openssl

# Nicht-root-Benutzer für die Laufzeit
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone-Output von Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma-Schema/Seed, generierter Client, Prisma-CLI (für db push) & Entrypoint.
# Der Standalone-Build enthält @prisma/client und bcryptjs bereits getraced;
# zusätzlich wird die Prisma-CLI samt Engines für `prisma db push` benötigt.
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Upload-Verzeichnis anlegen und Rechte setzen
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
