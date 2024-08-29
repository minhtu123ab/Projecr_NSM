import * as yup from "yup";

const schema = yup.object().shape({
  image: yup.mixed().required("Image is required"),
  name: yup
    .string()
    .required("Name is required")
    .max(255, "Category name cannot be more than 255 characters"),
  price_type: yup.string().required("Price is required"),
});

export default schema;
