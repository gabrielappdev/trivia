import {
  Box,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  theme,
  VStack,
} from "@chakra-ui/react";
import { QuestionProps } from "@localTypes/question";
import { ReactChild } from "react";
import { useFormContext } from "react-hook-form";

type QuestionBoxProps = {
  question: QuestionProps;
  value: string;
  setValue: (value) => void;
  index: number;
};

type AnswerBodyProps = {
  AnswerComponent: ReactChild;
};

const AnswerBody = ({ AnswerComponent }: AnswerBodyProps) => {
  const {
    formState: { errors },
  } = useFormContext();
  return (
    <Box
      borderRadius="50px"
      p={4}
      border={
        !!errors?.questions
          ? `2px solid ${theme.colors.red[500]}`
          : `2px solid ${theme.colors.purple[500]}`
      }
      _hover={{ borderColor: theme.colors.purple[300] }}
      transition="border 0.2s"
      justifyContent="space-between"
      alignItems="center"
      w="100%"
    >
      {AnswerComponent}
    </Box>
  );
};

const QuestionBox = ({
  question,
  setValue,
  value,
  index,
}: QuestionBoxProps) => {
  const {
    id,
    title,
    answers: { questions: answerQuestions, type },
  } = question;

  const getAnswers = () => {
    if (type === "multiple") {
      return (
        <RadioGroup
          value={value}
          onChange={setValue}
          name={`question-${index}`}
        >
          <VStack w="100%" spacing={4}>
            {answerQuestions.map((answer, index) => (
              <AnswerBody
                key={index}
                AnswerComponent={
                  <Radio colorScheme="purple" size="lg" value={`${index}`}>
                    <Text
                      w="100%"
                      fontSize="md"
                      fontWeight="bold"
                      color={theme.colors.purple[500]}
                      key={index}
                      dangerouslySetInnerHTML={{ __html: answer }}
                    />
                  </Radio>
                }
              />
            ))}
          </VStack>
        </RadioGroup>
      );
    } else if (type === "boolean") {
      return (
        <RadioGroup onChange={setValue} name="questions">
          <VStack w="100%" spacing={4}>
            {Array.from(new Array(2)).map((_, index) => (
              <AnswerBody
                key={index}
                AnswerComponent={
                  <Radio size="lg" value={index === 0 ? "True" : "False"}>
                    <Text
                      w="100%"
                      fontSize="md"
                      fontWeight="bold"
                      color={theme.colors.purple[500]}
                      key={index}
                    >
                      {index === 0 ? "True" : "False"}
                    </Text>
                  </Radio>
                }
              />
            ))}
          </VStack>
        </RadioGroup>
      );
    }
    return null;
  };

  return (
    <Stack key={id}>
      <Heading
        mb={4}
        size="lg"
        dangerouslySetInnerHTML={{ __html: title }}
        key={id}
        textAlign="center"
      />
      {getAnswers()}
    </Stack>
  );
};

export default QuestionBox;
