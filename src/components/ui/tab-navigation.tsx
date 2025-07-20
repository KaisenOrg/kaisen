import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { SVGProps } from "react"

export interface Tab {
  value: string
  label: string
  icon: React.ComponentType<SVGProps<SVGSVGElement>>
}

interface TabNavigationProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  tabs: Tab[]
  value: string 
}

const TabNavigation = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabNavigationProps
>(({ className, tabs, value, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  >
    {tabs.map((tab) => (
      <TabsPrimitive.Trigger
        key={tab.value}
        value={tab.value}
        className={cn(
          "flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-muted-foreground whitespace-nowrap",
          "text-sm font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "data-[state=active]:border-primary data-[state=active]:text-foreground",
        )}
      >
        <tab.icon
          className={cn(
            "h-5 w-5",
            value === tab.value ? "text-ring" : "text-muted-foreground"
          )}
        />
        {tab.label}
      </TabsPrimitive.Trigger>
    ))}
  </TabsPrimitive.List>
))

TabNavigation.displayName = "TabNavigation"

export { TabNavigation }