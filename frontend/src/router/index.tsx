import RootLayout from '@/layouts/root-layout'
import TracksLayout from '@/layouts/tracks-layout'
import Discover from '@/pages/Discover'
import Home from '@/pages/Home'
import TrackPage from '@/pages/tracks'
import KnowledgePage from '@/pages/tracks/knowledge'
import PracticePage from '@/pages/tracks/practice'
import TracksProofPage from '@/pages/tracks/proof'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/kai" element={<></>} />
          <Route path="/tracks" element={<Discover />} />
          <Route path="/proof" element={<></>} />
          <Route path="/store" element={<></>} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/community" element={<></>} />
          <Route path="/tracks/:trackId" element={<TracksLayout />}>
            <Route index element={<TrackPage />} />
            <Route path="proof" element={<TracksProofPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            {/* outras rotas */}
          </Route>
          <Route path="/profile/:username">
            <Route index element={<></>} />
            {/* outras rotas */}
          </Route>
          <Route path="/settings">
            <Route path="profile" element={<></>} />
            <Route path="preferences" element={<></>} />
            <Route path="wallets" element={<></>} />
            {/* outras rotas */}
          </Route>
          <Route path="/help" element={<></>} />
          <Route path="*" element={<p>Página não encontrada</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
