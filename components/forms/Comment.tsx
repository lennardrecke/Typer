'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { CommentValidation } from '@/lib/validations/typo';
import { Input } from '../ui/input';
import Image from 'next/image';
import { addCommentToTypo } from '@/lib/actions/typo.actions';
//import { addComment } from '@/lib/actions/typo.actions';

interface Props {
  typoId: string;
  currentUserImg: string;
  currentUserId: string;
}
const Comment = ({ typoId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      typo: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToTypo(
      typoId,
      values.typo,
      JSON.parse(currentUserId),
      pathname
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='comment-form'>
        <FormField
          control={form.control}
          name='typo'
          render={({ field }) => (
            <FormItem className='flex items-center gap-3 w-full'>
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt='Profile image'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  placeholder='Comment...'
                  className='no-focus outline-none text-light-1'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' className='comment-form_btn'>
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
