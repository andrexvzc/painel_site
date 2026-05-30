# Painel+

React App com Vite.

## Tecnologias

- React + Vite
- React Router DOM
- Zustand
- Axios
- React Hook Form + Zod
- ESLint + Prettier

## Instalação

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Visualiza o build localmente |
| `npm run lint` | Verifica problemas de lint |
| `npm run lint:fix` | Corrige problemas de lint |
| `npm run format` | Formata o código com Prettier |

## Estrutura de Branches

- `main` — produção (protegida)
- `develop` — desenvolvimento principal
- `feature/*` — novas funcionalidades
- `bugfix/*` — correções de bugs
- `hotfix/*` — correções urgentes

## Convenção de Commits

`feat` | `fix` | `docs` | `style` | `refactor` | `test` | `chore`
