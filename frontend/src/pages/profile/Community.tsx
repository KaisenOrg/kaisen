import { TabNavigation } from '@/components/general/page-header';
import ProfileLeft from '@/components/specific/profile/profile-left';
import { UserIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

export default function ProfileCommunityPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-8">
      <div className="flex">
        <ProfileLeft />
        <div className='ml-20'>
          <TabNavigation
            tabs={[
              { label: 'Overview', value: '/overview', icon: UserIcon },
              { label: 'Community', value: '/community', icon: MegaphoneIcon }
            ]}
            baseUrl="/profile"
          />

          <div className="my-4 font-medium w-full">
            <p>Jose's recent community posts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
