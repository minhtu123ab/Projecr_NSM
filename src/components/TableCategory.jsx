import React, { useEffect, useState, memo } from "react";
import Checkbox from "@mui/material/Checkbox";
import {
  DeleteOutlined,
  EditOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons";
import { Button, Modal } from "antd";
import axios from "axios";
import env from "../Env";
import { useLocation } from "react-router-dom";
import ModelEditCategory from "./ModelEditCategory";
import { useNavigate } from "react-router-dom";
import useRefeshToken from "../hook/useRefeshToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TableCategory = () => {
  const [checkAll, setCheckAll] = useState(false);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [create, setCreate] = useState("");
  const [upadate, setUpdate] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [dataEdit, setDataEdit] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [idDelete, setIdDelete] = useState([]);
  const [deleteStatus, setDeleteStatus] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [modalVisibleAll, setModalVisibleAll] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setCreate(queryParams.get("create_at") || "");
    setUpdate(queryParams.get("updated_at") || "");
    setValueSearch(queryParams.get("name") || "");
    setDeleteStatus(queryParams.get("delete") || "");
  }, [location.search]);

  useEffect(() => {
    const getData = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      try {
        const params = {
          limit: env.countOfPage,
          offset: env.countOfPage * page,
        };
        if (valueSearch) {
          params.name = valueSearch;
        }
        const response = await axios.get(
          env.urlServer + `/cms/material_categories`,
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
              "Content-Type": "application/json",
            },
            params,
          }
        );
        setData(response.data.results);
        setTotal(response.data.count);
      } catch (error) {
        console.error(error);
        if (error.response.status === 401) {
          const newToken = await useRefeshToken();
          if (newToken) {
            await getData();
          } else {
            navigate("/login");
          }
        }
      }
    };
    getData();
  }, [page, valueSearch, create, upadate, deleteStatus]);

  const handleEdit = (e, item) => {
    e.stopPropagation();
    setDataEdit(item);
    setOpenEdit(!openEdit);
  };

  useEffect(() => {
    setCheckAll(idDelete.length ? true : false);
  }, [idDelete]);

  const countPage = Math.ceil(total / env.countOfPage);

  const onNext = () => {
    setPage((prevPage) => prevPage + 1);
    setIdDelete([]);
  };

  const onBack = () => {
    setPage((prevPage) => prevPage - 1);
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
  const DeleteAll = async () => {
    const results = idDelete.join(",");
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      await axios.delete(
        env.urlServer + `/cms/material_categories/bulk/${results}`,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      const time = new Date().getTime();
      navigate(`?delete=${time}`);
      toast.success("Delete Success");
    } catch (e) {
      console.log(e);
      if (error.response.status === 401) {
        const newToken = await useRefeshToken();
        if (newToken) {
          await DeleteAll();
        } else {
          navigate("/login");
        }
      }
    } finally {
      setModalVisibleAll(false);
      setIdDelete([]);
    }
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      const token = JSON.parse(localStorage.getItem("token"));
      try {
        await axios.delete(
          env.urlServer + `/cms/material_categories/${itemToDelete.id}`,
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
              "Content-Type": "application/json",
            },
          }
        );
        const time = new Date().getTime();
        navigate(`?delete=${time}`);
        if (idDelete.includes(itemToDelete.id)) {
          setIdDelete((prevId) =>
            prevId.filter((id) => id !== itemToDelete.id)
          );
        }
      } catch (e) {
        console.log(e);
        if (error.response.status === 401) {
          const newToken = await useRefeshToken();
          if (newToken) {
            await handleDelete();
          } else {
            navigate("/login");
          }
        }
      } finally {
        setModalVisible(false);
        setItemToDelete(null);
      }
    }
  };

  const handleEditSuccess = () => {
    toast.success("Update categories successfully");
    setOpenEdit(false);
  };

  return (
    <div>
      <ToastContainer />
      {openEdit && (
        <ModelEditCategory
          handleEdit={handleEdit}
          dataEdit={dataEdit}
          setOpenEdit={setOpenEdit}
          handleEditSuccess={handleEditSuccess}
        />
      )}
      <div className="checkbox-all">
        <Checkbox checked={checkAll} onChange={onClickDeleteAll} />
        {idDelete.length > 0 && (
          <Button
            className="btn-delete-all"
            danger
            onClick={() => showModalAll(idDelete)}
          >
            Delete {idDelete.length} categories
          </Button>
        )}
      </div>
      <table className="table-category">
        <thead>
          <tr>
            <th></th>
            <th>NO</th>
            <th>IMAGE</th>
            <th>NAME</th>
            <th>PRICE TYPE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
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
                <Checkbox checked={idDelete.includes(item.id)} />
              </td>
              <td>{page * 5 + index + 1}</td>
              <td>
                <img className="img-table-category" src={item.image} />
              </td>
              <td>{item.name}</td>
              <td>
                {item.price_type === "per_metter" ? (
                  <span
                    style={{
                      color: "red",
                      border: "1px solid red",
                      padding: "2px 10px",
                      borderRadius: "10px",
                    }}
                  >
                    Metter
                  </span>
                ) : (
                  <span
                    style={{
                      color: "green",
                      border: "1px solid green",
                      padding: "2px 10px",
                      borderRadius: "10px",
                    }}
                  >
                    Quantity
                  </span>
                )}
              </td>
              <td>
                <Button
                  onClick={(e) => handleEdit(e, item)}
                  style={{ marginRight: 5 }}
                  type="primary"
                >
                  <EditOutlined />
                </Button>
                <Button
                  onClick={(e) => showModal(e, item)}
                  danger
                  type="primary"
                >
                  <DeleteOutlined />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="back-next-category">
        <Button disabled={page === 0} onClick={onBack}>
          <DoubleLeftOutlined />
          Back
        </Button>
        <span style={{ fontFamily: " Arial, Helvetica, sans-serif" }}>
          {page + 1} of {countPage}
        </span>
        <Button disabled={page === countPage - 1} onClick={onNext}>
          Next
          <DoubleRightOutlined />
        </Button>
      </div>
      <Modal
        title="Xóa Categories"
        open={modalVisible}
        onOk={handleDelete}
        onCancel={() => setModalVisible(false)}
      >
        <p>Bạn chắc chắn muốn xóa</p>
      </Modal>
      <Modal
        title="Xóa Nhiều Categories"
        open={modalVisibleAll}
        onOk={DeleteAll}
        onCancel={() => setModalVisibleAll(false)}
      >
        <p>Bạn chắc chắn muốn xóa {idDelete.length} categories</p>
      </Modal>
    </div>
  );
};

export default memo(TableCategory);
