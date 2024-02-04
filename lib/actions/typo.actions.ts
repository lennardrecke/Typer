'use server';

import { revalidatePath } from 'next/cache';
import Typo from '../models/typo.model';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';
import Community from '../models/community.model';

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createTypo({ text, author, communityId, path }: Params) {
  try {
    connectToDatabase();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdTypo = await Typo.create({
      text,
      author,
      community: communityIdObject,
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { typos: createdTypo._id },
    });

    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { typos: createdTypo._id },
      });
    }

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
    .populate({ path: 'community', model: Community })
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

async function fetchAllChildTypos(typoId: string): Promise<any[]> {
  const childTypos = await Typo.find({ parentId: typoId });

  const descendantTypos = [];

  for (const childTypo of childTypos) {
    const descendants = await fetchAllChildTypos(childTypo._id);
    descendantTypos.push(childTypo, ...descendants);
  }

  return descendantTypos;
}

export async function deleteTypo(typoId: string, path: string): Promise<void> {
  try {
    connectToDatabase();

    const mainTypo = await Typo.findById(typoId).populate('author community');

    if (!mainTypo) {
      throw new Error('Typo not found');
    }

    const descendantTypos = await fetchAllChildTypos(typoId);

    const descendantTypoIds = [
      typoId,
      ...descendantTypos.map((typo) => typo._id),
    ];

    const uniqueAuthorIds = new Set(
      [
        ...descendantTypos.map((typo) => typo.author?._id?.toString()),
        mainTypo.author?._id?.toString(),
      ].filter((typoId) => typoId !== null)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantTypos.map((typo) => typo.community?._id?.toString()),
        mainTypo.community?._id?.toString(),
      ].filter((typoId) => typoId !== null)
    );

    await Typo.deleteMany({ _id: { $in: descendantTypoIds } });

    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { typos: { $in: descendantTypoIds } } }
    );

    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { typos: { $in: descendantTypoIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error deleting typo: ${error.message}`);
  }
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
        path: 'community',
        model: Community,
        select: '_id id name image',
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
