import {
  Avatar,
  Button,
  Divider,
  Modal,
  NumberInput,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useSelector, useDispatch } from "react-redux";
import "react-phone-input-2/lib/style.css";
import {
  bloodGroups,
  doctorDepartments,
  doctorSpecializations,
} from "../../../Data/DropdownData";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { get } from "http";
import { getDoctor, updateDoctor } from "../../../Service/DoctorProfileService";
import { useForm } from "@mantine/form";
import {
  errorNotification,
  successNotification,
} from "../../../Utility/NotificationUtil";
import { formateDate } from "../../../Utility/DateUtility";
import { setProfile as setProfileAction } from "../../../Slices/ProfileSlice";

const Profile = () => {
  const matches = useMediaQuery("(max-width: 768px)");
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const [editMode, setEdit] = useState(false);
  const [profile, setProfile] = useState<any>({});
  useEffect(() => {
    getDoctor(user.profileId)
      .then((data) => {
        setProfile({
          ...data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const form = useForm({
    initialValues: {
      dob: "",
      phone: "",
      address: "",
      licenceNo: "",
      bloodGroup: "",
      specialization: "",
      department: "",
      totalExp: "",
    },

    validate: {
      dob: (value: any) => (!value ? "Date of Birth is Required" : undefined),
      phone: (value: any) => (!value ? "Phone Number is Required" : undefined),
      address: (value: any) => (!value ? "Address is Required" : undefined),
      licenceNo: (value: any) =>
        !value ? "Licence Number is Required" : undefined,
    },
  });

  const handleEdit = () => {
    form.setValues({
      ...profile,
      dob: profile.dob ? new Date(profile.dob) : undefined,
    });
    setEdit(true);
  };

  const handleSubmit = (e: any) => {
    let values = form.getValues();
    form.validate();
    if (!form.isValid()) return;
    const payload = {
      ...profile,
      ...values,
    };
    updateDoctor(payload)
      .then((_data) => {
        successNotification("Profile Updated Successfully");
        setProfile(payload);
        setEdit(false);
        // Update Redux profile state so ProfileMenu header gets the new picture
        dispatch(
          setProfileAction({ profilePictureId: payload.profilePictureId })
        );
      })
      .catch((error) => {
        errorNotification(
          error.response?.data?.errorMessage || "Failed to update profile"
        );
      });
  };

  return (
    <div className="md:p-10 p-5">
      <div className="flex lg:flex-row flex-col justify-between items-center">
        <div className="flex gap-5 items-center">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              variant="filled"
              src="/doctor.jpg"
              size={matches ? 120:150}
              alt="It's me"
            />
            {editMode && (
              <Button size="sm" onClick={open} variant="filled">
                Uplaod
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="md:text-3xl text-xl font-medium text-neutral-800">
              {user.name}
            </div>
            <div className="md:text-xl text-lg text-neutral-700">{user.email}</div>
          </div>
        </div>
        {!editMode ? (
          <Button
            size={matches ? "sm" : "lg"}
            type="button"
            onClick={handleEdit}
            variant="filled"
            leftSection={<IconEdit />}
          >
            {" "}
            Edit{" "}
          </Button>
        ) : (
          <Button
            size={matches ? "sm" : "lg"}
            onClick={handleSubmit}
            type="submit"
            variant="filled"
          >
            {" "}
            Submit{" "}
          </Button>
        )}
      </div>
      <Divider my="xl" />
      <div>
        <div className="text-2xl font-medium mb-5 text-neutral-900">
          Personal Information
        </div>
        <Table
          striped
          stripedColor="primary.1"
          verticalSpacing="md"
          withRowBorders={true}
        >
          <Table.Tbody className="[&>tr]:!mb-3 [&_td]:w-1/2">
            <Table.Tr>
              <Table.Td className="md:font-semibold md:text-xl text-lg font-medium">
                Date of Birth
              </Table.Td>
              {editMode ? (
                <Table.Td className="md:text-xl text-lg">
                  <DateInput
                    {...form.getInputProps("dob")}
                    placeholder="Date of Birth"
                  />
                </Table.Td>
              ) : (
                <Table.Td className="md:text-xl text-lg">
                  {formateDate(profile.dob) ?? "-"}
                </Table.Td>
              )}
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="md:font-semibold md:text-xl text-lg font-medium">Phone</Table.Td>
              {editMode ? (
                <Table.Td className="md:text-xl text-lg">
                  <PhoneInput
                    {...form.getInputProps("phone")}
                    placeholder="Phone Number"
                    country={"in"}
                  />
                </Table.Td>
              ) : (
                <Table.Td className="md:text-xl text-lg">{profile.phone ?? "-"}</Table.Td>
              )}
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="md:font-semibold md:text-xl text-lg font-medium">Address</Table.Td>
              {editMode ? (
                <Table.Td className="md:text-xl text-lg">
                  <TextInput
                    {...form.getInputProps("address")}
                    placeholder="Address"
                  />
                </Table.Td>
              ) : (
                <Table.Td className="md:text-xl text-lg">
                  {profile.address ?? "-"}
                </Table.Td>
              )}
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="md:font-semibold md:text-xl text-lg font-medium">Licence No</Table.Td>
              {editMode ? (
                <Table.Td className="md:text-xl text-lg">
                  <TextInput
                    {...form.getInputProps("licenceNo")}
                    placeholder="Licence No"
                  />
                </Table.Td>
              ) : (
                <Table.Td className="md:text-xl text-lg">
                  {profile.licenceNo ?? "-"}
                </Table.Td>
              )}
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="md:font-semibold md:text-xl text-lg font-medium">
                Specialization
              </Table.Td>
              {editMode ? (
                <Table.Td className="md:text-xl text-lg">
                  <Select
                    {...form.getInputProps("specialization")}
                    placeholder="Specialization"
                    data={doctorSpecializations}
                  />
                </Table.Td>
              ) : (
                <Table.Td className="md:text-xl text-lg">
                  {profile.specialization ?? "-"}
                </Table.Td>
              )}
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="md:font-semibold md:text-xl text-lg font-medium">Department</Table.Td>
              {editMode ? (
                <Table.Td className="md:text-xl text-lg">
                  <Select
                    {...form.getInputProps("department")}
                    placeholder="Department"
                    data={doctorDepartments}
                  />
                </Table.Td>
              ) : (
                <Table.Td className="md:text-xl text-lg">
                  {profile.department ?? "-"}
                </Table.Td>
              )}
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="md:font-semibold md:text-xl text-lg font-medium">Experience</Table.Td>
              {editMode ? (
                <Table.Td className="md:text-xl text-lg">
                  <NumberInput
                    {...form.getInputProps("totalExp")}
                    hideControls
                    placeholder="Total Experience"
                  />
                </Table.Td>
              ) : (
                <Table.Td className="md:text-xl text-lg">
                  {profile.totalExp ?? "-"}
                  {profile.totalExp ? " Years" : ""}
                </Table.Td>
              )}
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title={
          <span className="text-xl font-medium"> Upload Profile Picture</span>
        }
      ></Modal>
    </div>
  );
};

export default Profile;
