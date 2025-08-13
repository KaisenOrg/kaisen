import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useIntro } from '@/hooks/useIntro';
import { useUser } from '@/providers/user-provider';

import RootLayout from '@/layouts/root-layout';
import SettingsLayout from '@/layouts/settings-layout';
import TracksLayout from '@/layouts/tracks-layout';

import Home from '@/pages/Home';
import Discover from '@/pages/Discover';
import PracticePage from '@/pages/tracks/practice';
import KnowledgePage from '@/pages/tracks/knowledge';
import PreferencesPage from '@/pages/settings/Preferences';
import SettingsProfilePage from '@/pages/settings';
import TracksProofPage from '@/pages/tracks/proof';
import WalletsPage from '@/pages/settings/Wallets';
import CommunityPage from '@/pages/Community';
import UserTestPage from '@/pages/Teste';
import TrackPage from '@/pages/tracks';
import KaiTestPage from '@/pages/Kai';
import Store from '@/pages/Store';
import EditTrackPage from '@/pages/tracks/edit';
import ProfileLayout from '@/layouts/profile-layout';
import ProfilePage from '@/pages/profile';
import ProfileCommunityPage from '@/pages/profile/Community';

import { useTutorial } from "@/hooks/useTutorial";
import TutorialOverlay from "@/components/specific/tutorial/TutorialOverlay";
import { basicSteps } from '@/components/specific/tutorial/Steps';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  );
}

function RoutedApp() {
  const { user, isLoading, principal } = useUser();
  const tutorial = useTutorial();

  const { openIfNeeded, modal } = useIntro({
    principal: principal?.toText?.(),
    onStartTutorial: () => {
      tutorial.start(basicSteps);
    },
  });

  useEffect(() => {
    if (user && !isLoading) openIfNeeded();
  }, [user, isLoading, openIfNeeded]);

  return (
    <>
      <Routes>
        <Route path="/" element={<RootLayout showSideBar={!!user} />}>
          {user ? (
            <>
              <Route index element={<Home />} />
              <Route path="/kai" element={<KaiTestPage />} />
              <Route path="/proof" element={<></>} />
              <Route path="/store" element={<Store />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/language" element={<></>} />
              <Route path="/help" element={<></>} />

              <Route path="/tracks/:id" element={<TracksLayout />}>
                <Route index element={<TrackPage />} />
                <Route path="proof" element={<TracksProofPage />} />
                <Route path="practice" element={<PracticePage />} />
                <Route path="knowledge" element={<KnowledgePage />} />
                <Route path="edit" element={<EditTrackPage />} />
              </Route>

              <Route path="/settings" element={<SettingsLayout />}>
                <Route index element={<SettingsProfilePage />} />
                <Route path="profile" element={<SettingsProfilePage />} />
                <Route path="preferences" element={<PreferencesPage />} />
                <Route path="wallets" element={<WalletsPage />} />
              </Route>

              <Route path="*" element={<p>Página não encontrada</p>} />
            </>
          ) : (
            isLoading ? null : (
              <>
                <Route index element={<UserTestPage />} />
                <Route path="*" element={<UserTestPage />} />
              </>
            )
          )}
        </Route>

        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="overview" element={<ProfilePage />} />
          <Route path="community" element={<ProfileCommunityPage />} />
        </Route>
      </Routes>

      {modal}
      <TutorialOverlay api={tutorial} />
    </>
  );
}
