import { Box, Container, theme } from "@chakra-ui/react";
import { ReactChild } from "react";
import Navbar from "../../components/Navbar";

type MainProps = {
  children: ReactChild;
};

const Main = ({ children }: MainProps) => {
  return (
    <Box minH="100vh" bg={theme.colors.purple[800]}>
      <Navbar />
      <Container maxW="container.xl">{children}</Container>
    </Box>
  );
};

export default Main;
