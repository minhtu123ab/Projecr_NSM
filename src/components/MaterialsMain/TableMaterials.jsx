import React, {
  useEffect,
  useState,
  memo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import useQueryParams from "@/hook/useQueryParams.jsx";
import { Checkbox } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Pager from "@/components/MaterialCategories/Pager";
import { Button } from "antd";
import env from "@/Env";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useDeleteHandlers from "@/hook/useDeleteHandlers";
import ModalDelete from "@/components/MaterialCategories/modal/ModalDelete";
import requestApi from "@/axios/axiosInstance.js";
import ModalMaterial from "./modal/ModalMaterial";

const TableMaterials = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [idDelete, setIdDelete] = useState([]);
  const [total, setTotal] = useState(0);
  const [dataEdit, setDataEdit] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const queryParams = useQueryParams();

  const { handleDelete, deleteAll } = useDeleteHandlers();

  const navigate = useNavigate();

  const modalDeleteRef = useRef();
  const modalDeleteAllRef = useRef();
  const modalOpenUpdateRef = useRef();

  const handleOpenModalUpdate = (e, item) => {
    e.stopPropagation();
    setDataEdit(item);
    modalOpenUpdateRef.current.openModal();
  };

  useImperativeHandle(ref, () => ({
    resetSelection: () => {
      setCheckAll(false);
      setIdDelete([]);
    },
  }));

  const handleOpenModalDeleteAll = () => {
    modalDeleteAllRef.current.openModal();
  };

  const handleOpenModalDelete = (e, item) => {
    e.stopPropagation();
    setItemToDelete(item);
    modalDeleteRef.current.openModal();
  };

  useEffect(() => {
    setCheckAll(idDelete.length ? true : false);
  }, [idDelete]);

  useEffect(() => {
    const getData = async () => {
      try {
        const params = {
          limit: env.countOfPage,
          offset: env.countOfPage * queryParams.page,
          name: queryParams.name,
          category: queryParams.category,
        };
        const response = await requestApi("/cms/material", "get", null, params);
        const idDataInPage = response.data.results.map((item) => item.id);
        const idDeleteInPage = idDelete.filter((item) =>
          idDataInPage.includes(item)
        );
        setIdDelete(idDeleteInPage);
        setData(response.data.results);
        setTotal(response.data.count);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [queryParams, navigate]);

  const onClickDeleteAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setIdDelete(newCheckAll ? data.map((item) => item.id) : []);
  };

  const OnClickSelectDelete = (item) => {
    setIdDelete((prevId) => {
      const newIdDelete = prevId.includes(item.id)
        ? prevId.filter((id) => id !== item.id)
        : [...prevId, item.id];
      setCheckAll(newIdDelete.length > 0);
      return newIdDelete;
    });
  };

  return (
    <div className="rounded-[10px] overflow-hidden shadow-[0px_0px_5px_rgba(0,0,0,0.322)]">
      <ModalMaterial dataEdit={dataEdit} ref={modalOpenUpdateRef} />
      <div
        className={
          idDelete.length
            ? "w-full bg-[#D3D8DC] pt-[5px] pb-[5px] pl-[5px] flex justify-between pr-[30px]"
            : "w-full bg-white pt-[5px] pb-[5px] pl-[5px] flex"
        }
      >
        <Checkbox
          checked={checkAll}
          onChange={onClickDeleteAll}
          className="p-[8px] transform scale-[1.3] ml-[17px]"
        />
        {idDelete.length > 0 && (
          <Button
            className="mt-[3px] ml-[10px]"
            danger
            type="primary"
            onClick={handleOpenModalDeleteAll}
          >
            Delete {idDelete.length} categories
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="table-category w-full min-w-[1500px]">
          <thead>
            <tr>
              <th></th>
              <th>No</th>
              <th>Image</th>
              <th>Part Number</th>
              <th>Name</th>
              <th>Type</th>
              <th>Large Title</th>
              <th>Small Title</th>
              <th>Basic Price</th>
              <th>Category</th>
              <th>Supplier</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((item, index) => (
                <tr
                  style={{
                    cursor: "pointer",
                    backgroundColor: idDelete.includes(item.id)
                      ? "#D1D5D9"
                      : "white",
                  }}
                  onClick={() => OnClickSelectDelete(item)}
                  key={item.id}
                >
                  <td>
                    <Checkbox
                      checked={idDelete.includes(item.id)}
                      className="transform scale-[1.3] ml-[10px]"
                    />
                  </td>
                  <td>{queryParams.page * env.countOfPage + index + 1}</td>
                  <td className="flex justify-center">
                    <img
                      className="w-[130px] h-[70px] object-cover m-[5px] rounded-[10px]"
                      src={item.image}
                    />
                  </td>
                  <td>{item.part_number}</td>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td>{item.large_title}</td>
                  <td>{item.small_title}</td>
                  <td>{item.basic_price}</td>
                  <td>{item.category.name}</td>
                  <td>{item.supplier.name}</td>

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
                <td className="pt-[10px] pb-[10px] font-mono text-[30px] text-center text-[#777777] cursor-default">
                  Không có bản ghi nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pager
        total={total}
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
            setIdDelete,
            modalDeleteRef,
            "/cms/material"
          )
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
            setIdDelete,
            "/cms/material/bulk"
          )
        }
      />
    </div>
  );
});

export default memo(TableMaterials);
