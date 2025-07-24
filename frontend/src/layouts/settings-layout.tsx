import { PageHeader } from "@/components/general/page-header";
import { UserIcon, AdjustmentsVerticalIcon, WalletIcon } from "@heroicons/react/24/outline";
import { Outlet } from "react-router-dom";

export default function SettingsLayout() {
  const tabs = [
    { value: "/", label: "Profile", icon: UserIcon },
    { value: "/preferences", label: "Preferences", icon: AdjustmentsVerticalIcon },
    { value: "/wallets", label: "Wallets", icon: WalletIcon },
  ];

  return (
    <main className="">
      <PageHeader
        title="Lorem ipsum"
        subtitle="Lorem ipsum dolor sit amet"
        baseUrl="/settings"
        showBackButton={false}
        tabs={tabs}
      />
      <Outlet />
    </main>
  );
}