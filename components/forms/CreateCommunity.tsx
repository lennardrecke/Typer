'use client';
import React, { ChangeEvent } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';
import { CommunityValidation } from '@/lib/validations/community';
import { Input } from '../ui/input';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64Image } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs';
import { createCommunity } from '@/lib/actions/community.actions';
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';

interface Props {
  userId: string;
}
const CreateCommunity = ({ userId }: Props) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const { startUpload } = useUploadThing('media');
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(CommunityValidation),
    defaultValues: {
      image: '',
      communityName: '',
      bio: '',
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFiles(Array.from(e.target.files));

      if (!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';

        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const validateCommunityName = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    return slug;
  };

  const onSubmit = async (values: z.infer<typeof CommunityValidation>) => {
    const blob = values.image;

    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.image = imgRes[0].url;
      }
    }

    const result = await createCommunity(
      values.communityName,
      validateCommunityName(values.communityName),
      values.image,
      values.bio,
      userId
    );

    form.reset();
    router.push(`/communities/${result.id}`);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className='h-full py-4 bg-primary-500'>Create Community</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h1 className='text-2xl font-semibold text-light-1'>
              Create Community
            </h1>
          </DialogTitle>
        </DialogHeader>
        <div className=''>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='community-form'>
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-4 mt-10'>
                    <FormLabel className='account-form_image-label'>
                      {field.value ? (
                        <Image
                          src={field.value}
                          alt='profile photo'
                          width={96}
                          height={96}
                          priority
                          className='rounded-full object-contain'
                        />
                      ) : (
                        <Image
                          src='/assets/profile.svg'
                          alt='profile photo'
                          width={24}
                          height={24}
                          className='object-contain'
                        />
                      )}
                    </FormLabel>
                    <FormControl className='flex-1 text-base-semibold text-gray-200'>
                      <Input
                        type='file'
                        accept='image/*'
                        placeholder='Upload a photo'
                        className='account-form_image-input'
                        onChange={(e) => handleImage(e, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='communityName'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-3 w-full mt-10'>
                    <FormLabel className='text-base-semibold text-light-2'>
                      Community Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        className='account-form_input no-focus'
                        placeholder='Enter community name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-3 w-full mt-10'>
                    <FormLabel className='text-base-semibold text-light-2'>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        className='account-form_input no-focus'
                        placeholder='Enter community name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className='flex w-full justify-evenly items-center'>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className='h-full py-4 bg-primary-500'>
            Create Community
          </Button>
          <DialogClose asChild>
            <Button className='h-full py-4 bg-light-3'>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunity;
