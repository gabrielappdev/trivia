import { getEndpoint } from "@constants/index";
import { formatContests } from "@helpers/formatContests";
import axiosClient from "@services/api";
import { user as userAtom } from "@atoms/user";
import { contest as contestAtom } from "@atoms/contest";
import { contestPlay as contestPlayAtom } from "@atoms/contestPlay";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LocalStorage } from "@services/localStorage";
import { useToast } from "@chakra-ui/react";
import PlayLayout from "@layouts/play";
import { ContestProps } from "@localTypes/contest";

type ContestPageProps = {
  data: ContestProps;
};

const localStorage = new LocalStorage();

const ContestPage = ({ data }: ContestPageProps) => {
  const [user] = useRecoilState(userAtom);
  const [_, setContest] = useRecoilState(contestAtom);
  const [contestPlay, setContestPlay] = useRecoilState(contestPlayAtom);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    setContest(data);
  }, [data]);

  useEffect(() => {
    const fetchContestPlay = async (userId) => {
      setIsLoading(true);
      try {
        const { data: contestPlayData } = await axiosClient(
          getEndpoint("contestPlay", data.id)
        );
        setContestPlay(contestPlayData);
      } catch (error) {
        //
      } finally {
        setIsLoading(false);
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

  return <PlayLayout>{contestPlay?.id}</PlayLayout>;
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
