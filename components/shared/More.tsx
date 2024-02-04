'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  typoId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

const More = ({
  typoId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) => {
  if (currentUserId !== authorId) return null;
  const pathname = usePathname();
  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const deleteTypo = async (typoId: string, pathname: string) => {
    await deleteTypo(typoId, pathname);
    router.push('/');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className='p-0 bg-transparent'>
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <div className='flex flex-row gap-1 cursor-pointer'>
              <Image
                src='/assets/delete.svg'
                alt='delte'
                width={18}
                height={18}
                className='object-contain'
              />
              <p className='text-red-500 font-semibold'>Delete Typo</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete Typo</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this typo?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => deleteTypo(typoId, pathname)}
              variant='destructive'>
              Delete Typo
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(false)}
              variant='secondary'>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default More;
