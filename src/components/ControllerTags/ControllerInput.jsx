/* eslint-disable react/prop-types */
import { Input } from "antd";
import { Controller } from "react-hook-form";

const ControllerInput = ({
  control,
  errors,
  labelName,
  name,
  require,
  type,
}) => {
  return (
    <div>
      <label htmlFor={labelName}>
        {name}
        {require && <span className="text-red-600">*</span>}
      </label>
      <Controller
        control={control}
        name={labelName}
        render={({ field }) => (
          <Input type={type} placeholder={name} {...field} />
        )}
      />
      {errors[labelName] && (
        <p className="text-red-500">{errors[labelName].message}</p>
      )}
    </div>
  );
};

export default ControllerInput;
