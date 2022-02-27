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
import { getRoute } from "@constants/index";
import Link from "next/link";
import DifficultyTag from "./Tags/Difficulty";
import ActiveTag from "./Tags/Active";
import Countdown from "@components/Countdown";
import { user as userAtom } from "@atoms/user";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import Dialog from "@components/Dialog";

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
};

type PlayButtonProps = {
  onClick?: () => void;
  isDisabled?: boolean;
};

const ContestCard = ({
  title,
  description,
  prizePool,
  expiration_date: expirationDate,
  difficulty,
  active,
  cost,
  slug,
  category,
}: ContestCardProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [user] = useRecoilState(userAtom);

  const toast = useToast();
  const router = useRouter();

  const PlayButton = ({ onClick, isDisabled }: PlayButtonProps) => {
    return (
      <Button
        cursor="pointer"
        colorScheme="yellow"
        size="md"
        leftIcon={<CoinIcon />}
        onClick={onClick ? onClick : () => ({})}
        isDisabled={isDisabled}
      >
        Play
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
    if (user?.id) {
      return <PlayButton isDisabled={user.coins - cost < 0} onClick={onOpen} />;
    } else {
      return <PlayButton onClick={handleUnsignewdUserClick} />;
    }
  };

  const onContinue = () => {
    router.push(getRoute("contests", slug));
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
        onClose={onClose}
        footer={
          <Button colorScheme="green" onClick={onContinue}>
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
        <Stack minH="180px">
          <VStack align="flex-start" w="100%" p={4} pb={0} spacing={2}>
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
            px={4}
            py={2}
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
        <HStack px={4} py={1} align="center" justify="space-between">
          <HStack spacing={2}>
            <HStack spacing={2} data-testid="cost">
              <CoinIcon />
              <Text fontSize="sm">Cost: {cost}</Text>
            </HStack>
            <HStack spacing={2} data-testid="pool">
              <CoinIcon />
              <Text fontSize="sm">Pool: {prizePool}</Text>
            </HStack>
          </HStack>
          <Countdown size="xs" prefix="ends in:" date={expirationDate}>
            closed
          </Countdown>
        </HStack>
      </Box>
    </Box>
  );
};

export default ContestCard;
