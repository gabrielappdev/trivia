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
  useToast,
} from "@chakra-ui/react";
import { ReactChild, useEffect, useMemo, useState } from "react";
import { user as userAtom } from "@atoms/user";
import { contest as contestAtom } from "@atoms/contest";
import { timer as timerAtom } from "@atoms/timer";
import { question as questionAtom } from "@atoms/question";
import { contestPlay as contestPlayAtom } from "@atoms/contestPlay";
import { contestFinish as contestFinishAtom } from "@atoms/contestFinish";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { getEndpoint, getRoute } from "@constants/index";
import axiosClient from "@services/api";
import { LocalStorage } from "@services/localStorage";
import DifficultyTag from "@components/ContestCard/Tags/Difficulty";
import CoinIcon from "@icons/Coin";
import Countdown from "@components/Countdown";
import { useRouter } from "next/router";
import { useBeforeunload } from "react-beforeunload";

type PlayTemplateProps = {
  children: ReactChild;
};

const localStorage = new LocalStorage();

const questionDifficultyTimer = {
  easy: 30,
  medium: 20,
  hard: 15,
};

const PlayTemplate = ({ children }: PlayTemplateProps) => {
  const toast = useToast();
  const router = useRouter();

  const [user, setUser] = useRecoilState(userAtom);
  const [contestPlay, setContestPlay] = useRecoilState(contestPlayAtom);
  const [contestFinish, setContestFinish] = useRecoilState(contestFinishAtom);
  const [shouldStart, setShouldStart] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [contest] = useRecoilState(contestAtom);
  const [timer, setTimer] = useRecoilState(timerAtom);
  const [question] = useRecoilState(questionAtom);
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
    const loses = localStorage.getData("_trivia")?.[contest.id]?.loses ?? [];
    const finishes =
      localStorage.getData("_trivia")?.[contest.id]?.finishes ?? [];
    if (loses.includes(contest.id)) {
      handlePlayerLost(false);
      localStorage.setData("_trivia", {
        [contest.id]: {
          loses: loses.filter((id) => id !== contest.id),
        },
      });
    }
    if (finishes.includes(contest.id)) {
      localStorage.setData("_trivia", {
        [contest.id]: {
          finishes: finishes.filter((id) => id !== contest.id),
        },
      });
      handlePlayerLost(true);
    }
  }, [contest, router]);

  useEffect(() => {
    const fetchContestPlay = async () => {
      try {
        const { data: contestPlayData } = await axiosClient(
          getEndpoint("contestPlay", contest.id)
        );
        setContestPlay(contestPlayData);
      } catch (error) {
        //
      }
    };
    const userToken = localStorage.getData("_trivia")?.user?.jwt;
    if (!userToken) {
      toast({
        title: `You must be signed to access this page`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    } else if (userToken && user?.id && contest?.id) {
      fetchContestPlay();
    }
  }, [user, contest]);

  useEffect(() => {
    if (data?.id) {
      setUser(data);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      setTimer(null);
      setShouldStart(false);
      setIsLoadingUser(false);
      setContestFinish(false);
    };
  }, []);

  useEffect(() => {
    if (!timer && shouldStart && contest?.id) {
      const date = new Date();
      setTimer(
        date.setSeconds(
          date.getSeconds() + questionDifficultyTimer[contest.difficulty]
        )
      );
    }
  }, [timer, shouldStart, contest]);

  useBeforeunload(() => {
    if (!contestFinish) {
      let currentLoses =
        localStorage.getData("_trivia")?.[contest.id]?.loses ?? [];
      localStorage.setData("_trivia", {
        [contest.id]: {
          loses: [...currentLoses, contest.id],
        },
      });
    } else {
      let currentFinishes =
        localStorage.getData("_trivia")?.[contest.id]?.finish ?? [];
      localStorage.setData("_trivia", {
        [contest.id]: {
          finishes: [...currentFinishes, contest.id],
        },
      });
    }
  });

  const handleStart = () => {
    setShouldStart(true);
    setStartDate(null);

    localStorage.setData(`_trivia`, {
      [contest.id]: {
        answers: [],
      },
    });
  };

  useEffect(() => {
    if (!shouldStart && contestPlay) {
      const { step } = contestPlay;
      if ((!step || step === 0) && !startDate) {
        const date = new Date();
        setStartDate(date.setSeconds(date.getSeconds() + 3));
      } else if (step && step > 0) {
        setTimer(null);
        handleStart();
      }
    }
  }, [contestPlay, startDate, shouldStart]);

  const handlePlayerLost = async (wasFinished = false) => {
    if (question.requestWasSent) {
      return;
    }
    if (wasFinished) {
      toast({
        title: `You must pay again to play this contest`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: `Timeout`,
        description: "You`ve lost!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    const response = await axiosClient.post(getEndpoint("onLost"), {
      data: {
        contestId: contest.id,
      },
    });
    if (response.status === 200) {
      router.push("/");
    }
  };

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
      <Flex justify="space-between" align="center">
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
        {timer && shouldStart && !contestFinish && (
          <Box>
            <Countdown
              size="md"
              date={timer}
              onComplete={() => handlePlayerLost(false)}
            />
          </Box>
        )}
      </Flex>
    );
  };

  const getContent = () => {
    if (startDate) {
      return (
        <Countdown
          date={startDate}
          size="xl"
          onComplete={handleStart}
          RenderComponent={Heading}
        />
      );
    }
    if (shouldStart) {
      return children;
    }
    return null;
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
        maxW="container.lg"
        centerContent
        justifyContent="center"
        minH="inherit"
      >
        {getContent()}
      </Container>
    </Box>
  );
};

export default PlayTemplate;
