import { getEndpoint, getRoute } from "@constants/index";
import axiosClient from "@services/api";
import { contest as contestAtom } from "@atoms/contest";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import PlayLayout from "@layouts/play";
import PlayContest from "@components/PlayContest";
import useSWR, { useSWRConfig } from "swr";
import ContestResult from "@components/ContestResult";
import { ContestResultProps } from "@localTypes/result";
import {
  Box,
  CircularProgress,
  Container,
  Skeleton,
  theme,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { contestFinish as contestFinishAtom } from "@atoms/contestFinish";

type ContestPageProps = {
  slug: string;
};

const ContestPage = ({ slug }: ContestPageProps) => {
  const router = useRouter();
  const [, setContest] = useRecoilState(contestAtom);
  const [result, setResult] = useState(null);

  const [, setContestFinish] = useRecoilState(contestFinishAtom);

  const { mutate } = useSWRConfig();

  const { data, error } = useSWR(
    getEndpoint("contest", slug),
    async (url) => {
      const { data } = await axiosClient(url);
      return {
        ...data,
        category: data.category,
      };
    },
    { refreshInterval: 20000 }
  );

  useEffect(() => {
    if (data) {
      setContest(data);
    }
    mutate(getRoute("activeContests"));
  }, [data]);

  if (error) {
    router.push("/");
  }

  if (!data) {
    return (
      <Box backgroundColor={`rgba(85, 60, 154, 0.92)`} w="100%" minH="100vh">
        <Box
          w="inherit"
          position="fixed"
          p={4}
          borderBottom={`1px solid ${theme.colors.yellow[400]}`}
        >
          <Skeleton w="400px" h="40px" />
        </Box>
        <Container
          maxW="container.lg"
          centerContent
          justifyContent="center"
          minH="inherit"
        >
          <CircularProgress isIndeterminate />
        </Container>
      </Box>
    );
  }

  const onFinish = (data: ContestResultProps) => {
    setResult(data);
    setContestFinish(true);
  };

  const getContentPlayBody = () => {
    if (result) {
      return <ContestResult data={result} />;
    }
    return <PlayContest onFinish={onFinish} contest={data} />;
  };

  return <PlayLayout>{getContentPlayBody()}</PlayLayout>;
};

export async function getServerSideProps({ params: { slug } }) {
  return {
    props: {
      slug,
    },
  };
}

export default ContestPage;
