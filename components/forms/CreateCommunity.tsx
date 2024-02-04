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
  const [isProcessing, setIsProcessing] = React.useState(false);

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
    setIsProcessing(true);
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
        {isProcessing ? (
          <DialogContent>
            <div className='text-center'>
              <div role='status'>
                <svg
                  aria-hidden='true'
                  className='inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='currentColor'
                  />
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentFill'
                  />
                </svg>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          </DialogContent>
        ) : (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunity;
