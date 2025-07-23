import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'

import RootLayout from '@/layouts/root-layout'
import ProfileLayout from '@/layouts/profile-layout'
import SettingsLayout from '@/layouts/settings-layout'
import TracksLayout from '@/layouts/tracks-layout'

import Home from '@/pages/Home'
import Discover from '@/pages/Discover'
import ProfilePage from '@/pages/profile'
import SettingsProfilePage from '@/pages/settings'
import PreferencesPage from '@/pages/settings/Preferences'
import KnowledgePage from '@/pages/tracks/knowledge'
import PracticePage from '@/pages/tracks/practice'
import TracksProofPage from '@/pages/tracks/proof'
import WalletsPage from '@/pages/settings/Wallets'
import UserTestPage from '@/pages/Teste'
import TrackPage from '@/pages/tracks'
import { usePopoverStore } from '@/stores/usePopoverStore'
import { useAuth } from '@/hooks/useAuth'

export function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const { user, fetchUser } = useUser();
  const { open, close } = usePopoverStore();

  useEffect(() => {
    open({ type: 'loading' });
    fetchUser().finally(() => close());
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/kai" element={<></>} />
          <Route path="/proof" element={<></>} />
          <Route path="/store" element={<></>} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/community" element={<></>} />
          <Route path="/tracks" element={<TracksLayout />}>
            <Route index element={<Discover />} />
            <Route path=":id" element={<TrackPage />} />
            <Route path=":id/proof" element={<TracksProofPage />} />
            <Route path=":id/practice" element={<PracticePage />} />
            <Route path=":id/knowledge" element={<KnowledgePage />} />
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
            <Route path="/profile" element={<UserTestPage />} />
            <Route path="/settings" element={<UserTestPage />} />
          </>)}
          <Route path="/help" element={<></>} />
          <Route path="*" element={<p>Página não encontrada</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
