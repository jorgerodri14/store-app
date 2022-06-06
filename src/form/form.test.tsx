import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";

import { Form } from "./form";

describe("when the form is mounted", () => {
  // eslint-disable-next-line testing-library/no-render-in-setup
  beforeEach(() => render(<Form />));

  it("there must be a create product form page", () => {
    expect(
      screen.getByRole("heading", { name: /create product/i })
    ).toBeInTheDocument();
  });

  it("should exits the fields: name, size, type(electronic, furniture, clothing) and submit buttons", () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();

    expect(screen.getByText(/electronic/i)).toBeInTheDocument();
    expect(screen.getByText(/furniture/i)).toBeInTheDocument();
    expect(screen.getByText(/clothing/i)).toBeInTheDocument();
  });

  it("should exist the submit button", () => {
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});

describe('when the user submits the form without values',()=>{
  it('should display validation messages', () =>{
    render(<Form />)
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument();


    fireEvent.click(screen.getByRole("button", { name: /submit/i }))

    expect(screen.getByText(/the name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/the size is required/i)).toBeInTheDocument();
    expect(screen.getByText(/the type is required/i)).toBeInTheDocument();
  })
})