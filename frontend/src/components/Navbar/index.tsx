import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  theme,
} from "@chakra-ui/react";
import { getEndpoint, getRoute } from "@constants/index";
import Link from "next/link";
import { user as userAtom } from "@atoms/user";
import { useRecoilState } from "recoil";
import CoinIcon from "@icons/Coin";
import { useEffect, useState } from "react";
import { LocalStorage } from "@services/localStorage";
import axiosClient from "@services/api";

const localStorage = new LocalStorage();

const getAvatarName = (email: string) => {
  const initials = email.slice(0, 2).toUpperCase();
  return `${initials.charAt(0)} ${initials.charAt(1)}`;
};

const Navbar = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  useEffect(() => {
    const fetchMe = async (token: string) => {
      setIsLoadingUser(true);
      try {
        const { data } = await axiosClient(getEndpoint("me"));
        setUser({ ...data, jwt: token });
      } catch (error) {
        //
      } finally {
        setIsLoadingUser(false);
      }
    };
    const token = localStorage.getData("_trivia")?.user?.jwt;
    if (token && !user?.email) {
      fetchMe(token);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeData("_trivia");
    setUser(null);
  };

  const getRightAdorment = () => {
    if (isLoadingUser) {
      return <CircularProgress color="purple.300" isIndeterminate />;
    }
    if (user?.email) {
      return (
        <Box
          p={2}
          border={`1px solid ${theme.colors.purple[400]}`}
          borderRadius={4}
        >
          <HStack align="center" spacing={4}>
            <HStack spacing={2}>
              <CoinIcon />
              <Text color="white">{user?.coins}</Text>
            </HStack>
            <Menu>
              <MenuButton
                as={Avatar}
                aria-label="User menu"
                size="sm"
                name={getAvatarName(user.email)}
                cursor="pointer"
                pl={2}
              />
              <MenuList>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Box>
      );
    } else {
      return (
        <HStack spacing={2}>
          <Link href={getRoute("signup")}>
            <Button colorScheme="yellow">Join now</Button>
          </Link>
          <Link href={getRoute("signin")}>
            <Button colorScheme="blue">Enter</Button>
          </Link>
        </HStack>
      );
    }
  };

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
      <Link href="/">
        <Image
          src="/assets/logo.png"
          alt="Trivia logo"
          objectFit="contain"
          h="auto"
          w="160px"
          cursor="pointer"
        />
      </Link>
      {getRightAdorment()}
    </HStack>
  );
};

export default Navbar;
