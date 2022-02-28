import { Box, Heading, SimpleGrid, Skeleton } from "@chakra-ui/react";
import ContestCard, { ContestCardProps } from "@components/ContestCard";
import Section from "@components/Section";
import { getEndpoint } from "@constants/index";
import { formatContests } from "@helpers/formatContests";
import axiosClient from "@services/api";
import MainTemplate from "../layouts/main";
import useSWR from "swr";
import { useEffect, useState } from "react";

type IndexProps = {
  activeContests: ContestCardProps[];
};

const Index = ({ activeContests }: IndexProps) => {
  const [contests, setContests] = useState(activeContests);
  const { data, error } = useSWR(
    getEndpoint("activeContests"),
    async (url) => {
      const { data } = await axiosClient(url);
      return formatContests(data);
    },
    { refreshInterval: 60000 * 30 }
  );
  useEffect(() => {
    setContests(data);
  }, [data?.length]);

  if (error) return <div>failed to load</div>;
  if (!data || !contests)
    return (
      <MainTemplate>
        <Box py="100px">
          <SimpleGrid gap={4} columns={{ sm: 1, md: 3, lg: 4 }}>
            {Array.from(new Array(20)).map((_, index) => (
              <Skeleton w="100%" h="227px" key={index} />
            ))}
          </SimpleGrid>
        </Box>
      </MainTemplate>
    );

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
            <SimpleGrid gap={4} columns={{ sm: 1, md: 3, lg: 4 }}>
              {contests.map((contest) => (
                <ContestCard key={contest.id} {...contest} />
              ))}
            </SimpleGrid>
          )}
        </>
      </Section>
    </MainTemplate>
  );
};

export async function getServerSideProps() {
  const { data } = await axiosClient(getEndpoint("activeContests"));
  const activeContests = formatContests(data);
  return {
    props: {
      activeContests,
    },
  };
}

export default Index;
