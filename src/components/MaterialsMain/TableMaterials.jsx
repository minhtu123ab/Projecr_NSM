import {
  useEffect,
  useState,
  memo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Checkbox, Button, Empty } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Pager from "@/components/paginator/Pager";
import env from "@/Env";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useDeleteHandlers from "@/hook/useDeleteHandlers";
import ModalDelete from "@/components/modal/ModalDelete";
import requestApi from "@/axios/axiosInstance.js";
import useQueryParams from "@/hook/useQueryParams.jsx";

const TableMaterials = forwardRef((props, ref) => {
  const [state, setState] = useState({
    loading: true,
    data: [],
    total: 0,
  });
  const [checkAll, setCheckAll] = useState(false);
  const [idDelete, setIdDelete] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const queryParams = useQueryParams();
  const navigate = useNavigate();

  const { handleDelete, deleteAll } = useDeleteHandlers();
  const modalDeleteRef = useRef();
  const modalDeleteAllRef = useRef();

  const location = useLocation();

  useImperativeHandle(ref, () => ({
    resetSelection: () => {
      setCheckAll(false);
      setIdDelete([]);
    },
  }));

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
    getData();
  }, [queryParams, navigate]);

  useEffect(() => {
    setCheckAll(idDelete.length > 0);
  }, [idDelete.length]);

  const handleOpenModalDeleteAll = () => {
    modalDeleteAllRef.current.openModal();
  };

  const handleOpenModalDelete = (e, item) => {
    e.stopPropagation();
    setItemToDelete(item);
    modalDeleteRef.current.openModal();
  };

  const onClickDeleteAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setIdDelete(newCheckAll ? state.data.map((item) => item.id) : []);
  };

  const onClickSelectDelete = (item) => {
    setIdDelete((prevId) => {
      const newIdDelete = prevId.includes(item.id)
        ? prevId.filter((id) => id !== item.id)
        : [...prevId, item.id];
      return newIdDelete;
    });
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
            Delete {idDelete.length} Materials
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
            {state.loading ? (
              Array.from({ length: env.countOfPage }).map((_, index) => (
                <tr key={index} className="animate-pulse  bg-gray-200">
                  <td>
                    <Checkbox
                      className="transform scale-[1.3] ml-[10px]"
                      disabled
                    />
                  </td>
                  <td>
                    <div className="w-8 h-4 bg-gray-300 rounded m-5"></div>
                  </td>
                  <td className="flex justify-center">
                    <div className="w-44 h-24 bg-gray-300 rounded-lg mt-2 mb-2"></div>
                  </td>
                  <td>
                    <div className="w-32 h-4 bg-gray-300 rounded"></div>
                  </td>
                  <td>
                    <div className="w-32 h-4 bg-gray-300 rounded"></div>
                  </td>
                  <td>
                    <div className="w-32 h-4 bg-gray-300 rounded"></div>
                  </td>
                  <td>
                    <div className="w-32 h-4 bg-gray-300 rounded"></div>
                  </td>
                  <td>
                    <div className="w-32 h-4 bg-gray-300 rounded"></div>
                  </td>
                  <td>
                    <div className="w-32 h-4 bg-gray-300 rounded"></div>
                  </td>
                  <td>
                    <div className="w-32 h-4 bg-gray-300 rounded"></div>
                  </td>
                  <td>
                    <div className="w-32 h-4 bg-gray-300 rounded"></div>
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
            state.data,
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

TableMaterials.displayName = "TableMaterials";

export default memo(TableMaterials);
