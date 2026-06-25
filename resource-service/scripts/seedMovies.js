import connectDB from '../src/config/db.js';
import Movie from '../src/models/Movie.js';
import Genre from '../src/models/Genre.js';
import mongoose from 'mongoose';

const BATCH_SIZE = 10;
const TOTAL_PAGES = 500;

const getUserId = async () => {
  const loginRes = await fetch(`${process.env.AUTH_SERVICE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'user', password: 'user' }),
  });

  if (!loginRes.ok) throw new Error('Falha ao autenticar usuário de seed.');

  const { token } = await loginRes.json();

  const validateRes = await fetch(`${process.env.AUTH_SERVICE_URL}/validate`, {
    headers: { authorization: `Bearer ${token}` },
  });

  if (!validateRes.ok) throw new Error('Falha ao validar token de seed.');

  const { id } = await validateRes.json();
  return id;
};

const seedGenresFromApi = async () => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}genre/movie/list?language=pt-BR`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    const data = await response.json();
    await Genre.insertMany(
      data.genres.map((genre) => ({ name: genre.name, tmdbId: genre.id }))
    );
  } catch (error) {
    console.error('[resource-service] Erro ao salvar generos:', error);
  }
};

const fetchMoviePage = async (page, userId) => {
  const response = await fetch(
    `${process.env.API_BASE_URL}discover/movie?include_adult=false&include_video=false&language=pt-BR&page=${page}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Falha ao buscar a pagina ${page}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results.map(({ adult, id, video, ...rest }) => ({
    ...rest,
    created_by: userId,
  }));
};

const convertMovieDataCasing = (data) => {
  return data.map(
    ({
      backdrop_path,
      original_language,
      original_title,
      poster_path,
      release_date,
      vote_average,
      vote_count,
      genre_ids,
      ...rest
    }) => ({
      backdropPath: backdrop_path,
      originalLanguage: original_language,
      originalTitle: original_title,
      posterPath: poster_path,
      releaseDate: release_date,
      voteAverage: vote_average,
      voteCount: vote_count,
      genreIds: genre_ids,
      ...rest,
    })
  );
};

const processBatch = async (startPage, endPage, userId) => {
  const promises = [];
  for (let i = startPage; i <= endPage; i++) {
    promises.push(fetchMoviePage(i, userId));
  }

  const results = await Promise.all(promises);
  const flatMovies = results.flat();
  // const convertedMovies = convertMovieDataCasing(flatMovies);
  // console.log(flatMovies);
  await Movie.insertMany(flatMovies, { ordered: false });
};

const run = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('[resource-service] Erro ao conectar no banco:', error);
    process.exit(1);
  }

  try {
    const userId = await getUserId();
    await seedGenresFromApi();
    console.log('[resource-service] Terminei generos');

    const batchPromises = [];

    for (let i = 1; i <= TOTAL_PAGES; i += BATCH_SIZE) {
      const startPage = i;
      const endPage = Math.min(i + BATCH_SIZE - 1, TOTAL_PAGES);

      const batchPromise = processBatch(startPage, endPage, userId).then(() => {
        console.log(
          `[resource-service] Terminei paginas ${startPage} ate ${endPage}`
        );
      });

      batchPromises.push(batchPromise);
    }

    await Promise.all(batchPromises);

    console.log('[resource-service] Seed concluído');
    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[resource-service] Erro ao salvar filmes:', error);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

await run();
