import RootLayout from '@/layouts/root-layout'
import TracksLayout from '@/layouts/tracks-layout'
import Discover from '@/pages/Discover'
import Home from '@/pages/Home'
import TrackPage from '@/pages/tracks'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export function AppRoutes() {
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
          <Route path="/tracks/:trackId" element={<TracksLayout />}>
            <Route index element={<TrackPage />} />
            <Route path="proof" element={<></>} />
            <Route path="practice" element={<></>} />
            <Route path="knowledge" element={<></>} />
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
