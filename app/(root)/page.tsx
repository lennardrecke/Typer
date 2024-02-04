import TypoCard from '@/components/cards/TypoCard';
import Pagination from '@/components/shared/Pagination';
import { fetchTypos } from '@/lib/actions/typo.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  const result = await fetchTypos(
    searchParams.page ? +searchParams.page : 1,
    30
  );

  return (
    <>
      <h1 className='head-text text-left'>Home</h1>

      <section className='mt-9 flex flex-col gap-6'>
        {result.typos.length === 0 ? (
          <p className='no-result'>No Typos found</p>
        ) : (
          <>
            {result.typos.map((typo) => (
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
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='/'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}
