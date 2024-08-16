import React, { useEffect, useState, memo } from "react";
import { Checkbox } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons";
import { Button, Modal } from "antd";
import axios from "axios";
import env from "@/Env";
import { useNavigate } from "react-router-dom";
import refeshToken from "@/services/refeshToken";
import { useSnackbar } from "notistack";
import EditMaterial from "./EditMaterial";
import { useLocation } from "react-router-dom";

const TableMaterials = () => {
  const [searchMaterial, setSearchMaterial] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [create, setCreate] = useState("");
  const [update, setUpdate] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [checkAll, setCheckAll] = useState(false);
  const [idDelete, setIdDelete] = useState([]);
  const [total, setTotal] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [modalVisibleAll, setModalVisibleAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState("");

  const countPage = Math.ceil(total / env.countOfPage);

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSearchCategory(queryParams.get("category"));
    setSearchMaterial(queryParams.get("name"));
    setCreate(queryParams.get("create_at") || "");
    setUpdate(queryParams.get("updated_at") || "");
    setDeleteStatus(queryParams.get("delete") || "");
  }, [location.search]);

  useEffect(() => {
    setCheckAll(idDelete.length ? true : false);
  }, [idDelete]);

  useEffect(() => {
    const getData = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      try {
        const params = {
          limit: env.countOfPage,
          offset: env.countOfPage * page,
        };
        if (searchMaterial) {
          params.name = searchMaterial;
        }
        if (searchCategory) {
          params.category = searchCategory;
        }
        const response = await axios.get(env.urlServer + `/cms/material`, {
          headers: {
            Authorization: `Bearer ${token.access}`,
            "Content-Type": "application/json",
          },
          params,
        });
        setData(response.data.results);
        setTotal(response.data.count);
      } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          const newToken = await refeshToken();
          if (newToken) {
            await getData();
          } else {
            navigate("/login");
          }
        } else {
          console.error(error);
          navigate("/login");
        }
      }
    };
    getData();
  }, [searchMaterial, searchCategory, create, update, page, deleteStatus]);

  const onClickDeleteAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setIdDelete(newCheckAll ? data.map((item) => item.id) : []);
  };

  const showModal = (e, item) => {
    e.stopPropagation();
    setItemToDelete(item);
    setModalVisible(true);
  };

  const showModalAll = () => {
    setModalVisibleAll(true);
  };

  const onBack = () => {
    setPage((prevPage) => prevPage - 1);
    setIdDelete([]);
  };

  const DeleteAll = async () => {
    const results = idDelete.join(",");
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      await axios.delete(env.urlServer + `/cms/material/bulk/${results}`, {
        headers: {
          Authorization: `Bearer ${token.access}`,
          "Content-Type": "application/json",
        },
      });
      enqueueSnackbar(`Delete ${idDelete.length} Categories Successfully`, {
        variant: "success",
      });
      const time = new Date().getTime();
      navigate(`?delete=${time}`);
    } catch (e) {
      if (e.response.status === 401) {
        const newToken = await refeshToken();
        if (newToken) {
          await DeleteAll();
        } else {
          navigate("/login");
        }
      } else {
        console.error(e);
      }
    } finally {
      setModalVisibleAll(false);
      setIdDelete([]);
    }
  };

  const onNext = () => {
    setPage((prevPage) => prevPage + 1);
    setIdDelete([]);
  };

  const OnClickSelectDelete = (item) => {
    setIdDelete((prevId) => {
      const newIdDelete = prevId.includes(item.id)
        ? prevId.filter((id) => id !== item.id)
        : [...prevId, item.id];
      setCheckAll(newIdDelete.length === data.length);
      return newIdDelete;
    });
  };

  const handleEdit = (e, item) => {
    e.stopPropagation();
    setDataEdit(item);
    setOpenEdit(!openEdit);
  };

  useEffect(() => {
    setPage(0);
  }, [searchMaterial, searchCategory]);

  const handleDelete = async () => {
    if (itemToDelete) {
      const token = JSON.parse(localStorage.getItem("token"));
      try {
        await axios.delete(env.urlServer + `/cms/material/${itemToDelete.id}`, {
          headers: {
            Authorization: `Bearer ${token.access}`,
            "Content-Type": "application/json",
          },
        });
        enqueueSnackbar("Delete 1 Material Successfully", {
          variant: "success",
        });
        const time = new Date().getTime();
        navigate(`?delete=${time}`);
        if (idDelete.includes(itemToDelete.id)) {
          setIdDelete((prevId) =>
            prevId.filter((id) => id !== itemToDelete.id)
          );
        }
      } catch (e) {
        if (e.response.status === 401) {
          const newToken = await refeshToken();
          if (newToken) {
            await handleDelete();
          } else {
            navigate("/login");
          }
        } else {
          console.log(e);
        }
      } finally {
        setModalVisible(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <div className="rounded-[10px] overflow-hidden shadow-[0px_0px_5px_rgba(0,0,0,0.322)]">
      {openEdit && (
        <EditMaterial
          handleEdit={handleEdit}
          dataEdit={dataEdit}
          setOpenEdit={setOpenEdit}
        />
      )}
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
            onClick={() => showModalAll(idDelete)}
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
              <th>NO</th>
              <th>IMAGE</th>
              <th>PART NUMBER</th>
              <th>NAME</th>
              <th>TYPE</th>
              <th>LARGE TITLE</th>
              <th>SMALL TITLE</th>
              <th>BASIC PRICE</th>
              <th>CATEGORY</th>
              <th>SUPPLIER</th>
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
                  <td>{page * 5 + index + 1}</td>
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
                    <Button onClick={(e) => handleEdit(e, item)} type="text">
                      <EditOutlined />
                    </Button>
                    <Button
                      onClick={(e) => showModal(e, item)}
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

      <div className="flex gap-[10px] items-center bg-white justify-between p-[5px]">
        <Button disabled={page === 0} onClick={onBack}>
          <DoubleLeftOutlined />
          Previous
        </Button>
        <span className="font-sans">
          {countPage ? page + 1 : 0} of {countPage}
        </span>
        {data.length ? (
          <Button disabled={page === countPage - 1} onClick={onNext}>
            Next
            <DoubleRightOutlined />
          </Button>
        ) : (
          <Button disabled>
            Next
            <DoubleRightOutlined />
          </Button>
        )}
      </div>
      <Modal
        title="Delete Categories"
        open={modalVisible}
        onOk={handleDelete}
        onCancel={() => setModalVisible(false)}
        okType="danger"
      >
        <p>Are you sure you want to delete?</p>
      </Modal>
      <Modal
        title="Delete Multiple Categories"
        open={modalVisibleAll}
        onOk={DeleteAll}
        onCancel={() => setModalVisibleAll(false)}
        okType="danger"
      >
        <p>Are you sure you want to delete {idDelete.length} material</p>
      </Modal>
    </div>
  );
};

export default memo(TableMaterials);
