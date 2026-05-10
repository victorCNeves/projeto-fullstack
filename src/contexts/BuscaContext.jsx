import { createContext, useState } from 'react';

export const BuscaContext = createContext();

export const BuscaProvider = ({ children }) => {
  const [params, setParams] = useState({
    pagina: 1,
    busca: '',
    generoId: '',
    dataInicio: '',
    dataFim: '',
  });

  return (
    <BuscaContext.Provider value={{ params, setParams }}>
      {children}
    </BuscaContext.Provider>
  );
};
