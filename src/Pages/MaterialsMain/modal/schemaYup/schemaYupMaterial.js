import * as yup from "yup";

const schema = yup.object().shape({
  image: yup.mixed().required("Image is required"),
  name: yup.string().max(30, "Category name cannot be more than 30 characters"),
  part_number: yup.string().required("Price is required"),
  type: yup.number("type is number"),
  large_title: yup.string().required("Large title is required"),
  small_title: yup.string().required("Small title is required"),
  basic_price: yup
    .number("Basic price is number")
    .required("Basic price is required"),
  category: yup.string().required("Category is required"),
  supplier: yup.string().required("Supplier is required"),
});

export default schema;
