import { getEndpoint, getRoute } from "@constants/index";
import axiosClient from "@services/api";
import { user as userAtom } from "@atoms/user";
import { contest as contestAtom } from "@atoms/contest";
import { contestPlay as contestPlayAtom } from "@atoms/contestPlay";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LocalStorage } from "@services/localStorage";
import { useToast } from "@chakra-ui/react";
import PlayLayout from "@layouts/play";
import { ContestProps } from "@localTypes/contest";
import PlayContest from "@components/PlayContest";
import { useSWRConfig } from "swr";

type ContestPageProps = {
  data: ContestProps;
};

const localStorage = new LocalStorage();

const ContestPage = ({ data }: ContestPageProps) => {
  const [user] = useRecoilState(userAtom);
  const [, setContest] = useRecoilState(contestAtom);
  const [, setContestPlay] = useRecoilState(contestPlayAtom);
  const router = useRouter();
  const toast = useToast();

  const { mutate } = useSWRConfig();

  useEffect(() => {
    setContest(data);
    mutate(getRoute("activeContests"));
  }, [data]);

  useEffect(() => {
    const fetchContestPlay = async (userId) => {
      try {
        const { data: contestPlayData } = await axiosClient(
          getEndpoint("contestPlay", data.id)
        );
        setContestPlay(contestPlayData);
      } catch (error) {
        //
      }
    };
    const userToken = localStorage.getData("_trivia")?.user?.jwt;
    if (!userToken) {
      toast({
        title: `You must be signed to access this page`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    } else if (userToken && user?.id) {
      fetchContestPlay(user.id);
    }
  }, [user, data]);

  return (
    <PlayLayout>
      <PlayContest contest={data} />
    </PlayLayout>
  );
};

export async function getServerSideProps({ params: { slug } }) {
  const { data } = await axiosClient(getEndpoint("contest", slug));

  return {
    props: {
      data: {
        ...data,
        category: data.category.title,
      },
    },
  };
}

export default ContestPage;
