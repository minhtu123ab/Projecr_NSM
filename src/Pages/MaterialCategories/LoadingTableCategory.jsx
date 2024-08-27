import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Checkbox } from "antd";

const LoadingTableCategory = () => {
  return (
    <tr className="animate-pulse bg-gray-200">
      <td>
        <Checkbox className="transform scale-[1.3] ml-2" disabled />
      </td>
      <td className="p-4">
        <div className="w-8 h-4 bg-gray-300 rounded"></div>
      </td>
      <td className="flex justify-center">
        <div className="w-44 h-24 bg-gray-300 rounded-lg mt-2 mb-2"></div>
      </td>
      <td>
        <div className="w-32 h-4 bg-gray-300 rounded"></div>
      </td>
      <td>
        <div className="w-24 h-4 bg-gray-300 rounded"></div>
      </td>
      <td>
        <Button type="text" disabled>
          <EditOutlined />
        </Button>
        <Button type="text" danger disabled>
          <DeleteOutlined />
        </Button>
      </td>
    </tr>
  );
};

export default LoadingTableCategory;
