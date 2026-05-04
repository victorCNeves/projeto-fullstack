import PaginaAtualContext from "@/contexts/PaginaAtualContext";
import { Box, List, Link } from "@chakra-ui/react";
import { useContext } from "react";

const Header = () => {
  const {setPaginaAtual} = useContext(PaginaAtualContext);

  const paginaHandler = (e, target) => {
    e.preventDefault();
    setPaginaAtual(target);
  }

  return (
    <Box as='header' padding='15px' bg='teal.900'>
      <List.Root display='flex' flexDirection='row' gap='6' justifyContent='center' listStyle='none'>
        {['Home', 'Menu', 'Sobre', 'Teste'].map((item, index)=>(
          <List.Item key={index}><Link href={item.toLowerCase()!='home'?item.toLowerCase():'/'} onClick={(e)=>paginaHandler(e,item.toLowerCase())}>{item}</Link></List.Item>
        ))}
      </List.Root>
    </Box>
  );
};

export default Header;