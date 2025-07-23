import RootLayout from '@/layouts/root-layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<>oi</>} />
          <Route path="/home" element={<></>} />
          <Route path="/kai" element={<></>} />
          <Route path="/discover" element={<></>} />
          <Route path="/community" element={<></>} />
          <Route path="/store" element={<></>} />
          <Route path="/tracks/:trackId">
            <Route index element={<></>} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
