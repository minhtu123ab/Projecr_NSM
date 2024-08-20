import React, {
  useState,
  useRef,
  memo,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Checkbox, Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import env from "@/Env";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useQueryParams from "@/hook/useQueryParams.jsx";
import Pager from "@/components/MaterialCategories/Pager";
import ModalDelete from "@/components/MaterialCategories/modal/ModalDelete";
import useDeleteHandlers from "@/hook/useDeleteHandlers";
import requestApi from "@/axios/axiosInstance.js";
import ModalCategoriesAntd from "@/components/MaterialCategories/modal/ModalCategories";

const TableCategory = forwardRef((props, ref) => {
  const [checkAll, setCheckAll] = useState(false);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [dataEdit, setDataEdit] = useState({});
  const [idDelete, setIdDelete] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);

  const modalDeleteRef = useRef();
  const modalDeleteAllRef = useRef();
  const modalOpenUpdateRef = useRef();

  useImperativeHandle(ref, () => ({
    resetSelection: () => {
      setCheckAll(false);
      setIdDelete([]);
    },
  }));

  const handleOpenModalUpdate = (e, item) => {
    e.stopPropagation();
    setDataEdit(item);
    modalOpenUpdateRef.current.openModal();
  };

  const { handleDelete, deleteAll } = useDeleteHandlers();

  const handleOpenModalDeleteAll = () => {
    modalDeleteAllRef.current.openModal();
  };

  const handleOpenModalDelete = (e, item) => {
    e.stopPropagation();
    setItemToDelete(item);
    modalDeleteRef.current.openModal();
  };

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          limit: env.countOfPage,
          offset: env.countOfPage * queryParams.page,
          name: queryParams.name,
        };
        const response = await requestApi(
          "/cms/material_categories",
          "get",
          null,
          params
        );
        const idDataInPage = response.data.results.map((item) => item.id);
        const idDeleteInPage = idDelete.filter((item) =>
          idDataInPage.includes(item)
        );
        setIdDelete(idDeleteInPage);
        setData(response.data.results);
        setTotal(response.data.count);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    fetchData();
  }, [queryParams, navigate]);

  const onClickSelectDelete = (item) => {
    setIdDelete((prevId) => {
      const newIdDelete = prevId.includes(item.id)
        ? prevId.filter((id) => id !== item.id)
        : [...prevId, item.id];
      setCheckAll(newIdDelete.length > 0);
      return newIdDelete;
    });
  };

  const onClickDeleteAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setIdDelete(newCheckAll ? data.map((item) => item.id) : []);
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      <ModalCategoriesAntd dataEdit={dataEdit} ref={modalOpenUpdateRef} />
      <div
        className={
          idDelete.length
            ? "w-full bg-[#F5F5F5] pt-1 pb-1 pl-1 flex justify-between pr-5"
            : "w-full bg-white pt-1 pb-1 pl-1 flex"
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
            Delete {idDelete.length} categories
          </Button>
        )}
      </div>
      <table className="table-category">
        <thead>
          <tr>
            <th></th>
            <th>No</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((item, index) => (
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
                <td>{item.name}</td>
                <td>
                  {item.price_type === "per_metter" ? (
                    <span className="text-[#DC2626] px-3 py-0.5 rounded-lg bg-[#FEE2E2]">
                      Metter
                    </span>
                  ) : (
                    <span className="text-[#16A34A] px-3 py-0.5 rounded-lg bg-[#DCFCE7]">
                      Quantity
                    </span>
                  )}
                </td>
                <td>
                  <Button
                    onClick={(e) => handleOpenModalUpdate(e, item)}
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
              <td className="pt-2 pb-2 font-mono text-4xl text-center text-[#777777] cursor-default">
                Không có bản ghi nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pager
        total={total}
        setIdDelete={setIdDelete}
        setCheckAll={setCheckAll}
      />
      <ModalDelete
        ref={modalDeleteRef}
        itemToDelete={itemToDelete}
        onDelete={() =>
          handleDelete(itemToDelete, idDelete, setIdDelete, modalDeleteRef)
        }
      />
      <ModalDelete
        ref={modalDeleteAllRef}
        idDelete={idDelete}
        onDelete={() =>
          deleteAll(
            idDelete,
            data,
            navigate,
            modalDeleteAllRef,
            enqueueSnackbar,
            setIdDelete
          )
        }
      />
    </div>
  );
});

export default memo(TableCategory);
