# Building Your MVP Tool Repo

This document shows how to build **a single repo** that houses your custom "tool" on top of shadcn's components—**not** just how to integrate the pattern into someone else's project, but rather how *you* (the tool's author) can structure and develop an MVP form of the tool **itself**. In other words, we'll create a local monorepo or multi-package setup that:

1. Contains the CLI or scripts that automate the "base/brand" concept.  
2. Demonstrates usage with a small example project.  

---

## 1. Repo Layout Overview

A typical structure for an MVP "tool" repo might look like this:

```
my-shadcn-tool/              # Root of your project
├─ packages/
│   ├─ cli/                  # The core CLI or Node scripts
│   │   ├─ src/
│   │   │   └─ index.ts      # Commands: init, add, update, brand, etc.
│   │   ├─ package.json
│   │   └─ ...
│   ├─ example-app/          # A minimal Next.js + Tailwind app
│   │                        # that consumes your tool for demonstration
│   │   ├─ components/       # (generated or updated by the CLI)
│   │   ├─ pages/
│   │   ├─ tailwind.config.js
│   │   └─ ...
│   └─ shared-utils/         # (Optional) If needed for shared code among tool packages
├─ docs/
│   └─ instructions.md       # Additional documentation
├─ package.json              # Possibly a root "workspace" config
├─ tsconfig.json             # If using TypeScript with references
└─ README.md
```

**Monorepo Tools:**  
- You can manage this layout with **pnpm workspaces**, **Yarn workspaces**, or **Nx/Turborepo**. For an MVP, a simple Yarn or pnpm workspace is fine.

---

## 2. Setting Up a Basic Workspace

In your root folder, create a `package.json` that marks this as a **workspace** project. For example, with **pnpm**:

```json
{
  "name": "my-shadcn-tool",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    "build": "pnpm -r run build",
    "dev": "pnpm -r run dev",
    "test": "pnpm -r run test"
  },
  "workspaces": [
    "packages/*"
  ]
}
```

Then create a `packages` folder, which will house your CLI and your example app.

---

## 3. Create the CLI Package

Inside `packages/cli`, scaffold a minimal Node-based or TypeScript-based CLI:

```
packages/cli/
  ├─ src/
  │   ├─ commands/
  │   │   ├─ init.ts
  │   │   ├─ add.ts
  │   │   ├─ update.ts
  │   │   ├─ brand.ts
  │   │   └─ ...
  │   └─ index.ts
  ├─ package.json
  └─ tsconfig.json
```

### 3.1. package.json

```json
{
  "name": "@my-shadcn-tool/cli",
  "version": "0.0.1",
  "type": "module",
  "bin": {
    "my-shadcn-tool": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc -w",
    "start": "node dist/index.js"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "^4.9.5"
  }
}
```

### 3.2. index.ts (Entry Point)

Below is a super minimal structure using [Commander.js](https://npmjs.com/package/commander) as an example:

```ts
#!/usr/bin/env node

import { program } from "commander"
import { handleInit } from "./commands/init"
import { handleAdd } from "./commands/add"
import { handleUpdate } from "./commands/update"
import { handleBrand } from "./commands/brand"

program
  .command("init")
  .description("Initialize a minimal config or scaffold for the tool.")
  .action(handleInit)

program
  .command("add <componentName>")
  .description("Add a shadcn component to the base folder.")
  .action(handleAdd)

program
  .command("update <componentName>")
  .description("Update a previously added shadcn component.")
  .action(handleUpdate)

program
  .command("brand <subcommand>")
  .description("Manage brand overrides or tokens")
  .action(handleBrand)

program.parse(process.argv)
```

You can fill these placeholder command files (`init.ts`, `add.ts`, etc.) with basic logic that:

- **Scaffolds** or copies from official shadcn when you run `my-shadcn-tool add`.
- **Updates** the base folder with upstream changes on `my-shadcn-tool update`.
- Possibly **creates** brand overrides or tokens on `my-shadcn-tool brand (...)`.

For an MVP, even a `console.log("TODO")` inside these commands is enough to prove the structure.

---

## 4. Create the Example App

Inside `packages/example-app`, scaffold a minimal Next.js + Tailwind project:

```bash
cd packages
npx create-next-app example-app
cd example-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

It might look something like:

```
packages/example-app/
  ├─ components/
  ├─ pages/
  ├─ public/
  ├─ tailwind.config.js
  ├─ package.json
  └─ ...
```

### 4.1. Tailwind Setup

In `tailwind.config.js`, set up the content paths:

```js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

### 4.2. Testing the CLI inside Example App

The idea is that a user in `packages/example-app/` could run:

```bash
npx my-shadcn-tool init
```

(or from the root: `pnpm my-shadcn-tool init --filter example-app` if you wire it that way), which might:

- Create a `components/base/` folder.  
- Possibly fetch a `button.tsx` from official shadcn.  
- Create a `components/brand/` folder with a placeholder override.

Then the user can do:

```bash
npx my-shadcn-tool add button
```

And see that `/components/base/button.tsx` shows up in their `example-app`.

---

## 5. Linking the CLI in a Monorepo

Because your CLI is a separate package, you'll likely link it so you can do something like:

```bash
pnpm install
pnpm run build -r
```

Then from the root, you might invoke:

```bash
cd packages/example-app
npx my-shadcn-tool init
```

Or add a script in `example-app/package.json`:

```json
{
  "scripts": {
    "shadcn": "my-shadcn-tool"
  }
}
```

(If you configure the workspace so that `@my-shadcn-tool/cli` is recognized, then `"my-shadcn-tool"` commands will work locally.)

---

## 6. MVP Command Implementations: Outline

You **don't** need a fully fleshed-out AST diff or advanced merges for an MVP. Each command can be minimal:

1. **init**  
   - Writes a config file (e.g. `.my-shadcn-toolrc.json`) at the root of `example-app` to store paths:
     ```json
     {
       "baseDir": "components/base",
       "brandDir": "components/brand"
     }
     ```
2. **add <componentName>**  
   - E.g. `my-shadcn-tool add button`.
   - Downloads or copy-pastes `button.tsx` from official shadcn's GitHub or a local registry.
   - Writes it to `components/base/button.tsx`.
   - Optionally scaffolds `components/brand/button.tsx` with some placeholder brand logic.

3. **update <componentName>**  
   - Fetches the latest upstream.
   - Overwrites or merges into `components/base/button.tsx` (for MVP, naive overwrite is often enough).

4. **brand**  
   - Could have subcommands like `my-shadcn-tool brand add-variant button brandPink`.
   - For MVP, you might just do `console.log("brand command not implemented yet")`.

---

## 7. Documentation / README

In the **root** of the repo, you should have a `README.md` explaining:

- **How to install** and build the CLI (e.g. `pnpm install && pnpm build -r`).  
- **How to run** commands within the example app.  
- **What** each command does in your MVP.

Be clear that this is a **proof of concept** to demonstrate the base→brand layering, not a production-ready tool just yet.

---

## 8. Testing the Flow

1. **Install dependencies** at the repository root:
   ```bash
   pnpm install
   pnpm build -r
   ```
2. **Go to** `packages/example-app`:
   ```bash
   cd packages/example-app
   ```
3. **Initialize** the tool:
   ```bash
   npx my-shadcn-tool init
   ```
4. **Add** a component:
   ```bash
   npx my-shadcn-tool add button
   ```
   - Verify `components/base/button.tsx` now exists  
   - Optionally check if `components/brand/button.tsx` was also created
5. **Use** your new brand or base component inside the Next.js app's pages.
6. **Run** the app:
   ```bash
   pnpm dev
   ```
   and confirm everything works.

---

## 9. Next Steps & Expansions

- **AST/Line-by-Line Diffs**: Instead of overwriting, do real merges for `update`.
- **Brand Tokens**: Provide a `.json` or `.css` for brand variables and auto-inject them into brand overrides.
- **Multi-Brand**: Allow multiple brand layers or theming modes.
- **Better Logging & Error Handling**: More robust user feedback when a command runs.
- **Publish** the CLI to npm for easier consumption by external users.

---

## 10. Summary

By setting up:

1. **A CLI package** for "init," "add," "update," etc. in `packages/cli/`,  
2. **An example app** in `packages/example-app/` that demonstrates your base→brand approach,

…you create a minimal but fully functional **tool** that can automate how devs add and override shadcn components. This is enough to validate the concept and gather real feedback before investing in advanced merge logic or additional features.
