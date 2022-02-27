import { Heading, SimpleGrid } from "@chakra-ui/react";
import ContestCard, { ContestCardProps } from "@components/ContestCard";
import Section from "@components/Section";
import { getEndpoint } from "@constants/index";
import { formatContests } from "@helpers/formatContests";
import axiosClient from "@services/api";
import MainTemplate from "../layouts/main";

type IndexProps = {
  activeContests: ContestCardProps[];
};

const Index = ({ activeContests }: IndexProps) => {
  return (
    <MainTemplate>
      <Section
        title="Active contests"
        subtitle="Here you`ll find all active contests at the moment"
      >
        <>
          {!activeContests?.length ? (
            <Heading>No active contests found!</Heading>
          ) : (
            <SimpleGrid gap={4} columns={{ sm: 1, md: 4 }}>
              {activeContests.map((contest) => (
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
