/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";

import { Button } from "@renderer/components/Button";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Button component", () => {
    it("should render", async () => {
        const TEST_VALUE = "TEST";
        render(<Button data-testid="custom-element">{TEST_VALUE}</Button>);

        const elt = await screen.findByTestId("custom-element");

        expect(elt).toHaveTextContent(TEST_VALUE);
    });
});
