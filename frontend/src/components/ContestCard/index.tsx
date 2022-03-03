import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Stack,
  Tag,
  Text,
  theme,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import CoinIcon from "@icons/Coin";
import { getEndpoint, getRoute } from "@constants/index";
import Link from "next/link";
import DifficultyTag from "./Tags/Difficulty";
import ActiveTag from "./Tags/Active";
import Countdown from "@components/Countdown";
import { user as userAtom } from "@atoms/user";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import Dialog from "@components/Dialog";
import axiosClient from "@services/api";
import { useMemo, useState } from "react";
import { useSWRConfig } from "swr";

export type ContestCardProps = {
  id: number;
  title: string;
  description: string;
  prizePool: number;
  expiration_date: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";
  active: boolean;
  cost: number;
  category: string;
  users: number[];
  isTesting?: boolean;
};

type PlayButtonProps = {
  onClick?: () => void;
  isDisabled?: boolean;
};

const ContestCard = ({
  id,
  title,
  description,
  prizePool,
  expiration_date: expirationDate,
  difficulty,
  active,
  cost,
  slug,
  category,
  isTesting = false,
}: ContestCardProps) => {
  const { mutate } = useSWRConfig();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [user] = useRecoilState(userAtom);

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const router = useRouter();

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const PlayButton = ({ onClick, isDisabled }: PlayButtonProps) => {
    return (
      <Button
        cursor="pointer"
        colorScheme="purple"
        borderBottom={`4px solid ${theme.colors.yellow[900]}`}
        borderX={`1px solid ${theme.colors.yellow[600]}`}
        size="md"
        rightIcon={
          <Box py={2}>
            <CoinIcon />
          </Box>
        }
        onClick={onClick ? onClick : () => ({})}
        isDisabled={isDisabled}
        _hover={{
          border: `1px solid ${theme.colors.yellow[600]}`,
        }}
        transition="border 0.1s ease-in-out"
      >
        {cost}
      </Button>
    );
  };

  const ProtectedPlayButton = () => {
    const handleUnsignewdUserClick = () => {
      toast({
        title: `You must be signed to attend this contest`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      router.push(getRoute("signin"));
    };
    if (user?.id || isTesting) {
      const isDisabled = isTesting ? false : user.coins - cost < 0;
      return <PlayButton isDisabled={isDisabled} onClick={onOpen} />;
    } else {
      return <PlayButton onClick={handleUnsignewdUserClick} />;
    }
  };

  const onContinue = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosClient.post(
        getEndpoint("registerContestant"),
        { id }
      );
      if (data?.error) {
        toast({
          title: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        mutate(getRoute("activeContests"));
        router.push(getRoute("contests", slug));
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.error?.message ?? error?.response?.data?.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      data-testid="contest-card-wrapper"
      pointerEvents={active ? "auto" : "none"}
      cursor={active ? "default" : "not-allowed"}
    >
      <Dialog
        header="Are you sure ?"
        body={`Are you sure that you want to play this contest ? You'll have ${
          user?.coins - cost
        } coins if you accepts.`}
        isOpen={isOpen}
        onClose={handleClose}
        footer={
          <Button
            isLoading={isLoading}
            colorScheme="green"
            onClick={onContinue}
          >
            Yes, continue!
          </Button>
        }
      />
      <Box
        bg="white"
        shadow="md"
        borderRadius={4}
        border={`1px solid ${theme.colors.purple[900]}`}
        maxW="300px"
        filter={!active ? "grayscale(1)" : "none"}
        data-testid="contest-card-body"
      >
        <Stack minH="192px">
          <VStack align="flex-start" w="100%" p={2} pb={0} spacing={2}>
            <Tooltip label={title}>
              <Heading
                maxW="100%"
                isTruncated
                textAlign="left"
                as="h4"
                size="sm"
              >
                {title}
              </Heading>
            </Tooltip>
            <Text fontSize="sm" aria-label="Contest description">
              {description}
            </Text>
            <Text
              maxW="100%"
              isTruncated
              fontSize="sm"
              aria-label="Contest category"
            >
              <b>Category:</b> {category}
            </Text>
          </VStack>
          <HStack
            p={2}
            align="center"
            justify="space-between"
            marginTop="auto!important"
          >
            <HStack spacing={2}>
              <DifficultyTag difficulty={difficulty} />
              <ActiveTag status={active ? "active" : "inactive"} />
            </HStack>
            {active && <ProtectedPlayButton />}
          </HStack>
        </Stack>
        <Divider colorScheme="yellow" />
        <HStack px={2} py={1} align="center" justify="space-between">
          <HStack spacing={2}>
            <HStack spacing={2} data-testid="pool">
              <CoinIcon />
              <Text fontSize="sm">Pool: {prizePool}</Text>
            </HStack>
          </HStack>
          <Countdown size="xs" prefix="" color="black" date={expirationDate}>
            closed
          </Countdown>
        </HStack>
      </Box>
    </Box>
  );
};

export default ContestCard;
