# shadowfax-ui

A tool for managing shadcn components with base/brand layering. This monorepo contains both the CLI tool and an example app demonstrating its usage.

## Project Structure

```
shadowfax-ui/
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
   pnpm shadowfax init
   pnpm shadowfax add button
   ```

## Available Commands

- `shadowfax init` - Initialize the base/brand component structure
- `shadowfax add <component>` - Add a new component
- `shadowfax update <component>` - Update an existing component
- `shadowfax brand list` - List all brand overrides

## Development

- The CLI source is in `packages/cli/src/`
- The example app is a standard Next.js app in `packages/example-app/`
- Run `pnpm build -r` from the root to build all packages

## License

MIT
