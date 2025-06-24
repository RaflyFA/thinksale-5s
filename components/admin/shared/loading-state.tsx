import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LoadingStateProps {
  isLoading: boolean
  error: string | null
  onRetry?: () => void
  loadingText?: string
  errorText?: string
  className?: string
}

export function LoadingState({
  isLoading,
  error,
  onRetry,
  loadingText = "Loading...",
  errorText = "An error occurred",
  className = "min-h-[400px]"
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{loadingText}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-destructive mb-4">{errorText}</p>
          {onRetry && (
            <Button onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    )
  }

  return null
} 