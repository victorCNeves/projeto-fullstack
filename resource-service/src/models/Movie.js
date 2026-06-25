import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    original_title: {
      type: String,
      required: false,
    },
    overview: {
      type: String,
      required: false,
    },
    original_language: {
      type: String,
      required: false,
    },
    release_date: {
      type: Date,
      required: false,
    },
    genre_ids: {
      type: [Number],
      required: false,
    },
    popularity: {
      type: Number,
      required: false,
    },
    vote_average: {
      type: Number,
      required: false,
    },
    vote_count: {
      type: Number,
      required: false,
    },
    poster_path: {
      type: String,
      required: false,
    },
    backdrop_path: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.model('Movie', movieSchema);
