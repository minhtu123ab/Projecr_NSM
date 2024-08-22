import { Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import env from "@/Env";
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

  const urlSave = localStorage.getItem("urlSave");

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
      navigate(urlSave ? urlSave : "/materials/categories");
    } catch (e) {
      console.log(e);
      enqueueSnackbar(`Login failed`, {
        variant: "error",
      });
      reset();
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center bg-gray-300">
      <div className="flex flex-col items-center justify-center">
        <form
          className="w-80 flex flex-col gap-7 py-14 px-7 bg-white mb-24 rounded-3xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1
            className="font-bold text-center text-4xl"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            Login
          </h1>
          <div className="flex flex-col gap-1">
            <label className="font-bold" htmlFor="email">
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
              <p className="text-red-500 text-sm mb-[-20px]">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
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
              <p className="text-red-500 text-sm mb-[-20px]">
                {errors.password.message}
              </p>
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
