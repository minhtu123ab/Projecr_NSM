import React, { useState } from "react";
import { Input, Button, Affix } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import env from "../../Env";
import { useSnackbar } from "notistack";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();

  const url = env.urlServer;
  const navigate = useNavigate();
  const [value, setValue] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const onBlur = (field) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const onChangeValue = (field) => (e) => {
    setValue({ ...value, [field]: e.target.value });
  };
  const check = (field) => {
    if (touched[field]) {
      if (!value[field]) {
        return true;
      }
    }
    return false;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(url + "/cms/auth/login", value);
      console.log("result=", result.data);
      localStorage.setItem("token", JSON.stringify(result.data));
      enqueueSnackbar(`Login Successfully`, {
        variant: "success",
      });
      setValue({ email: "", password: "" });
      setTouched({ email: false, password: false });
      navigate("/materials/categories");
    } catch (e) {
      console.log(e);
      enqueueSnackbar(`Login failed`, {
        variant: "error",
      });
      setValue({ email: "", password: "" });
      setTouched({ email: false, password: false });
    }
  };
  return (
    <div className="login-all">
      <div className="login">
        <form className="form-login" onSubmit={handleSubmit}>
          <h1 className="header-login">Login</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <label
              style={{
                fontWeight: "bold",
              }}
              htmlFor="email"
            >
              Email*
            </label>
            <Input
              id="email"
              type="email"
              placeholder="email"
              value={value.email}
              onChange={onChangeValue("email")}
              onBlur={onBlur("email")}
            />
          </div>
          {check("email") && <p className="err-login">Please enter email</p>}
          <div
            style={{
              display: "flex",
              gap: 5,
              flexDirection: "column",
            }}
          >
            <label
              style={{
                fontWeight: "bold",
              }}
              htmlFor="password"
            >
              Password*
            </label>
            <Input
              placeholder="Password"
              type="password"
              value={value.password}
              onChange={onChangeValue("password")}
              onBlur={onBlur("password")}
            />
          </div>
          {check("password") && (
            <p className="err-login">Please enter password</p>
          )}
          <Button htmlType="submit" type="primary" onClick={handleSubmit}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
