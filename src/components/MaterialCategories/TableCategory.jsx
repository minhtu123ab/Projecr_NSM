import {
  useState,
  useRef,
  memo,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Checkbox, Button, Empty } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import env from "@/Env";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useQueryParams from "@/hook/useQueryParams.jsx";
import Pager from "@/components/MaterialCategories/Pager";
import ModalDelete from "@/components/modal/ModalDelete";
import useDeleteHandlers from "@/hook/useDeleteHandlers";
import requestApi from "@/axios/axiosInstance.js";

const TableCategory = forwardRef((props, ref) => {
  const [state, setState] = useState({
    loading: true,
    data: [],
    total: 0,
  });
  const [checkAll, setCheckAll] = useState(false);
  const [idDelete, setIdDelete] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);

  const modalDeleteRef = useRef();
  const modalDeleteAllRef = useRef();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  const { handleDelete, deleteAll } = useDeleteHandlers();

  useImperativeHandle(ref, () => ({
    resetSelection: () => {
      setCheckAll(false);
      setIdDelete([]);
    },
  }));

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
        setState({
          loading: false,
          data: response.data.results,
          total: response.data.count,
        });
      } catch (error) {
        console.error(error);
        // navigate("/login");
      }
    };
    fetchData();
  }, [queryParams, navigate]);

  const handleOpenModalDeleteAll = () => {
    modalDeleteAllRef.current.openModal();
  };

  const handleOpenModalDelete = (e, item) => {
    e.stopPropagation();
    setItemToDelete(item);
    modalDeleteRef.current.openModal();
  };

  const onClickSelectDelete = (item) => {
    setIdDelete((prevId) => {
      const newIdDelete = prevId.includes(item.id)
        ? prevId.filter((id) => id !== item.id)
        : [...prevId, item.id];
      return newIdDelete;
    });
  };

  useEffect(() => {
    setCheckAll(idDelete.length > 0);
  }, [idDelete.length]);

  const onClickDeleteAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setIdDelete(newCheckAll ? state.data.map((item) => item.id) : []);
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-md">
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
          {state.loading ? (
            Array.from({ length: env.countOfPage }).map((_, index) => (
              <tr key={index} className="animate-pulse bg-gray-200">
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
                    onClick={() => navigate(`/materials/categories/${item.id}`)}
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
            setIdDelete,
            modalDeleteRef,
            "/cms/material_categories"
          )
        }
      />
      <ModalDelete
        ref={modalDeleteAllRef}
        idDelete={idDelete}
        onDelete={() =>
          deleteAll(
            idDelete,
            state.data,
            navigate,
            modalDeleteAllRef,
            enqueueSnackbar,
            setIdDelete,
            "/cms/material_categories/bulk"
          )
        }
      />
    </div>
  );
});

TableCategory.displayName = "TableCategory";

export default memo(TableCategory);
