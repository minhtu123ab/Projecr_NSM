import React from "react";
import { Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import env from "../../Env";
import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await axios.post(env.urlServer + "/cms/auth/login", data);
      localStorage.setItem("token", JSON.stringify(result.data));
      enqueueSnackbar(`Login Successfully`, {
        variant: "success",
      });
      reset();
      navigate("/materials/categories");
    } catch (e) {
      console.log(e);
      enqueueSnackbar(`Login failed`, {
        variant: "error",
      });
      reset();
    }
  };

  return (
    <div className="login-all">
      <div className="login">
        <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="header-login">Login</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontWeight: "bold" }} htmlFor="email">
              Email*
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} id="email" type="email" placeholder="email" />
              )}
            />
            {errors.email && (
              <p className="err-login">{errors.email.message}</p>
            )}
          </div>
          <div style={{ display: "flex", gap: 5, flexDirection: "column" }}>
            <label style={{ fontWeight: "bold" }} htmlFor="password">
              Password*
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Password" type="password" />
              )}
            />
            {errors.password && (
              <p className="err-login">{errors.password.message}</p>
            )}
          </div>
          <Button htmlType="submit" type="primary">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
