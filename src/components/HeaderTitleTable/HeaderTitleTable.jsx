/* eslint-disable react/prop-types */
import data from "@/components/HeaderTitleTable/data.json";

const HeaderTitleTable = ({ name }) => {
  return (
    <tr>
      {data[name].map((item, index) => (
        <th key={index}>{item}</th>
      ))}
    </tr>
  );
};

export default HeaderTitleTable;
