import {
  Button,
  FormHelperText,
  InputLabel,
  Select,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { productService } from "../../services/productService";

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const Form = () => {
  const [formValidation, setFormValidation] = useState({
    name: { value: "", error: "" },
    size: { value: 0, error: "" },
    type: { value: "", error: "" },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  type FormValidationKeysType = keyof typeof formValidation;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormValidation((prevFormValidation) => ({
      ...prevFormValidation,
      [e.target.id]: {
        ...prevFormValidation[e.target.id as FormValidationKeysType],
        value: e.target.value,
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
          [e.target.name as FormValidationKeysType]: {
            ...prevFormValidation[e.target.name as FormValidationKeysType],
            value: e.target.value,
          },
        };
      }
      return prevFormValidation;
    });
  };

  const handleErrorMessage = (
    key: FormValidationKeysType,
    value: string | number
  ) =>
    setFormValidation((prevFormValidation) => ({
      ...prevFormValidation,
      [key]: {
        ...prevFormValidation[key],
        error: value ? "" : `The ${key} is required`,
      },
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);

    (Object.entries(formValidation) as Entries<typeof formValidation>).forEach(
      ([key, { value }]) => handleErrorMessage(key, value)
    );

    try {
      setIsSuccess(false);
      const {
        name: { value: name },
        size: { value: size },
        type: { value: type },
      } = formValidation;
      await productService.saveProduct({ name, size, type });
      setIsSuccess(true);
    } catch (e) {}

    setIsSaving(false);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;

    if (value) return;
    handleErrorMessage(name as FormValidationKeysType, value);
  };

  return (
    <>
      <h1>Create product</h1>
      {isSuccess && <p>Product Stored</p>}
      <form onSubmit={handleSubmit} action="#">
        <TextField
          onChange={handleChange}
          onBlur={handleBlur}
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
          onBlur={handleBlur}
        />
        <InputLabel htmlFor="type">Type</InputLabel>
        <Select
          native
          value={formValidation.type.value}
          onBlur={handleBlur}
          onChange={handleChangeSelect}
          inputProps={{ name: "type", id: "type" }}
        >
          <option arial-label="None" value="" />
          <option value="electronic">electronic</option>
          <option value="furniture">furniture</option>
          <option value="clothing">clothing</option>
        </Select>
        <FormHelperText>{formValidation.type.error}</FormHelperText>
        <Button disabled={isSaving} type="submit">
          Submit
        </Button>
      </form>
    </>
  );
};

export default Form;
