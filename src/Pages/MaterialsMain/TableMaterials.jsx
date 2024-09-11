/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { memo, forwardRef, useEffect } from "react";
import { Checkbox, Button, Empty } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Pager from "@/components/Pager";
import env from "@/Env";
import { useLocation, useNavigate } from "react-router-dom";
import useDeleteHandlers from "@/hook/useDeleteHandlers";
import ModalDelete from "@/components/ModalDelete";
import useQueryParams from "@/hook/useQueryParams.jsx";
import HeaderTable from "@/components/HeaderTable";
import useFetchData from "@/hook/useFetchData";
import useSelectDelete from "@/hook/useSelectDelete";
import useHandleModalDelete from "@/hook/useHandleModalDelete";
import LoadingTableMaterial from "@/Pages/MaterialsMain/LoadingTableMaterial";
import HeaderTitleTable from "@/components/HeaderTitleTable/HeaderTitleTable";

const TableMaterials = forwardRef(({ setState }, ref) => {
  const { state, setCheckCallApi } = useFetchData("/cms/material");
  const { handleDelete, deleteAll } = useDeleteHandlers(
    "/cms/material",
    setCheckCallApi
  );
  useEffect(() => {
    setState(state);
  }, [state]);

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

  const queryParams = useQueryParams();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      <HeaderTable
        idDelete={idDelete}
        checkAll={checkAll}
        onClickDeleteAll={onClickDeleteAll}
        handleOpenModalDeleteAll={handleOpenModalDeleteAll}
        name="Materials"
      />
      <div className="overflow-x-auto">
        <table className="table-category w-full min-w-[1700px]">
          <thead>
            <HeaderTitleTable name={"material"} />
          </thead>
          <tbody>
            {state.loading ? (
              Array.from({ length: env.countOfPage }).map((_, index) => (
                <LoadingTableMaterial key={index} />
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
                  <td>
                    <span className="bg-indigo-300 px-2 p-1 rounded-full text-indigo-800">
                      {item.part_number}
                    </span>
                  </td>
                  <td className="max-w-36 truncate">
                    <span>{item.name}</span>
                  </td>
                  <td>
                    <span
                      className={
                        item.type &&
                        "bg-rose-300 px-2 p-1 rounded-full text-rose-800"
                      }
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="max-w-36 truncate">
                    <span>{item.large_title}</span>
                  </td>
                  <td className="max-w-36 truncate">
                    <span>{item.small_title}</span>
                  </td>
                  <td className="max-w-36 truncate">
                    <span className="px-2 py-1 bg-lime-300 rounded-full text-lime-800">
                      {item.basic_price}
                    </span>
                  </td>
                  <td className="max-w-36 truncate">
                    <span className="bg-orange-300 px-2 py-1 rounded-full text-orange-800">
                      {item.category.name}
                    </span>
                  </td>
                  <td className="max-w-36 truncate">
                    <span className="bg-cyan-300 px-2 py-1 rounded-full text-cyan-800">
                      {item.supplier.name}
                    </span>
                  </td>
                  <td>
                    <Button
                      onClick={() =>
                        navigate(`/materials/main/${item.id}${location.search}`)
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
                <td colSpan="12">
                  <Empty description="Không có bản ghi nào" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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

TableMaterials.displayName = "TableMaterials";

export default memo(TableMaterials);
