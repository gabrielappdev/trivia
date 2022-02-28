import { Box } from "@chakra-ui/react";
import { ContestProps } from "@localTypes/contest";

type PlayContestProps = {
  contest: ContestProps;
};

const PlayContest = ({ contest }: PlayContestProps) => {
  return (
    <Box
      shadow="md"
      _hover={{ shadow: "lg" }}
      borderRadius={8}
      p={6}
      minH="70vh"
      w="100%"
      bg="white"
    >
      play
    </Box>
  );
};

export default PlayContest;
