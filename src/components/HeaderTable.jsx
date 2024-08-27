/* eslint-disable react/prop-types */
import { Button, Checkbox } from "antd";

const HeaderTable = ({
  idDelete,
  checkAll,
  onClickDeleteAll,
  handleOpenModalDeleteAll,
  name,
}) => {
  return (
    <div
      className={
        idDelete.length
          ? `w-full bg-[#F5F5F5] pt-1 pb-1 ${
              name === "Categories" ? "pl-5" : "pl-1"
            } flex justify-between pr-5`
          : `w-full bg-white pt-1 pb-1 ${
              name === "Categories" ? "pl-5" : "pl-1"
            } flex`
      }
    >
      <Checkbox
        checked={checkAll}
        onChange={onClickDeleteAll}
        className="p-2 transform scale-125 ml-3"
      />
      {idDelete.length > 0 && (
        <Button
          className="mt-1 ml-2"
          danger
          type="primary"
          onClick={handleOpenModalDeleteAll}
        >
          Delete {idDelete.length} {name}
        </Button>
      )}
    </div>
  );
};

export default HeaderTable;
