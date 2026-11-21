# Sportabilia

Sportabilia is Hungary's first online portal dedicated to sports memorabilia.

## Development

Install Node.js 24 or 26 and npm 11. If you use nvm, the included `.nvmrc` selects Node 26.

```sh
cd <project-directory>
nvm use
npm ci
npm run dev
```

The development server prints its local URL. To verify a production build:

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
