import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'
import { PageHeader } from '@/components/general/page-header'
import { ProfileSidebar } from '@/components/specific/profile/profileSidebar'

export default function ProfileLayout() {
  const { user } = useUser()

  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]')

    const handleClick = (e: Event) => {
      e.preventDefault()
      const target = document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute('href') || '')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }

    anchors.forEach(anchor => anchor.addEventListener('click', handleClick))

    return () => {
      anchors.forEach(anchor => anchor.removeEventListener('click', handleClick))
    }
  }, [])

  return (
    <div className="px-14">
      <PageHeader
        imageUrl={user?.picture || 'none'}
        imageFallback={user?.nickname?.slice(0, 2)}
        title={user?.nickname || 'unknown'}
        subtitle={`@${user?.username}` || 'empty'}
        className="mb-12"
        showBgImage={false}
        showBackButton={false}
        headerClassname="bg-transparent"
      />
      <div className="flex items-start px-16 gap-5">
        <ProfileSidebar />

        <Outlet />
      </div>
    </div>

  )
}
