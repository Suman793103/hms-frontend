import { Menu, Text, Avatar } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile } from "../../Service/UserService";
import useProtectedImage from "../Utility/Dropzone/useProtectedImage";
import { setProfile } from "../../Slices/ProfileSlice";
import { useMediaQuery } from "@mantine/hooks";

const ProfileMenu = () => {
  const matches = useMediaQuery("(max-width: 768px)");
  const user = useSelector((state: any) => state.user);
  const profile = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || profile?.profilePictureId) return;
    getUserProfile(user.id)
      .then((data) => {
        dispatch(setProfile({ profilePictureId: data }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user, profile?.profilePictureId, dispatch]);

  const url = useProtectedImage(profile?.profilePictureId || null);

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <div className="flex items-center gap-3 cursor-pointer">
        {!matches &&
          <span className="font-medium text-lg text-neutral-900">
            {user.name}
          </span>}
          <Avatar variant="filled" src={url} size={40} alt="it's me" />
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item>
          <div className="flex items-center gap-2">
            <IconSettings size={14} />
            <span>Settings</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div className="flex items-center gap-2">
            <IconMessageCircle size={14} />
            <span>Messages</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div className="flex items-center gap-2">
            <IconPhoto size={14} />
            <span>Gallery</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              <IconSearch size={14} />
              <span>Search</span>
            </span>
            <Text size="xs" color="dimmed">
              ⌘K
            </Text>
          </div>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item>
          <div className="flex items-center gap-2">
            <IconArrowsLeftRight size={14} />
            <span>Transfer my data</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div className="flex items-center gap-2 text-red-600">
            <IconTrash size={14} />
            <span>Delete my account</span>
          </div>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
