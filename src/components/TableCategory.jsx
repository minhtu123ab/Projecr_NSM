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
import { useSnackbar } from "notistack";

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

  const { enqueueSnackbar } = useSnackbar();

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
        if (error.response.status === 401) {
          const newToken = await useRefeshToken();
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
  }, [page, valueSearch, create, upadate, deleteStatus]);

  useEffect(() => {
    setPage(0);
  }, [valueSearch]);

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
      enqueueSnackbar(`Delete Categories ${idDelete.length} Successfully`, {
        variant: "success",
      });
      const time = new Date().getTime();
      navigate(`?delete=${time}`);
    } catch (e) {
      if (error.response.status === 401) {
        const newToken = await useRefeshToken();
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
        enqueueSnackbar("Delete Categories Successfully", {
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
        if (error.response.status === 401) {
          const newToken = await useRefeshToken();
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
    <div>
      {openEdit && (
        <ModelEditCategory
          handleEdit={handleEdit}
          dataEdit={dataEdit}
          setOpenEdit={setOpenEdit}
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
                        color: "#DC2626",
                        padding: "2px 12px",
                        borderRadius: "10px",
                        backgroundColor: "#FEE2E2",
                      }}
                    >
                      Metter
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "#16A34A",
                        padding: "2px 12px",
                        borderRadius: "10px",
                        backgroundColor: "#DCFCE7",
                      }}
                    >
                      Quantity
                    </span>
                  )}
                </td>
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
              <td
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontFamily: "monospace",
                  fontSize: 30,
                  textAlign: "center",
                  color: "#777777",
                  cursor: "default",
                }}
              >
                Không có bản ghi nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="back-next-category">
        <Button disabled={page === 0} onClick={onBack}>
          <DoubleLeftOutlined />
          Back
        </Button>
        <span style={{ fontFamily: " Arial, Helvetica, sans-serif" }}>
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
        title="Xóa Categories"
        open={modalVisible}
        onOk={handleDelete}
        onCancel={() => setModalVisible(false)}
        okType="danger"
      >
        <p>Are you sure you want to delete?</p>
      </Modal>
      <Modal
        title="Xóa Nhiều Categories"
        open={modalVisibleAll}
        onOk={DeleteAll}
        onCancel={() => setModalVisibleAll(false)}
        okType="danger"
      >
        <p>Are you sure you want to delete {idDelete.length} categories</p>
      </Modal>
    </div>
  );
};

export default memo(TableCategory);
