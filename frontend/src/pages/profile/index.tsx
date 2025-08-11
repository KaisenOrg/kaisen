import { TabNavigation } from '@/components/general/page-header';
import { UserIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import CommunityCard from '@/components/specific/community/community-card';
import ProfileLeft from '@/components/specific/profile/profile-left';
import { ActivityCard } from '@/components/specific/profile/activity-card';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-8">
      <div className="flex w-full">
        <ProfileLeft />

        {/* Right section now grows to fill space */}
        <div className="ml-20 w-full">
          <TabNavigation
            tabs={[
              { label: 'Overview', value: '/overview', icon: UserIcon },
              { label: 'Community', value: '/community', icon: MegaphoneIcon }
            ]}
            baseUrl="/profile"
          />

          <div className="my-4 font-medium w-full">
            <p>Collaboration</p>
            <div className="py-4 w-full flex flex-col gap-2">
              <CommunityCard
                variant="profile"
                title="Sample"
                description="This is a sample description."
                creator="John Doe"
                members="1k"
                time="2h"
                id="123"
              />
              <CommunityCard
                variant="profile"
                title="Sample"
                description="This is a sample description."
                creator="John Doe"
                members="1k"
                time="2h"
                id="123"
              />
            </div>
          </div>
          <Separator />
          <div className="my-4 font-medium w-full">
            <p>Activity</p>
            <div className="py-4 w-full flex flex-col gap-2">
              <ActivityCard
                message="Sample activity message"
                username="John Doe"
                coins={100}
              />
              <ActivityCard
                message="Sample activity message"
                username="John Doe"
                coins={100}
              />
              <ActivityCard
                message="Sample activity message"
                username="John Doe"
                coins={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
