import * as yup from "yup";

const schema = yup.object().shape({
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
        "image/bmp",
      ];
      return value && allowedTypes.includes(value.type);
    })
    .test("fileSize", "File size is too large", (value) => {
      return value && value.size <= 2 * 1024 * 1024; // 2MB limit
    }),

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
