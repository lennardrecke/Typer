import { fetchUserTypos } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react';
import TypoCard from '../cards/TypoCard';

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const TyposTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result = await fetchUserTypos(accountId);

  if (!result) redirect('/');

  const sameUser = currentUserId === accountId;

  return (
    <section className='mt-6 flex flex-col gap-6'>
      {result.typos.map((typo: any) => (
        <TypoCard
          key={typo._id}
          id={typo._id}
          currentUserId={currentUserId}
          parentId={typo.parentId}
          content={typo.text}
          author={
            accountType === 'User'
              ? {
                  name: result.name,
                  username: result.username,
                  image: result.image,
                  id: result.id,
                }
              : {
                  name: typo.author.name,
                  username: result.author.username,
                  image: typo.author.image,
                  id: typo.author.id,
                }
          }
          community={typo.community}
          createdAt={typo.createdAt}
          comments={typo.children}
          sameUser={sameUser}
        />
      ))}
    </section>
  );
};

export default TyposTab;
