import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Text,
  theme,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import CoinIcon from "@icons/Coin";
import { getRoute } from "@constants/index";
import Link from "next/link";
import DifficultyTag from "./Tags/Difficulty";
import ActiveTag from "./Tags/Active";
import Countdown from "@components/Countdown";

type ContestCardProps = {
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

const ContestCard = ({
  title,
  description,
  prizePool,
  expiration_date: expirationDate,
  slug,
  difficulty,
  active,
  cost,
  category,
}: ContestCardProps) => {
  return (
    <Box
      data-testid="contest-card-wrapper"
      pointerEvents={active ? "auto" : "none"}
      cursor={active ? "default" : "not-allowed"}
    >
      <Box
        bg="white"
        shadow="md"
        borderRadius={4}
        border={`1px solid ${theme.colors.purple[900]}`}
        maxW="300px"
        filter={!active ? "grayscale(1)" : "none"}
        data-testid="contest-card-body"
      >
        <VStack align="flex-start" w="100%" p={4} pb={0} spacing={2}>
          <Tooltip label={title}>
            <Heading isTruncated textAlign="left" as="h4" size="sm">
              {title}
            </Heading>
          </Tooltip>
          <Text fontSize="sm" aria-label="Contest description">
            {description}
          </Text>
          <Text fontSize="sm" aria-label="Contest category">
            <b>Category:</b> {category}
          </Text>
        </VStack>
        <HStack px={4} py={2} align="center" justify="space-between">
          <HStack spacing={2}>
            <DifficultyTag difficulty={difficulty} />
            <ActiveTag status={active ? "active" : "inactive"} />
          </HStack>
          <Link href={getRoute("contests", slug)}>
            <div>
              <Countdown date={expirationDate}>
                <Button
                  cursor="pointer"
                  colorScheme="yellow"
                  size="md"
                  leftIcon={<CoinIcon />}
                  onClick={() => console.log("clicked")}
                >
                  Play
                </Button>
              </Countdown>
            </div>
          </Link>
        </HStack>
        <Divider colorScheme="yellow" />
        <HStack px={4} py={2} align="center" justify="space-between">
          <HStack spacing={2} data-testid="cost">
            <CoinIcon />
            <Text fontSize="sm">Cost: {cost}</Text>
          </HStack>
          <HStack spacing={2} data-testid="pool">
            <CoinIcon />
            <Text fontSize="sm">Pool: {prizePool}</Text>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default ContestCard;
