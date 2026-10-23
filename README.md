# Cheles · frontend

Web de Cheles (nombre provisional): Next.js, mobile-first. Habla con la API de
[cheles-backend](https://github.com/Adriangar99/cheles-backend) a través de un rewrite `/api/*`, así el navegador
solo conoce la web.

## Arrancar

Primero el backend (crea la red Docker `cheles-net`), después:

    docker compose up -d --build        # http://localhost:3000

Sin Docker: `npm install && API_URL=http://localhost:8000 npm run dev` (con la API accesible en esa URL).

`API_URL` se fija **al construir** (Next resuelve los rewrites en el build); por defecto `http://api:8000`.

## Seguridad

Puerto publicado solo en `127.0.0.1`; cabeceras `X-Frame-Options`, `nosniff`, `no-referrer` y `no-store`.

## Desarrollo con OpenSpec

Cambios planificados con [OpenSpec](https://github.com/Fission-AI/OpenSpec) (`openspec/`), con los comandos
`/opsx:explore`, `/opsx:propose`, `/opsx:update`, `/opsx:apply`, `/opsx:sync` y `/opsx:archive` de Claude Code.
