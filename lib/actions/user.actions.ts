'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';
import { connect } from 'http2';
import Typo from '../models/typo.model';
import { FilterQuery, SortOrder } from 'mongoose';

interface Params {
  userId: string;
  username: string;
  name: string;
  image: string;
  path: string;
  bio: string;
  pronouns: string;
}
export async function updateUser({
  userId,
  username,
  name,
  image,
  path,
  bio,
  pronouns,
}: Params): Promise<void> {
  connectToDatabase();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        pronouns,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDatabase();

    return await User.findOne({ id: userId });
    /*.populate({
      path: 'communities',
      model: Community
    })*/
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserTypos(userId: string) {
  try {
    connectToDatabase();

    return await User.findOne({ id: userId }).populate({
      path: 'typos',
      model: Typo,
      populate: {
        path: 'children',
        model: Typo,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id',
        },
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDatabase();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, 'i');

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = {
      createdAt: sortBy,
    };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDatabase();

    const userTypos = await Typo.find({ author: userId });

    const childTypoIds = userTypos.reduce((acc, userTypos) => {
      return acc.concat(userTypos.children);
    }, []);

    const replies = await Typo.find({
      _id: { $in: childTypoIds },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id text',
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch user activity: ${error.message}`);
  }
}
