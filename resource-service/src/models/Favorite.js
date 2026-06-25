import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Movie',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
