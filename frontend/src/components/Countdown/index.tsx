import { Heading, Text, VStack } from "@chakra-ui/react";
import { ReactChild } from "react";
import ReactCountdown from "react-countdown";

type CountdownProps = {
  date: string | number;
  children?: ReactChild;
  prefix?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  onComplete?: () => void;
  RenderComponent?: any;
};

const Countdown = ({
  date,
  children,
  prefix,
  size = "md",
  color = "white",
  onComplete = () => ({}),
}: CountdownProps) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return children ?? null;
    } else {
      const getDate = (hasDays, hasHours, hasMinutes) => {
        seconds = seconds >= 10 ? `${seconds}s` : `0${seconds}` + "s";
        hours = hours >= 10 ? `${hours}h` : `0${hours}` + "h";
        minutes = minutes >= 10 ? `${minutes}m` : `0${minutes}` + "m";
        days = days >= 10 ? `${days}d` : `0${days}` + "d";
        if (hasDays) {
          return (
            <Heading size={size} color={color}>
              {days} {hours} {minutes} {seconds}
            </Heading>
          );
        } else if (hasHours) {
          return (
            <Heading size={size} color={color}>
              {hours} {minutes} {seconds}
            </Heading>
          );
        }
        if (hasMinutes) {
          return (
            <Heading size={size} color={color}>
              {minutes} {seconds}
            </Heading>
          );
        }
        return (
          <Heading size={size} color={color}>
            {seconds}
          </Heading>
        );
      };
      return (
        <VStack spacing={0} align="flex-start">
          {prefix && <Text fontSize={size}>{prefix}</Text>}
          {getDate(days > 0, hours > 0, minutes > 0)}
        </VStack>
      );
    }
  };
  return (
    <ReactCountdown onComplete={onComplete} date={date} renderer={renderer} />
  );
};

export default Countdown;
