import { CheckIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";

const successNotification = (message: string) => {
  notifications.show({
    title: "Success",
    message: message,
    color: "teal",
    icon: <CheckIcon />,
    withCloseButton: true,
    withBorder: true,
    className: "!border-green-500",
  });
};

const errorNotification = (message: string) => {
  notifications.show({
    title: "Failed",
    message: message,
    color: "red",
    icon: <CheckIcon />,
    withCloseButton: true,
    withBorder: true,
    className: "!border-red-500",
  });
};

export { successNotification, errorNotification };
