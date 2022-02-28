import { getEndpoint } from "@constants/index";
import { formatContests } from "@helpers/formatContests";
import { ContestProps } from "@types/contest";
import axiosClient from "@services/api";
import { user as userAtom } from "@atoms/user";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LocalStorage } from "@services/localStorage";
import { useToast } from "@chakra-ui/react";

type ContestPageProps = {
  data: ContestProps;
};

const localStorage = new LocalStorage();

const ContestPage = ({ data }: ContestPageProps) => {
  const [user] = useRecoilState(userAtom);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const userToken = localStorage.getData("_trivia")?.user?.jwt;
    if (!userToken) {
      toast({
        title: `You must be signed to access this page`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    } else {
    }
  }, [user]);

  return <div />;
};
export async function getStaticPaths() {
  const { data } = await axiosClient(getEndpoint("activeContests"));
  const contests = formatContests(data);

  const paths = contests?.map(({ slug }) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params: { slug } }) {
  const { data } = await axiosClient(getEndpoint("contest", slug));

  return {
    props: {
      data: {
        ...data,
        category: data.category.title,
      },
      slug,
    },
  };
}

export default ContestPage;
