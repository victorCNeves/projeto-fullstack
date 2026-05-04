import { createContext, useState } from "react";

export const PaginaAtualContext = createContext();

export const PaginaAtualProvider = ({children}) => {
  const [paginaAtual, setPaginaAtual] = useState('home');

  const paginaHandler = (e, target) => {
    e.preventDefault();
    setPaginaAtual(target);
  }

  return (
    <PaginaAtualContext.Provider value={{paginaAtual, paginaHandler}}>
      {children}
    </PaginaAtualContext.Provider>
  );
}