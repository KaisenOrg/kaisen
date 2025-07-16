import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle: string
  showBackButton?: boolean
  onBackClick?: () => void
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, subtitle, showBackButton = true, onBackClick, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="flex items-center gap-2 text-sm text-muted-foreground w-fit"
          >
            <ArrowLongLeftIcon className="h-4 w-4" />
            BACK
          </button>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">
          {subtitle}
        </p>
      </div>
    )
  }
)

PageHeader.displayName = "PageHeader"

export { PageHeader }