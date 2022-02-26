import { ReactChild } from "react";
import ReactCountdown from "react-countdown";

type Countdown = {
  date: string;
  children: ReactChild;
};

const Countdown = ({ date, children }) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return children;
    } else {
      const getDate = (hasDays, hasHours) => {
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
      return <div>starts in: {getDate(days > 0, hours > 0)}</div>;
    }
  };
  return <ReactCountdown date={date} renderer={renderer} />;
};

export default Countdown;
