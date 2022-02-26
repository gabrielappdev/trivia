import ContestCard from "@components/ContestCard";
import Section from "@components/Section";
import MainTemplate from "../layouts/main";

const mock = {
  title: "Contest #1 - Animals",
  description: "Easy contest with entrance cost of 37 coins",
  prizePool: 0,
  active: true,
  expiration_date: "2022-01-25T00:13:32.362Z",
  slug: "contest-1-animals",
  cost: 37,
  difficulty: "easy",
  category: "animals",
};

const Index = () => {
  return (
    <MainTemplate>
      <Section
        title="Active contests"
        subtitle="Here you`ll find all active contests at the moment"
      >
        <ContestCard {...mock} />
      </Section>
    </MainTemplate>
  );
};

export default Index;
