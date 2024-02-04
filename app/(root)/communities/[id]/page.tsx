import React from 'react';
import { currentUser } from '@clerk/nextjs';
import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { communityTabs } from '@/constants';
import Image from 'next/image';
import TyposTab from '@/components/shared/TyposTab';
import { fetchCommunityDetails } from '@/lib/actions/community.actions';
import UserCard from '@/components/cards/UserCard';

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section className=''>
      <ProfileHeader
        accountId={communityDetails.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        pronouns={communityDetails.pronouns}
        type='Community'
      />

      <div className='mt-9'>
        <Tabs defaultValue='typos' className='w-full'>
          <TabsList className='tab'>
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === 'Typos' && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {communityDetails?.typos?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value='typos' className='w-full text-light-1'>
            <TyposTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              accountType='Community'
            />
          </TabsContent>

          <TabsContent value='members' className='w-full text-light-1'>
            <section className='mt-9 flex flex-col gap-10'>
              {communityDetails.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imageUrl={member.image}
                  personType='User'
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value='requests' className='w-full text-light-1'>
            <TyposTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              accountType='Community'
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
