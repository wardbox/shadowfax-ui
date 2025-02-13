"use client"

import { Button as BaseButton } from "@/components/base/button"
import { Button } from "@/components/brand/button"
import { useState } from "react"
import { Highlight, themes } from "prism-react-renderer"

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:bg-gray-700"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">{label}</h4>
      <div className="relative">
        <Highlight
          theme={themes.nightOwl}
          code={code}
          language="tsx"
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto" style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
        <CopyButton code={code} />
      </div>
    </div>
  )
}

const INITIAL_CODE = `import { Button as BaseButton, type ButtonProps } from "../base/button"
import { twMerge } from "tailwind-merge"

export function Button({ className, ...props }: ButtonProps) {
  return (
    <BaseButton 
      {...props} 
      className={twMerge(
        // Add your brand-specific styles here
        className
      )}
    />
  )
}`

const ENHANCED_CODE = `import { Button as BaseButton, type ButtonProps } from "../base/button"
import { twMerge } from "tailwind-merge"
import { Loader2 } from "lucide-react"

// Extend the base props
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
}`

const USAGE_CODE = `"use client"

import { useState } from "react"
import { Button } from "@/components/brand/button"

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  return (
    <div>
      <Button onClick={handleClick} isLoading={isLoading}>
        Click to Load
      </Button>
      <Button variant="secondary" isLoading={true}>
        Always Loading
      </Button>
    </div>
  )
}`

const USAGE_CODE_OLD = `"use client"

import { useState } from "react"
import { Button as BaseButton } from "@/components/base/button"
import { Button } from "@/components/brand/button"

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  return (
    <div className="p-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">Base Components</h2>
          <p className="text-gray-600 mb-6">Default shadcn button variants</p>
          <div className="flex flex-wrap gap-4">
            <BaseButton>Default</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="outline">Outline</BaseButton>
            <BaseButton variant="ghost">Ghost</BaseButton>
            <BaseButton disabled>Disabled</BaseButton>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Brand Components</h2>
          <p className="text-gray-600 mb-6">Brand layer with loading state</p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleClick} isLoading={isLoading}>
              Click to Load
            </Button>
            <Button variant="secondary" isLoading={true}>
              Always Loading
            </Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">How to Add Loading State</h2>
          <div className="space-y-8">
            <CodeBlock 
              label="1. Initial Generated Button (src/components/brand/button.tsx)" 
              code={INITIAL_CODE}
            />
            
            <CodeBlock 
              label="2. Enhanced with Loading State (src/components/brand/button.tsx)" 
              code={ENHANCED_CODE}
            />
            
            <CodeBlock 
              label="3. Using the Enhanced Button (app/page.tsx)" 
              code={USAGE_CODE}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-700">
              <p>
                After copying and implementing the enhanced button code, your brand buttons will have loading state functionality.
                The enhancement adds a loading spinner while preserving the button&apos;s width and showing a loading cursor.
                The button automatically disables while loading to prevent multiple clicks.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}`

export default function Page() {
  const [isLoadingDefault, setIsLoadingDefault] = useState(false)
  const [isLoadingOutline, setIsLoadingOutline] = useState(false)
  const [isLoadingGhost, setIsLoadingGhost] = useState(false)

  const handleClickDefault = () => {
    setIsLoadingDefault(true)
    setTimeout(() => setIsLoadingDefault(false), 3000)
  }

  const handleClickOutline = () => {
    setIsLoadingOutline(true)
    setTimeout(() => setIsLoadingOutline(false), 3000)
  }

  const handleClickGhost = () => {
    setIsLoadingGhost(true) 
    setTimeout(() => setIsLoadingGhost(false), 3000)
  }

  return (
    <div className="p-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">Base Components</h2>
          <p className="text-gray-600 mb-6">Default shadcn button variants</p>
          <div className="flex flex-wrap gap-4">
            <BaseButton>Default</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="outline">Outline</BaseButton>
            <BaseButton variant="ghost">Ghost</BaseButton>
            <BaseButton disabled>Disabled</BaseButton>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Brand Components</h2>
          <p className="text-gray-600 mb-6">Brand layer with loading state</p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleClickDefault} isLoading={isLoadingDefault}>
              Click to Load
            </Button>
            <Button variant="secondary" isLoading={true}>
              Always Loading
            </Button>
            <Button onClick={handleClickOutline} variant="outline" isLoading={isLoadingOutline}>Outline</Button>
            <Button onClick={handleClickGhost} variant="ghost" isLoading={isLoadingGhost}>Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">How to Add Loading State</h2>
          <div className="space-y-8">
            <CodeBlock 
              label="1. Initial Generated Button (src/components/brand/button.tsx)" 
              code={INITIAL_CODE}
            />
            
            <CodeBlock 
              label="2. Enhanced with Loading State (src/components/brand/button.tsx)" 
              code={ENHANCED_CODE}
            />
            
            <CodeBlock 
              label="3. Using the Enhanced Button (app/page.tsx)" 
              code={USAGE_CODE}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-700">
              <p>
                After copying and implementing the enhanced button code, your brand buttons will have loading state functionality.
                The enhancement adds a loading spinner while preserving the button&apos;s width and showing a loading cursor.
                The button automatically disables while loading to prevent multiple clicks.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

