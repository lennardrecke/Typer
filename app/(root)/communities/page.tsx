import CommunityCard from '@/components/cards/CommunityCard';
import UserCard from '@/components/cards/UserCard';
import CreateCommunity from '@/components/forms/CreateCommunity';
import Pagination from '@/components/shared/Pagination';
import Searchbar from '@/components/shared/Searchbar';
import { Button } from '@/components/ui/button';
import { fetchCommunities } from '@/lib/actions/community.actions';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  const result = await fetchCommunities({
    searchString: '',
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <>
      <h1 className='head-text mb-10'>Communities</h1>

      <div className='mt-5 flex flex-row justify-between items-center gap-5'>
        <Searchbar routeType='communities' />
        <CreateCommunity userId={user.id} />
      </div>

      <section className='mt-9 flex flex-wrap gap-4'>
        {result.communities.length === 0 ? (
          <p className='no-results'>No Results</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imageUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='communities'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
};

export default Page;
