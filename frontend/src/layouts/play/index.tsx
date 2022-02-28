import {
  Box,
  Center,
  CircularProgress,
  Container,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Text,
  theme,
} from "@chakra-ui/react";
import { ReactChild, useEffect, useMemo, useState } from "react";
import { user as userAtom } from "@atoms/user";
import { contest as contestAtom } from "@atoms/contest";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { getEndpoint } from "@constants/index";
import axiosClient from "@services/api";
import { LocalStorage } from "@services/localStorage";
import DifficultyTag from "@components/ContestCard/Tags/Difficulty";
import CoinIcon from "@icons/Coin";

type PlayTemplateProps = {
  children: ReactChild;
};

const localStorage = new LocalStorage();

const PlayTemplate = ({ children }: PlayTemplateProps) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [contest] = useRecoilState(contestAtom);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const shouldFetchUser = useMemo(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getData("_trivia")?.user?.jwt;
      if (token) {
        return true;
      }
      return false;
    }
    return false;
  }, [user]);

  const { data } = useSWR(
    shouldFetchUser ? getEndpoint("me") : null,
    async (url) => {
      setIsLoadingUser(true);
      const { data } = await axiosClient(url);
      setIsLoadingUser(false);
      const token = localStorage.getData("_trivia")?.user?.jwt;
      return { ...data, jwt: token };
    },
    { refreshInterval: 60000 * 30 }
  );

  useEffect(() => {
    if (data?.id) {
      setUser(data);
    }
  }, [data]);

  if (!user?.id && isLoadingUser) {
    return (
      <Box
        backgroundColor={`rgba(85, 60, 154, 0.92)`}
        w="100%"
        h="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Center h="inherit">
          <CircularProgress isIndeterminate color="yellow" />
        </Center>
      </Box>
    );
  }

  const getPlayContestHeader = () => {
    if (!contest?.id) {
      return (
        <Flex w="100%" justify="space-between">
          <Skeleton w="200px" h="40px" />;
          <Skeleton w="200px" h="40px" />;
        </Flex>
      );
    }
    return (
      <HStack w="100%" align="center" spacing={2}>
        <Heading size="sm" color="white">
          {contest.title}
        </Heading>
        <DifficultyTag difficulty={contest.difficulty} />
        <HStack spacing={2}>
          <Text fontSize="md" color="white">
            Prize:
          </Text>
          <CoinIcon />
          <Text fontSize="md" color="white">
            {contest.prizePool}
          </Text>
        </HStack>
      </HStack>
    );
  };

  return (
    <Box backgroundColor={`rgba(85, 60, 154, 0.92)`} w="100%" minH="100vh">
      <Box
        w="inherit"
        position="fixed"
        p={4}
        borderBottom={`1px solid ${theme.colors.yellow[400]}`}
      >
        {getPlayContestHeader()}
      </Box>
      <Container
        maxW="container.xl"
        centerContent
        justifyContent="center"
        minH="inherit"
      >
        {children}
      </Container>
    </Box>
  );
};

export default PlayTemplate;
