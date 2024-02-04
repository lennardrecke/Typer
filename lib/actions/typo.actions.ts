'use server';

import { revalidatePath } from 'next/cache';
import Typo from '../models/typo.model';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createTypo({ text, author, communityId, path }: Params) {
  try {
    connectToDatabase();

    const createdTypo = await Typo.create({
      text,
      author,
      community: null,
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { typos: createdTypo._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating typo: ${error.message}`);
  }
}

export async function fetchTypos(pageNumber = 1, pageSize = 20) {
  connectToDatabase();

  const skipAmount = (pageNumber - 1) * pageSize;

  const typosQuery = Typo.find({ parentId: { $in: [null, undefined] } })
    .sort({
      createdAt: 'desc',
    })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: '_id name parentId image',
      },
    });

  const totalTyposCount = await Typo.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const typos = await typosQuery.exec();

  const isNext = totalTyposCount > skipAmount + typos.length;

  return { typos, isNext };
}

export async function fetchTypoById(id: string) {
  connectToDatabase();

  try {
    //TODO: Populate community
    const typo = await Typo.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name username image',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id name username parentId image',
          },
          {
            path: 'children',
            model: Typo,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image',
            },
          },
        ],
      })
      .exec();

    return typo;
  } catch (error: any) {
    throw new Error(`Error fetching typo: ${error.message}`);
  }
}

export async function addCommentToTypo(
  typoId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDatabase();

  try {
    const originalTypo = await Typo.findById(typoId);

    if (!originalTypo) {
      throw new Error('Typo not found');
    }

    const commentTypo = new Typo({
      text: commentText,
      author: userId,
      parentId: typoId,
    });

    const savedCommentTypo = await commentTypo.save();

    originalTypo.children.push(savedCommentTypo._id);

    await originalTypo.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to typo: ${error.message}`);
  }
}
