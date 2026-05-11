import { createContext, useState } from 'react';
import { buscarFavoritos, toggleFavorite } from '@/utils/tmdbUtils';

export const FavoritadosContext = createContext();

export const FavoritadosProvider = ({ children }) => {
  const [favoritados, setFavoritados] = useState(buscarFavoritos);
  const handleFavorite = (filme) => {
    const isFav = toggleFavorite(filme);
    if (isFav) {
      setFavoritados([...favoritados, filme]);
    } else {
      setFavoritados(favoritados.filter((f) => f.id !== filme.id));
    }

    return isFav;
  };

  return (
    <FavoritadosContext.Provider
      value={{ favoritados, setFavoritados, handleFavorite }}
    >
      {children}
    </FavoritadosContext.Provider>
  );
};
