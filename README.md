# brand-ui

A tool for managing shadcn components with base/brand layering. This monorepo contains both the CLI tool and an example app demonstrating its usage.

## Project Structure

```
brand-ui/
├─ packages/
│  ├─ cli/              # The core CLI tool
│  └─ example-app/      # Example Next.js app using the tool
├─ pnpm-workspace.yaml
└─ README.md
```

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Build the CLI:
   ```bash
   cd packages/cli
   pnpm build
   ```

3. Try it in the example app:
   ```bash
   cd ../example-app
   pnpm link ../cli  # Link the local CLI package
   pnpm brand-ui init
   pnpm brand-ui add button
   ```

## Available Commands

- `brand-ui init` - Initialize the base/brand component structure
- `brand-ui add <component>` - Add a new component
- `brand-ui update <component>` - Update an existing component
- `brand-ui brand list` - List all brand overrides

## Development

- The CLI source is in `packages/cli/src/`
- The example app is a standard Next.js app in `packages/example-app/`
- Run `pnpm build -r` from the root to build all packages

## License

MIT
