# Servidor FertiMind web (Next.js standalone).
# La build de Next se hace FUERA de Docker (prerender con credenciales de
# Firestore); esta imagen solo empaqueta los artefactos ya construidos.
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080 HOSTNAME=0.0.0.0
COPY .next/standalone ./
COPY .next/static ./.next/static/
COPY public ./public/
EXPOSE 8080
CMD ["node", "server.js"]
