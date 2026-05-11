import 'swiper/css';
import 'swiper/css/navigation';
import { Box, Heading, Skeleton } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import CardFilme from './CardFilme';
import { useState, useRef, useEffect } from 'react';
import { buscarFilmes } from '@/utils/tmdbUtils';

const CarrosselFilmes = ({ generoId, titulo, filmes }) => {
  const [filmesState, setFilmesState] = useState(filmes);
  const [carregando, setCarregando] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const ref = useRef(null);

  const carregarMaisFilmes = async () => {
    if (carregando) return;
    setCarregando(true);
    const nextPage = filmesState.page + 1;
    const data = await buscarFilmes({ pagina: nextPage, generoId: generoId });
    setFilmesState((filmes) => ({
      ...filmesState,
      results: [
        ...filmesState.results,
        ...data.results.filter(
          (novo) =>
            !filmes.results.some((existente) => existente.id === novo.id)
        ),
      ],
      page: nextPage,
    }));
    setCarregando(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisivel(true);
      },
      { rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box py={4} px={4} bg="black" ref={ref} minH="200px">
      {visivel ? (
        <>
          <Heading size="lg" mb={4} color="white" fontWeight="bold" margin={0}>
            {titulo}
          </Heading>

          <Swiper
            style={{ paddingTop: '10px', paddingBottom: '0' }}
            modules={[Navigation, Mousewheel]}
            spaceBetween={20}
            slidesPerView={1.5}
            navigation
            mousewheel={{ forceToAxis: true }}
            breakpoints={{
              480: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 4.5 },
              1440: { slidesPerView: 5.5 },
            }}
            onReachEnd={carregarMaisFilmes}
          >
            {filmesState.results.map((filme) => (
              <SwiperSlide key={filme.id} style={{ overflow: 'visible' }}>
                <CardFilme filme={filme} />
              </SwiperSlide>
            ))}
            {carregando && (
              <SwiperSlide>
                <Skeleton height="600px" borderRadius="md" />
              </SwiperSlide>
            )}
          </Swiper>
        </>
      ) : (
        <Skeleton height="600px" p={4} />
      )}
    </Box>
  );
};

export default CarrosselFilmes;
