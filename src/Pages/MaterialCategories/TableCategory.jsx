/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { memo, forwardRef } from "react";
import { Checkbox, Button, Empty } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import env from "@/Env";
import { useLocation, useNavigate } from "react-router-dom";
import useQueryParams from "@/hook/useQueryParams.jsx";
import Pager from "@/components/Pager";
import ModalDelete from "@/components/ModalDelete";
import useDeleteHandlers from "@/hook/useDeleteHandlers";
import HeaderTable from "@/components/HeaderTable";
import useFetchData from "@/hook/useFetchData";
import useSelectDelete from "@/hook/useSelectDelete";
import useHandleModalDelete from "@/hook/useHandleModalDelete";
import LoadingTableCategory from "@/Pages/MaterialCategories/LoadingTableCategory";
import HeaderTitleTable from "@/components/HeaderTitleTable/HeaderTitleTable";

const TableCategory = forwardRef(({ setState }, ref) => {
  const { state, setCheckCallApi } = useFetchData("/cms/material_categories");
  const { handleDelete, deleteAll } = useDeleteHandlers(
    "/cms/material_categories",
    setCheckCallApi
  );
  setState(state);

  const {
    checkAll,
    idDelete,
    setCheckAll,
    setIdDelete,
    onClickDeleteAll,
    onClickSelectDelete,
  } = useSelectDelete(state.data, ref);

  const {
    itemToDelete,
    handleOpenModalDelete,
    handleOpenModalDeleteAll,
    modalDeleteRef,
    modalDeleteAllRef,
  } = useHandleModalDelete();

  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const location = useLocation();

  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      <HeaderTable
        idDelete={idDelete}
        checkAll={checkAll}
        onClickDeleteAll={onClickDeleteAll}
        handleOpenModalDeleteAll={handleOpenModalDeleteAll}
        name="Categories"
      />
      <table className="table-category">
        <thead>
          <HeaderTitleTable name={"category"} />
        </thead>
        <tbody>
          {state.loading ? (
            Array.from({ length: env.countOfPage }).map((_, index) => (
              <LoadingTableCategory key={index} />
            ))
          ) : state.data.length ? (
            state.data.map((item, index) => (
              <tr
                className={`cursor-pointer ${
                  idDelete.includes(item.id) ? "bg-[#F5F5F5]" : "white"
                }`}
                onClick={() => onClickSelectDelete(item)}
                key={item.id}
              >
                <td>
                  <Checkbox
                    checked={idDelete.includes(item.id)}
                    className="transform scale-[1.3] ml-2"
                  />
                </td>
                <td>{queryParams.page * env.countOfPage + index + 1}</td>
                <td className="flex justify-center">
                  <img
                    className="w-44 h-24 object-cover m-2 rounded-lg"
                    src={item.image}
                  />
                </td>
                <td className="max-w-20 truncate">{item.name}</td>
                <td>
                  {item.price_type === "per_metter" ? (
                    <span className="text-red-800 px-3 py-1 rounded-full bg-red-300">
                      Metter
                    </span>
                  ) : (
                    <span className="text-green-800 px-3 py-1 rounded-full bg-green-300">
                      Quantity
                    </span>
                  )}
                </td>
                <td>
                  <Button
                    onClick={() =>
                      navigate(
                        `/materials/categories/${item.id}${location.search}`
                      )
                    }
                    type="text"
                  >
                    <EditOutlined />
                  </Button>
                  <Button
                    onClick={(e) => handleOpenModalDelete(e, item)}
                    danger
                    type="text"
                  >
                    <DeleteOutlined />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="pt-2 pb-2">
                <Empty description="Không có bản ghi nào" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pager
        total={state.total}
        setIdDelete={setIdDelete}
        setCheckAll={setCheckAll}
      />
      <ModalDelete
        ref={modalDeleteRef}
        itemToDelete={itemToDelete}
        onDelete={() =>
          handleDelete(
            itemToDelete,
            idDelete,
            state.data,
            setIdDelete,
            modalDeleteRef
          )
        }
      />
      <ModalDelete
        ref={modalDeleteAllRef}
        idDelete={idDelete}
        onDelete={() =>
          deleteAll(idDelete, state.data, modalDeleteAllRef, setIdDelete)
        }
      />
    </div>
  );
});

TableCategory.displayName = "TableCategory";

export default memo(TableCategory);
