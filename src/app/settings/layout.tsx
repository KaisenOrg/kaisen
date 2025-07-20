'use client'

import { PageHeader } from "@/components/general/page-header";
import { UserIcon, AdjustmentsVerticalIcon, WalletIcon } from "@heroicons/react/24/outline";

export default function TracksLayout({ children }: { children: React.ReactNode }) {
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
        tabs={tabs}
      />
      {children}
    </main>
  );
}