'use client';
import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../ui/dialog';
import Image from 'next/image';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Copy } from 'lucide-react';

const Share = ({
  typoId,
  shareType,
}: {
  typoId: string;
  shareType: string;
}) => {
  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    const link = document.getElementById('link') as HTMLInputElement;
    navigator.clipboard.writeText(link.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src='/assets/share.svg'
          alt='Share'
          width={24}
          height={24}
          className='cursor-pointer object-contain'
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='capitalize'>share {shareType}</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='link' className='sr-only'>
              Link
            </Label>
            <Input
              id='link'
              defaultValue={`${window.location.origin}/${shareType}/${typoId}`}
              readOnly
            />
          </div>
          <Button
            type='submit'
            size='sm'
            className='px-3'
            onClick={copyToClipboard}>
            <span className='sr-only'>Copy</span>
            <Copy className='h-4 w-4' />
          </Button>
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Share;
