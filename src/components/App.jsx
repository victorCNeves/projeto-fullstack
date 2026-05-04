import { PaginaAtualProvider } from "@/contexts/PaginaAtualContext";
import Header from "./Header";
import Main from './Main'
import { useState } from "react";

function App() {
  const [paginaAtual, setPaginaAtual] = useState('home')

  return (
    <PaginaAtualProvider value={{paginaAtual, setPaginaAtual}}>
      <Header />
      <Main />
    </PaginaAtualProvider>
  )
}

export default App