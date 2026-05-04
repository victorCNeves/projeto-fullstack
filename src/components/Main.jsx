import PaginaAtualContext from "@/contexts/PaginaAtualContext";
import { useContext, useState } from "react";

const Main = () => {
  const {paginaAtual} = useContext(PaginaAtualContext);
  
  return(
    <>
      {paginaAtual==='home' && <p>home</p>}
      {paginaAtual==='menu' && <p>menu</p>}
      {paginaAtual==='teste' && <p>teste</p>}
    </>
  );  
}

export default Main;