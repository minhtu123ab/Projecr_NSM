import { useState } from "react";

const useChangImage = (setValue) => {
  const [urlImage, setUrlImage] = useState(null);

  const handleChangeImage = (info) => {
    if (info.file && info.file.originFileObj) {
      const file = info.file.originFileObj;
      setValue("image", file, { shouldValidate: true });
      setUrlImage(URL.createObjectURL(file));
    }
  };
  return { handleChangeImage, urlImage, setUrlImage };
};

export default useChangImage;
