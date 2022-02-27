import { Button, HStack, Image, theme } from "@chakra-ui/react";
import { getRoute } from "@constants/index";
import Link from "next/link";

const Navbar = () => {
  return (
    <HStack
      bg={theme.colors.purple[900]}
      px={4}
      py={2}
      align="center"
      w="100%"
      justify="space-between"
      borderBottom={`1px solid ${theme.colors.yellow[400]}`}
    >
      <Image
        src="/assets/logo.png"
        alt="Trivia logo"
        objectFit="contain"
        h="auto"
        w="160px"
      />
      <HStack spacing={2}>
        <Link href={getRoute("signup")}>
          <Button colorScheme="yellow">Join now</Button>
        </Link>
        <Link href={getRoute("signin")}>
          <Button colorScheme="blue">Enter</Button>
        </Link>
      </HStack>
    </HStack>
  );
};

export default Navbar;
