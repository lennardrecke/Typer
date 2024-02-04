import mongoose from 'mongoose';
import { string } from 'zod';

const typoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Typo',
    },
  ],
});

const Typo = mongoose.models.Typo || mongoose.model('Typo', typoSchema);

export default Typo;
