import React, { useEffect } from "react";
import { ActionIcon, Button } from "@mantine/core";
import {
  IconBellRinging,
  IconLayoutSidebarLeftCollapseFilled,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useDispatch, useSelector } from "react-redux";
import { removeJwt } from "../../Slices/JwtSlice";
import { removeUser } from "../../Slices/UserSlice";
import SideDrawer from "../SideDrawer/SideDrawer";
import { useMediaQuery } from "@mantine/hooks";

const Header = () => {
  const jwt = useSelector((state: any) => state.jwt);
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log("Logging out");
    dispatch(removeJwt());
    dispatch(removeUser());
  };

  const matches = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full bg-light shadow-lg h-16 flex justify-between px-5 items-center">
      {matches && <SideDrawer />}
      <div></div>
      <div className="flex gap-5 items-center">
        {jwt ? <Button color="red" onClick={handleLogout}>Logout</Button>:<Link to="login">
          <Button className="">Login</Button>
        </Link>}
        {jwt && <>
        {/* <ActionIcon variant="transparent" size="md" aria-label="Settings">
          <IconBellRinging style={{ width: "90%", height: "90%" }} stroke={2} />
        </ActionIcon> */}
        <ProfileMenu /></>}
      </div>
    </div>
  );
};

export default Header;
