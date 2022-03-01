import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import Countdown from "@components/Countdown";
import { getRoute } from "@constants/index";
import { ContestResultProps } from "@localTypes/result";
import Link from "next/link";
import CountUp from "react-countup";
import { contest as contestAtom } from "@atoms/contest";
import { useRecoilState } from "recoil";
import CoinIcon from "@icons/Coin";
import { useMemo } from "react";

type ContestResultComponentProps = {
  data: ContestResultProps;
};

const ContestResult = ({ data }: ContestResultComponentProps) => {
  const countUp = data.ratio * 100;
  const [contest] = useRecoilState(contestAtom);

  const showIconDate = useMemo(
    () => new Date().setSeconds(new Date().getSeconds() + 3),
    []
  );

  return (
    <Box
      shadow="md"
      _hover={{ shadow: "lg" }}
      borderRadius={8}
      p={6}
      minH="50vh"
      w="100%"
      bg="white"
    >
      <Flex justify="center">
        <Stack>
          <HStack>
            <Heading color="purple.700" size="lg">
              You correct answered:
            </Heading>
            <HStack spacing={2}>
              <Heading color="purple.700" ml={2} size="lg">
                <CountUp start={0} end={countUp} duration={0.5} delay={1} />% of
                total
              </Heading>
            </HStack>
          </HStack>

          <Countdown date={showIconDate}>
            <Stack gap={2} align="center">
              <Image
                src={data.isWinner ? "/assets/win.png" : "/assets/lose.png"}
                w="auto"
                h="300px"
                objectFit="contain"
                alt={data.isWinner ? "Winner" : "Loser"}
              />
              {data.isWinner && (
                <HStack>
                  <Heading size="sm">
                    You`ve won <CoinIcon /> {contest.coins} coins !
                    Congratulations !
                  </Heading>
                </HStack>
              )}
              <Link href={getRoute("home")}>
                <Button colorScheme="blue">Go home</Button>
              </Link>
            </Stack>
          </Countdown>
        </Stack>
      </Flex>
    </Box>
  );
};

export default ContestResult;
