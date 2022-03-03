import {
  Box,
  Button,
  HStack,
  Progress,
  Stack,
  Text,
  theme,
  useMediaQuery,
} from "@chakra-ui/react";
import { ContestProps } from "@localTypes/contest";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { question as questionAtom } from "@atoms/question";
import { timer as timerAtom } from "@atoms/timer";
import { user as userAtom } from "@atoms/user";
import { contestPlay as contestPlayAtom } from "@atoms/contestPlay";
import QuestionBox from "./QuestionBox";
import axiosClient from "@services/api";
import { getEndpoint } from "@constants/index";
import { LocalStorage } from "@services/localStorage";
import { ContestResultProps } from "@localTypes/result";

type PlayContestProps = {
  contest: ContestProps;
  onFinish: (data: ContestResultProps) => void;
};

type FormAnswerProps = {
  questions: { answer: string };
};

const localStorage = new LocalStorage();

const PlayContest = ({ contest, onFinish }: PlayContestProps) => {
  const [isMobile] = useMediaQuery("(max-width: 799px)");
  const questions = contest.questions;
  const [contestPlay] = useRecoilState(contestPlayAtom);
  const [user] = useRecoilState(userAtom);
  const [, setQuestion] = useRecoilState(questionAtom);
  const [, setTimer] = useRecoilState(timerAtom);

  const [isSaving, setIsSaving] = useState(false);
  const [answer, setAnswer] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState(
    questions[currentQuestionIndex]
  );

  const methods = useForm<FormAnswerProps>({
    defaultValues: {
      questions: { answer: "" },
    },
  });

  useEffect(() => {
    return () => {
      setIsSaving(false);
      setCurrentQuestion(null);
      setCurrentQuestionIndex(0);
    };
  }, []);

  const registerQuestionAnswer = () => {
    let currentAnswers = [];
    const storedAnswers = localStorage.getData(`_trivia`);
    if (storedAnswers?.[contest.id]?.answers) {
      currentAnswers = storedAnswers[contest.id].answers;
    }
    let sendAnswer = "";
    if (questions[currentQuestionIndex].answers.type === "multiple") {
      sendAnswer =
        questions[currentQuestionIndex].answers.questions[Number(answer)];
    } else {
      sendAnswer = answer;
    }
    localStorage.setData(`_trivia`, {
      [contest.id]: { answers: [...currentAnswers, sendAnswer] },
    });
  };

  const onSubmit = async () => {
    const { setError, clearErrors } = methods;
    if (!answer) {
      setError("questions", { type: "focus" }, { shouldFocus: true });
    } else {
      clearErrors("questions");
      setIsSaving(true);
      setQuestion({ requestWasSent: true });
      try {
        const response = await axiosClient.put(
          getEndpoint("contestPlayPut", contestPlay.id),
          {
            data: {
              step: currentQuestionIndex + 1,
            },
          }
        );
        if (response.status === 200) {
          if (currentQuestionIndex < questions.length - 1) {
            registerQuestionAnswer();
            setCurrentQuestion(questions[currentQuestionIndex + 1]);
            setCurrentQuestionIndex((prevState) => prevState + 1);
            setTimer(null);

            setAnswer(null);
          } else {
            registerQuestionAnswer();
            const allAnswers =
              localStorage.getData("_trivia")?.[contest.id].answers;
            const { data } = await axiosClient.post(
              getEndpoint("checkAnswers", contest.id),
              { data: allAnswers }
            );
            onFinish(data);
            localStorage.setData(
              `${user.email}-contest-${contest.id}-answers`,
              { answers: [] }
            );
          }
        }
      } catch (error) {
        //
      } finally {
        setIsSaving(false);
        setQuestion({ requestWasSent: false });
      }
    }
  };

  const onChange = (value: string) => {
    const { clearErrors } = methods;
    setAnswer(value);
    if (value) {
      clearErrors("questions");
    }
  };

  return (
    <Box
      shadow="md"
      _hover={{ shadow: "lg" }}
      borderRadius={8}
      p={6}
      h={isMobile ? "80vh" : "60vh"}
      w="100%"
      bg="white"
    >
      <FormProvider {...methods}>
        <form
          style={{ height: "100%" }}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Stack h="100%" justify="space-between">
            <Progress
              colorScheme="purple"
              borderRadius="50px"
              hasStripe
              value={((currentQuestionIndex + 1) / questions.length) * 100}
            />
            <QuestionBox
              index={currentQuestionIndex}
              setValue={onChange}
              value={answer}
              question={currentQuestion}
            />
            <Button
              type="submit"
              h="60px"
              colorScheme="purple"
              w="100%"
              size="lg"
              sx={{ color: theme.colors.yellow[300], fontSize: "1.2rem" }}
              isLoading={isSaving}
              loadingText="Saving"
            >
              {currentQuestionIndex < questions.length - 1
                ? "Answer"
                : "Send answers"}
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Box>
  );
};

export default PlayContest;
