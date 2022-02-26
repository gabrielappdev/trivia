import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { ReactChild } from "react";

type SectionProps = {
  children: ReactChild;
  title: string;
  subtitle?: string;
};

const Section = ({ title, subtitle, children }: SectionProps) => {
  return (
    <Box py={8} as="section">
      <VStack spacing={2}>
        <Heading color="white" as="h2" size="lg">
          {title}
        </Heading>
        {subtitle && (
          <Text color="white" aria-label="Section subtitle">
            {subtitle}
          </Text>
        )}
        {children}
      </VStack>
    </Box>
  );
};

export default Section;
