import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import ContestCard from "@components/ContestCard";
import Section from "@components/Section";
import { getEndpoint } from "@constants/index";
import { formatContests } from "@helpers/formatContests";
import axiosClient from "@services/api";
import MainTemplate from "../layouts/main";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const [page, setPage] = useState(1);
  const previousResultsRef = useRef([]);
  const [contests, setContests] = useState([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const { data, error } = useSWR(
    getEndpoint("activeContests", page),
    async (url) => {
      const { data } = await axiosClient(url);
      const {
        meta: {
          pagination: { page, pageCount },
        },
      } = data;

      setIsLastPage(page === pageCount);

      return formatContests(data);
    },
    { refreshInterval: 60000 * 30 }
  );

  useEffect(() => {
    if (data) {
      if (page === 1 && previousResultsRef.current.length) {
        previousResultsRef.current = [];
      }
      const { current: previousResults } = previousResultsRef;
      previousResultsRef.current = [...previousResults, ...data];
      setContests(previousResultsRef.current);
    }
  }, [data, page]);

  useEffect(() => {
    return () => {
      setContests([]);
      setPage(1);
      setIsLastPage(false);
      previousResultsRef.current = [];
    };
  }, []);

  if (error) return <div>failed to load</div>;
  if (!data && page === 1) {
    return (
      <MainTemplate>
        <Box py="100px">
          <Stack py={4}>
            <SimpleGrid gap={4} columns={{ sm: 1, md: 3, lg: 4 }} mb={4}>
              {Array.from(new Array(12)).map((_, index) => (
                <Skeleton w="100%" h="227px" key={index} />
              ))}
            </SimpleGrid>
            <Skeleton h="40px" w="`100%" />
          </Stack>
        </Box>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <Section
        title="Active contests"
        subtitle="Here you`ll find all active contests at the moment"
      >
        <>
          {!contests?.length ? (
            <Heading color="white">No active contests found!</Heading>
          ) : (
            <Stack py={4} gap={4}>
              <SimpleGrid gap={4} columns={{ sm: 1, md: 3, lg: 4 }}>
                {contests.map((contest) => (
                  <ContestCard key={contest.id} {...contest} />
                ))}
              </SimpleGrid>
              <Button
                colorScheme="purple"
                loadingText="Loading more"
                isLoading={!data}
                isDisabled={isLastPage}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                {isLastPage ? "There`s more contests to fetch" : "Load More"}
              </Button>
            </Stack>
          )}
        </>
      </Section>
    </MainTemplate>
  );
};

export default Index;
