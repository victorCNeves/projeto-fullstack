import PaginaAtualContext from "@/contexts/PaginaAtualContext";
import Header from "./Header";
import Main from './Main'
import { useState } from "react";

function App() {
  const [paginaAtual, setPaginaAtual] = useState('home')

  return (
    <PaginaAtualContext.Provider value={{paginaAtual, setPaginaAtual}}>
      <Header />
      <Main />
    </PaginaAtualContext.Provider>
  )
}

export default App
