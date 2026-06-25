import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    originalTitle: {
      type: String,
      required: false,
    },
    overview: {
      type: String,
      required: false,
    },
    originalLanguage: {
      type: String,
      required: false,
    },
    releaseDate: {
      type: Date,
      required: false,
    },
    genreIds: {
      type: [Number],
      required: false,
    },
    popularity: {
      type: Number,
      required: false,
    },
    voteAverage: {
      type: Number,
      required: false,
    },
    voteCount: {
      type: Number,
      required: false,
    },
    posterPath: {
      type: String,
      required: false,
    },
    backdropPath: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Movie', movieSchema);
