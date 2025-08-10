import { Outlet } from 'react-router-dom'
import { PageHeader } from '@/components/general/page-header'
import { UserIcon, AdjustmentsVerticalIcon, WalletIcon } from '@heroicons/react/24/outline'

export default function SettingsLayout() {
  const tabs = [
    { value: '/', label: 'Profile', icon: UserIcon },
    { value: '/preferences', label: 'Preferences', icon: AdjustmentsVerticalIcon },
    { value: '/wallets', label: 'Wallets', icon: WalletIcon },
  ]

  return (
    <main>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, preferences, and wallets."
        baseUrl="/settings"
        showBackButton={false}
        tabs={tabs}
      />
      <Outlet />
    </main>
  )
}
