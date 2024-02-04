import TypoCard from '@/components/cards/TypoCard';
import Comment from '@/components/forms/Comment';
import { fetchTypoById, fetchTypos } from '@/lib/actions/typo.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const typo = await fetchTypoById(params.id);

  const sameUser = typo.author.id === user.id;

  return (
    <section className='relative'>
      <div className=''>
        <TypoCard
          key={typo._id}
          id={typo._id}
          currentUserId={user?.id || ''}
          parentId={typo.parentId}
          content={typo.text}
          author={typo.author}
          community={typo.community}
          createdAt={typo.createdAt}
          comments={typo.children}
          sameUser={sameUser}
        />
      </div>
      <div className='mt-7'>
        <Comment
          typoId={typo.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className='mt-10'>
        {typo.children.map((comment: any) => (
          <TypoCard
            key={comment._id}
            id={comment._id}
            currentUserId={comment?.id || ''}
            parentId={comment.parentId}
            content={comment.text}
            author={comment.author}
            community={comment.community}
            createdAt={comment.createdAt}
            comments={comment.children}
            isComment
            sameUser={sameUser}
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
