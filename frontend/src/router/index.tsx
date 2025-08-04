import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/hooks/useUser'
import { usePopoverStore } from '@/stores/usePopoverStore'

import RootLayout from '@/layouts/root-layout'
import ProfileLayout from '@/layouts/profile-layout'
import SettingsLayout from '@/layouts/settings-layout'
import TracksLayout from '@/layouts/tracks-layout'

import Home from '@/pages/Home'
import Discover from '@/pages/Discover'
import ProfilePage from '@/pages/profile'
import PracticePage from '@/pages/tracks/practice'
import KnowledgePage from '@/pages/tracks/knowledge'
import PreferencesPage from '@/pages/settings/Preferences'
import SettingsProfilePage from '@/pages/settings'
import TracksProofPage from '@/pages/tracks/proof'
import WalletsPage from '@/pages/settings/Wallets'
import CommunityPage from '@/pages/Community'
import UserTestPage from '@/pages/Teste'
import TrackPage from '@/pages/tracks'
import KaiTestPage from '@/pages/Kai'
import Store from '@/pages/Store'

export function AppRoutes() {
  const { isAuthenticated } = useAuth()
  const { user, fetchUser } = useUser()
  const { open, close } = usePopoverStore()

  useEffect(() => {
    open({ type: 'loading' })
    fetchUser().finally(() => close())
  }, [isAuthenticated])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/kai" element={<KaiTestPage />} />
          <Route path="/proof" element={<></>} />
          <Route path="/store" element={<Store/>} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/tracks/:id" element={<TracksLayout />}>
            <Route index element={<TrackPage />} />
            <Route path="proof" element={<TracksProofPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            {/* outras rotas */}
          </Route>
          {user ? (<>
            <Route path="/profile" element={<ProfileLayout />}>
              <Route index element={<ProfilePage />} />
              <Route path=':id' element={<ProfilePage />} />
              {/* outras rotas */}
            </Route>
            <Route path="/settings" element={<SettingsLayout />}>
              <Route index element={<SettingsProfilePage />} />
              <Route path="profile" element={<SettingsProfilePage />} />
              <Route path="preferences" element={<PreferencesPage />} />
              <Route path="wallets" element={<WalletsPage />} />
              {/* outras rotas */}
            </Route>
          </>) : (<>
            <Route path="/profile">
              <Route index element={<UserTestPage />} />
              <Route path="*" element={<UserTestPage />} />
            </Route>
            <Route path="/settings">
              <Route index element={<UserTestPage />} />
              <Route path="*" element={<UserTestPage />} />
            </Route>
          </>)}
          <Route path="/language" element={<></>} />
          <Route path="/help" element={<></>} />
          
          <Route path="*" element={<p>Página não encontrada</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
