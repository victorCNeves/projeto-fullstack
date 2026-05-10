import 'swiper/css';
import 'swiper/css/navigation';
import { Box, Heading } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import CardFilme from './CardFilme';
import { useState } from 'react';
import { buscarFilmes } from '@/utils/tmdbUtils';

const CarrosselFilmes = ({ generoId, titulo, filmes }) => {
  const [filmesState, setFilmesState] = useState(filmes);

  const carregarMaisFilmes = async () => {
    const nextPage = filmes.page + 1;
    const data = await buscarFilmes({ pagina: nextPage, generoId: generoId });
    setFilmesState({
      results: [...filmesState.results, ...data.results],
      page: nextPage,
    });
  };

  return (
    <Box py={4} px={4} bg="black">
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
      </Swiper>
    </Box>
  );
};

export default CarrosselFilmes;
