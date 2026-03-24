import React, { useState } from "react";
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { IconAt, IconHeartbeat } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { loginUser } from "../Service/UserService";
import {
  errorNotification,
  successNotification,
} from "../Utility/NotificationUtil";
import { useDispatch } from "react-redux";
import { setJwt } from "../Slices/JwtSlice";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../Slices/UserSlice";


const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      termsOfService: false,
    },

    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      password: (value: string) => (!value ? "Password is required" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    loginUser(values)
      .then((_data) => {
        console.log(jwtDecode(_data));
        successNotification("Logged in Successfully.");
        dispatch(setJwt(_data));
        dispatch(setUser(jwtDecode(_data)));
      })
      .catch((error) => {
        errorNotification(error?.response?.data?.errorMessage);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      style={{ background: 'url("/login.jpg")' }}
      className="h-screen w-screen !bg-cover !bg-center !bg-no-repeat flex flex-col items-center justify-center"
    >
      <div className="py-3 text-pink-500 flex gap-1 items-center ">
        <IconHeartbeat size={45} stroke={2.5} />
        <span className="font-heading font-semibold text-4xl">Pulse</span>
      </div>
      <div className="sm:w-[450px] w-[380px] backdrop-blur-md sm:p-10 p-5 py-8 rounded-lg">
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-5 [&_input]:placeholder:neutral-100 [&_.mantine-Input-input]:!border-white focus-within:[&_.mantine-Input-input]:!border-pink-400 [&_.mantine-Input-input]:!border 
        [&_input]:!pl-2 [&_svg]:text-white [&_input]:!text-white"
        >
          <div className="self-center font-medium font-heading text-white text-xl">
            Login
          </div>
          <TextInput
            {...form.getInputProps("email")}
            variant="unstyled"
            placeholder="Email"
            radius="md"
            size="md"
          />
          <PasswordInput
            {...form.getInputProps("password")}
            variant="unstyled"
            placeholder="Password"
            radius="md"
            size="md"
          />
          <Button
            loading={loading}
            radius="md"
            size="md"
            type="submit"
            color="pink"
          >
            Login
          </Button>
          <div className="text-neutral-100 text-sm self-center">
            Don't have an account?{" "}
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
