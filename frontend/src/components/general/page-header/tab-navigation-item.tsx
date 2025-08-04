import { Link, useLocation } from "react-router-dom"

export type TabRouteType = {
  value: string
  label: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export function TabNavigationItem({ route, baseUrl }: { route: TabRouteType, baseUrl: string }) {
  const pathname = useLocation().pathname
  const normalizedBaseUrl = (baseUrl.endsWith("/") && route.value) ? `${baseUrl}/` : baseUrl
  const normalizedRouteValue = route.value === "" || route.value === "/" ? "" : route.value
  const tabUrl = `${normalizedBaseUrl}${normalizedRouteValue}`
  const isActive = pathname === tabUrl || (route.value === "" || route.value === "/") && pathname === normalizedBaseUrl

  return (
    <Link
      to={`${baseUrl}${route.value}`}
      className={`transition-all flex items-center gap-3 px-3 py-4 hover:text-primary ${isActive ? "text-white border-b-2 border-primary" : "text-zinc-500"
        }`}
    >
      {route.icon && (
        <route.icon
          className="h-6 w-6"
          style={isActive ? { color: "var(--primary)" } : undefined}
        />
      )}
      <span>{route.label}</span>
    </Link>
  )
}