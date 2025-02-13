# shadowfax-ui

A CLI tool for managing shadcn components with base/brand layering. Like its namesake - the lord of all horses from The Lord of the Rings - this tool aims to be swift, reliable, and elegant in managing your UI components.

This tool helps you create and maintain a two-layer architecture for your UI components:
- Base layer: Original shadcn components
- Brand layer: Your customized versions with additional functionality

## Installation

We recommend using pnpm for installation:

```bash
# Using pnpm (recommended)
pnpm add -D shadowfax-ui@beta

# Using npm
npm install -D shadowfax-ui@beta

# Using yarn
yarn add -D shadowfax-ui@beta
```

## Usage

### Initialize Your Project

First, initialize your project with the base/brand structure:

```bash
# Using npx (no installation required)
npx shadowfax init

# Or if installed locally in your project:
pnpm exec shadowfax init
```

This will:
1. Run shadcn's init command
2. Create base and brand component directories
3. Set up the necessary configuration

### Add a Component

To add a new shadcn component:

```bash
# Using npx
npx shadowfax add button

# Or if installed locally
pnpm exec shadowfax add button
```

This creates:
- `src/components/base/button.tsx`: The original shadcn component
- `src/components/brand/button.tsx`: Your brand's version with customization hooks

### Update a Component

To update an existing component with the latest shadcn version:

```bash
# Using npx
npx shadowfax update button

# Or if installed locally
pnpm exec shadowfax update button
```

## Example: Enhanced Button with Loading State

The brand layer allows you to enhance components with additional functionality. Here's how to add loading state to a button:

1. The base button remains unchanged in `src/components/base/button.tsx`
2. Enhance the brand button in `src/components/brand/button.tsx`:

\`\`\`tsx
import { Button as BaseButton, type ButtonProps } from "../base/button"
import { twMerge } from "tailwind-merge"
import { Loader2 } from "lucide-react"

interface BrandButtonProps extends ButtonProps {
  isLoading?: boolean
}

export function Button({ 
  className, 
  children,
  disabled,
  isLoading,
  ...props 
}: BrandButtonProps) {
  return (
    <BaseButton 
      disabled={disabled || isLoading}
      {...props} 
      className={twMerge(
        "relative",
        isLoading && "cursor-wait",
        className
      )}
    >
      {isLoading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      <span className={twMerge(
        "inline-flex items-center gap-2",
        isLoading && "invisible"
      )}>
        {children}
      </span>
    </BaseButton>
  )
}
\`\`\`

## Project Structure

```
src/
├─ components/
│  ├─ base/      # Original shadcn components
│  │  └─ button.tsx
│  └─ brand/     # Your enhanced versions
│     └─ button.tsx
```

## License

MIT 
