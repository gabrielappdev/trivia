import { Box, Container, Image } from "@chakra-ui/react";
import { ReactChild } from "react";

type SignTemplateProps = {
  children: ReactChild;
};

const SignTemplate = ({ children }: SignTemplateProps) => {
  return (
    <Box backgroundColor={`rgba(85, 60, 154, 0.92)`} w="100%" minH="100vh">
      <Image
        src="./assets/sign.png"
        alt="Sign pages background"
        position="absolute"
        w="100%"
        h="100%"
        objectFit="cover"
        top="0"
        left="0"
        zIndex="-1"
      />
      <Container centerContent justifyContent="center" minH="inherit">
        {children}
      </Container>
    </Box>
  );
};

export default SignTemplate;
