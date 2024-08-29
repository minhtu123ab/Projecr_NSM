import * as yup from "yup";

const schema = yup.object().shape({
  image: yup.mixed().required("Image is required"),

  name: yup
    .string()
    .max(255, "Category name cannot be more than 255 characters"),

  part_number: yup
    .string()
    .required("Part number is required")
    .max(100, "Part number cannot be more than 100 characters"),

  type: yup
    .number()
    .typeError("Type must be a number")
    .max(2147483647, "type must be less than 2147483647")
    .min(-2147483647, "type must be greater than -2147483647"),

  large_title: yup
    .string()
    .required("Large title is required")
    .max(500, "Large title cannot be more than 500 characters"),

  small_title: yup
    .string()
    .required("Small title is required")
    .max(500, "Small title cannot be more than 500 characters"),

  basic_price: yup
    .number()
    .typeError("Basic price must be a number")
    .required("Basic price is required")
    .max(2147483647, "type must be less than 2147483647")
    .min(-2147483647, "type must be greater than -2147483647"),

  category: yup.string().required("Category is required"),

  supplier: yup.string().required("Supplier is required"),
});

export default schema;
