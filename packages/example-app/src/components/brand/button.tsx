import { Button as BaseButton, type ButtonProps } from "../base/button"
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
}
