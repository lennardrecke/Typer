import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteTypo from '../forms/DeleteTypo';
import { Button } from '../ui/button';
import { MoreVertical } from 'lucide-react';

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className='p-0 bg-transparent'>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <DeleteTypo
            typoId={typoId}
            currentUserId={currentUserId}
            authorId={authorId}
            parentId={parentId}
            isComment={isComment}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default More;
