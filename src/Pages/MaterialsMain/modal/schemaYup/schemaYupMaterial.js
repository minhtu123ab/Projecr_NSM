import * as yup from "yup";

const schema = yup.object().shape({
  image: yup.mixed().required("Image is required"),

  name: yup.string().max(30, "Category name cannot be more than 30 characters"),

  part_number: yup
    .string()
    .required("Part number is required")
    .max(30, "Part number cannot be more than 30 characters"),

  type: yup.number().typeError("Type must be a number"),

  large_title: yup
    .string()
    .required("Large title is required")
    .max(30, "Large title cannot be more than 30 characters"),

  small_title: yup
    .string()
    .required("Small title is required")
    .max(30, "Small title cannot be more than 30 characters"),

  basic_price: yup
    .number()
    .typeError("Basic price must be a number")
    .required("Basic price is required"),

  category: yup.string().required("Category is required"),

  supplier: yup.string().required("Supplier is required"),
});

export default schema;
