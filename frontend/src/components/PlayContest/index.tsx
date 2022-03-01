import { Box, Button, Heading, Stack, Text, theme } from "@chakra-ui/react";
import { ContestProps } from "@localTypes/contest";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import QuestionBox from "./QuestionBox";

type PlayContestProps = {
  contest: ContestProps;
};

type FormAnswerProps = {
  questions: string;
};

const PlayContest = ({ contest }: PlayContestProps) => {
  const questions = contest.questions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState(
    questions[currentQuestionIndex]
  );

  const methods = useForm<FormAnswerProps>({
    defaultValues: {
      questions: "",
    },
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: FormAnswerProps) => {
    const { setError, setValue } = methods;
    if (!data.questions) {
      setError("questions", { type: "focus" }, { shouldFocus: true });
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestion(questions[currentQuestionIndex + 1]);
        setCurrentQuestionIndex((prevState) => prevState + 1);
        setValue("questions", null);
      }
    }
  };

  const onChange = (value: string) => {
    const { setValue, clearErrors } = methods;
    if (value) {
      clearErrors("questions");
    }
    setValue("questions", value);
  };

  return (
    <Box
      shadow="md"
      _hover={{ shadow: "lg" }}
      borderRadius={8}
      p={6}
      minH="50vh"
      w="100%"
      bg="white"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <QuestionBox
            index={currentQuestionIndex}
            onChange={onChange}
            question={currentQuestion}
          />
          <Button
            type="submit"
            h="60px"
            colorScheme="purple"
            w="100%"
            size="lg"
            sx={{ color: theme.colors.yellow[300], fontSize: "1.2rem" }}
            mt={4}
          >
            Answer
          </Button>
        </form>
      </FormProvider>
    </Box>
  );
};

export default PlayContest;
