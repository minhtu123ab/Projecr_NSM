/* eslint-disable react/prop-types */
import { Select } from "antd";
import { Controller } from "react-hook-form";

const ControllerSelect = ({
  control,
  data,
  errors,
  labelName,
  name,
  require,
}) => {
  return (
    <div>
      <label htmlFor={labelName}>
        {name}
        {require && <span className="text-red-600">*</span>}
      </label>
      <Controller
        name={labelName}
        control={control}
        render={({ field }) => (
          <Select
            className="w-full"
            options={data.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            {...field}
          />
        )}
      />
      {errors[labelName] && (
        <p className="text-red-500">{errors[labelName].message}</p>
      )}
    </div>
  );
};

export default ControllerSelect;
