import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { fetchUser } from '@/lib/actions/user.actions';
import PostTypo from '@/components/forms/PostTypo';

async function Page() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  return (
    <>
      <h1 className='head-text'>Create Typo</h1>;
      <PostTypo userId={userInfo._id} />
    </>
  );
}

export default Page;
