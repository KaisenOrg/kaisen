import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline"
import { TabNavigation } from "./tab-navigation"
import type { TabRouteType } from "./tab-navigation-item"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  baseUrl?: string
  subtitle: string
  imageUrl?: string
  showBackButton?: boolean
  onBackClick?: () => void
  tabs?: TabRouteType[]
  showBgImage?: boolean
  headerClassname?: string
  imageFallback?: string
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, subtitle, showBackButton = true, onBackClick, tabs, baseUrl, imageUrl, imageFallback, showBgImage = true, headerClassname, ...props }, ref) => {
    return (
      <header className={cn("relative w-full px-8 pt-12 bg-background", headerClassname)}>
        {showBgImage &&
          (<div className="absolute pointer-events-none select-none right-0 top-0 w-96 h-[75%] lg:h-full">
            <img
              src="/geometric-bg-2.svg"
              alt=""
              aria-hidden="true"
              sizes="160px"
              draggable={false}
            />
          </div>)
        }
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-10">
            {imageUrl && (
              <Avatar className="w-24 h-24">
                <AvatarImage src={imageUrl} />
                <AvatarFallback className="text-3xl">
                  {imageFallback || '??'}
                </AvatarFallback>
              </Avatar>
            )}

            <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
              {showBackButton ? (
                <button onClick={onBackClick}
                  className="flex items-center gap-2 text-sm text-muted-foreground w-fit hover:text-foreground cursor-pointer"
                >
                  <ArrowLongLeftIcon className="h-4 w-4" />
                  BACK
                </button>
              ) : <div className="h-1" />}
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          {(tabs && baseUrl) &&
            <TabNavigation tabs={tabs} baseUrl={baseUrl} />
          }
        </div>
      </header>
    )
  }
)
