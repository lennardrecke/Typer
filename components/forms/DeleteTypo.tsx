'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { deleteTypo } from '@/lib/actions/typo.actions';

interface Props {
  typoId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteTypo({
  typoId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className='flex flex-row gap-1 cursor-pointer'
      onClick={async () => {
        await deleteTypo(typoId, pathname);
        if (!parentId || !isComment) {
          router.push('/');
        }
      }}>
      <Image
        src='/assets/delete.svg'
        alt='delte'
        width={18}
        height={18}
        className='object-contain'
      />
      <p className='text-red-500 font-semibold'>Delete Typo</p>
    </div>
  );
}

export default DeleteTypo;
