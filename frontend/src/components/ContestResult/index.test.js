import { render } from "../../test";
import { waitFor } from "@testing-library/react";
import ContestResult from ".";

const contestResultData = {
  correct: [],
  incorrect: [
    "The Central Powers",
    "Shortsightedness",
    "Hans Christian Andersen",
    "Sigma",
    "Chorus",
    "Uranium",
    "Hell Knight",
    "Peace",
    "More questions",
    "Ridley Scott",
  ],
  ratio: 0,
  percentage: "0%",
  isWinner: false,
};

test("Should render a lose image if the user didn`t win the contest", async () => {
  contestResultData.isWinner = false;
  const { queryByAltText } = render(
    <ContestResult data={contestResultData} isTesting />
  );
  await waitFor(() => expect(queryByAltText("Loser")).toBeInTheDocument());
});
test("Should render a win image if the user didn`t win the contest", async () => {
  contestResultData.isWinner = true;
  const { queryByAltText } = render(
    <ContestResult data={contestResultData} isTesting />
  );
  await waitFor(() => expect(queryByAltText("Winner")).toBeInTheDocument());
});
test("Should render a reserved box indicating that the user won the contest", async () => {
  contestResultData.isWinner = true;
  const { queryByLabelText } = render(
    <ContestResult data={contestResultData} isTesting />
  );
  await waitFor(() =>
    expect(queryByLabelText("Contest winner")).toBeInTheDocument()
  );
});
