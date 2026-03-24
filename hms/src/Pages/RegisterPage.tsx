import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button, 
  SegmentedControl,
} from "@mantine/core";
import { IconAt, IconHeartbeat } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { registerUser } from "../Service/UserService";
import { errorNotification, successNotification } from "../Utility/NotificationUtil";

type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      role: "PATIENT",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      name:(value: string) => (!value ? "Name is Required": null),
      email: (value: string) =>
        (/^\S+@\S+$/.test(value) ? null : "Invalid email"),

      password: (value: string) => 
        !value
          ?"Password is required"
          : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(value)
          ?"Password must be 8-15 characters long, include upper & lowercase letters, a number, and a special character."
          : null,

      confirmPassword: (value: string, values: RegisterFormValues) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    registerUser(values).then((data) => {
      console.log(data)
      successNotification("Registered Successfully");
      navigate('/login');
    }).catch((error)=> {
      console.log(error)
      errorNotification(error.response.data.errorMessage);
    }).finally(()=>setLoading(false));
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
      <div className="sm:w-[450px] w-[380px] backdrop-blur-md sm:p-10 p-4 py-8 rounded-lg">
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-5 [&_input]:placeholder:neutral-100 [&_.mantine-Input-input]:!border-white focus-within:[&_.mantine-Input-input]:!border-pink-400 [&_.mantine-Input-input]:!border 
        [&_input]:!pl-2 [&_svg]:text-white [&_input]:!text-white"
        >
          <div className="self-center font-medium font-heading text-white text-xl">
            Register
          </div>
          <SegmentedControl
            {...form.getInputProps("role", { role: "input" })}
            fullWidth
            radius="md"
            color="pink"
            bg="none"
            className="[&_*]:!text-white border border-white"
            data={[
              { label: "Patient", value: "PATIENT" },
              { label: "Doctor", value: "DOCTOR" },
            ]}
          />
          <TextInput
            {...form.getInputProps("name")}
            variant="unstyled"
            placeholder="Name"
            radius="md"
            size="md"
          />
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
          <PasswordInput
            {...form.getInputProps("confirmPassword")}
            variant="unstyled"
            placeholder="confirmPassword"
            radius="md"
            size="md"
          />
          <Button loading={loading} radius="md" size="md" type="submit" color="pink">
            Register
          </Button>
          <div className="text-neutral-100 text-sm self-center">
            Have an account?{" "}
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
