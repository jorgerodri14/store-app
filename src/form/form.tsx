import {
  Button,
  FormHelperText,
  InputLabel,
  Select,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const Form = () => {
  const [formValidation, setFormValidation] = useState({
    name: { value: "", error: "" },
    size: { value: "", error: "" },
    type: { value: "", error: "" },
  });

  type FormValidationKeysType = keyof typeof formValidation;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormValidation((prevFormValidation) => ({
      ...prevFormValidation,
      form: {
        ...prevFormValidation,
        [e.target.id]: {
          ...prevFormValidation[e.target.id as FormValidationKeysType],
          value: e.target.value,
        },
      },
    }));
  };

  const handleChangeSelect = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    e.preventDefault();
    setFormValidation((prevFormValidation) => {
      if ("name" in e.target) {
        return {
          ...prevFormValidation,
          form: {
            ...prevFormValidation,
            [e.target.name as FormValidationKeysType]: {
              ...prevFormValidation[e.target.name as FormValidationKeysType],
              value: e.target.value,
            },
          },
        };
      }
      return prevFormValidation;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (Object.entries(formValidation) as Entries<typeof formValidation>).forEach(
      ([key, { error, value }]) => {
        setFormValidation((prevFormValidation) => ({
          ...prevFormValidation,

          [key]: {
            ...prevFormValidation[key],
            error: value ? "" : `The ${key} is required`,
          },
        }));
      }
    );
  };

  return (
    <>
      <h1>Create product</h1>
      <form onSubmit={handleSubmit} action="#">
        <TextField
          onChange={handleChange}
          helperText={formValidation.name.error}
          label="name"
          id="name"
          name="name"
        />
        <TextField
          onChange={handleChange}
          label="size"
          id="size"
          name="size"
          helperText={formValidation.size.error}
        />
        <InputLabel htmlFor="type">Type</InputLabel>
        <Select
          native
          onChange={handleChangeSelect}
          value={formValidation.type.value}
          inputProps={{ name: "type", id: "type" }}
        >
          <option arial-label="None" value="" />
          <option value="electronic">electronic</option>
          <option value="furniture">furniture</option>
          <option value="clothing">clothing</option>
        </Select>
        <FormHelperText>{formValidation.type.error}</FormHelperText>
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
};

export default Form;
