import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  typos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Typo',
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Community =
  mongoose.models.Community || mongoose.model('Community', communitySchema);

export default Community;
