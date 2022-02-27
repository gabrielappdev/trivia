// test-utils.js
import React from "react";
import { render } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";

import theme from "../theme";

const Providers = ({ children }) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <RecoilRoot>{children};</RecoilRoot>
    </ChakraProvider>
  );
};

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
