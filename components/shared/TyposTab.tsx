import { fetchUserTypos } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react';
import TypoCard from '../cards/TypoCard';
import { fetchCommunityTypos } from '@/lib/actions/community.actions';

interface Result {
  name: string;
  image: string;
  username: string;
  id: string;
  typos: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      username: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const TyposTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let results: Result;

  if (accountType === 'Community') {
    results = await fetchCommunityTypos(accountId);
  } else {
    results = await fetchUserTypos(accountId);
  }

  if (!results) redirect('/');

  const sameUser = currentUserId === accountId;

  return (
    <section className='mt-6 flex flex-col gap-6'>
      {results.typos.map((typo: any) => (
        <TypoCard
          key={typo._id}
          id={typo._id}
          currentUserId={currentUserId}
          parentId={typo.parentId}
          content={typo.text}
          author={
            accountType === 'User'
              ? {
                  name: results.name,
                  username: results.username,
                  image: results.image,
                  id: results.id,
                }
              : {
                  name: typo.author.name,
                  username: typo.author.username,
                  image: typo.author.image,
                  id: typo.author.id,
                }
          }
          community={
            accountType === 'Community'
              ? { name: results.name, id: results.id, image: results.image }
              : typo.community
          }
          createdAt={typo.createdAt}
          comments={typo.children}
        />
      ))}
    </section>
  );
};

export default TyposTab;
