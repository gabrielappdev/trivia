import { Text, VStack } from "@chakra-ui/react";
import { ReactChild } from "react";
import ReactCountdown from "react-countdown";

type Countdown = {
  date: string;
  children: ReactChild;
  prefix?: string;
  size: "xs" | "sm" | "md" | "lg" | "xl";
};

const Countdown = ({ date, children, prefix, size = "md" }) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return children;
    } else {
      const getDate = (hasDays, hasHours) => {
        seconds = seconds >= 10 ? seconds : `0${seconds}`;
        hours = hours >= 10 ? hours : `0${hours}`;
        minutes = minutes >= 10 ? minutes : `0${minutes}`;
        days = days >= 10 ? days : `0${days}`;
        if (hasDays) {
          return (
            <span>
              {days}:{hours}:{minutes}:{seconds}
            </span>
          );
        } else if (hasHours) {
          return (
            <span>
              {hours}:{minutes}:{seconds}
            </span>
          );
        }
        return (
          <span>
            {minutes}:{seconds}
          </span>
        );
      };
      return (
        <VStack spacing={0} align="flex-start">
          {prefix && <Text fontSize={size}>{prefix}</Text>}
          <Text fontSize={size}>{getDate(days > 0, hours > 0)}</Text>
        </VStack>
      );
    }
  };
  return <ReactCountdown date={date} renderer={renderer} />;
};

export default Countdown;
