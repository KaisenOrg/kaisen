import { TabNavigationItem, TabRouteType } from "./tab-navigation-item";

interface TabNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabRouteType[]
  baseUrl: string
}

export function TabNavigation({ tabs, baseUrl }: TabNavigationProps) {
  return (
    <nav className="mt-4 flex">
      {tabs.map((route) => (
        <TabNavigationItem key={route.value} route={route} baseUrl={baseUrl} />
      ))}
    </nav>
  );
}