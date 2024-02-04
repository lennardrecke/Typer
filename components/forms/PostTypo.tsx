'use client';

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
import React from 'react';
import { Textarea } from '../ui/textarea';
import { usePathname, useRouter } from 'next/navigation';
import { TypoValidation } from '@/lib/validations/typo';
import { createTypo } from '@/lib/actions/typo.actions';

//import { updateTypo } from '@/lib/actions/typo.actions';

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    pronouns: string;
    image: string;
  };
  btnTitle: string;
}

function PostTypo({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(TypoValidation),
    defaultValues: {
      typo: '',
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof TypoValidation>) => {
    await createTypo({
      text: values.typo,
      author: userId,
      communityId: null,
      path: pathname,
    });

    router.push('/');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col justify-start gap-10 mt-10'>
        <FormField
          control={form.control}
          name='typo'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-primary-500'>
          Post Typo
        </Button>
      </form>
    </Form>
  );
}

export default PostTypo;
