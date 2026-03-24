import {
  Avatar,
  Button,
  Divider,
  Modal,
  NumberInput,
  Select,
  Table,
  TagsInput,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useSelector, useDispatch } from "react-redux";
import "react-phone-input-2/lib/style.css";
import { bloodGroup, bloodGroups } from "../../../Data/DropdownData";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { spawn } from "child_process";
import {
  getPatient,
  updatePatient,
} from "../../../Service/PatientProfileService";
import { formateDate } from "../../../Utility/DateUtility";
import { useForm } from "@mantine/form";

import {
  errorNotification,
  successNotification,
} from "../../../Utility/NotificationUtil";
import { arrayToCSV } from "../../../Utility/OtherUtility";
import { DropzoneButton } from "../../Utility/Dropzone/DropzoneButton";
import useProtectedImage from "../../Utility/Dropzone/useProtectedImage";
import { setProfile as setProfileAction } from "../../../Slices/ProfileSlice";

const Profile = () => {
  const matches = useMediaQuery("(max-width: 768px)");
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const [editMode, setEdit] = useState(false);
  const [profile, setProfile] = useState<any>({});
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    getPatient(user.profileId)
      .then((data) => {
        setProfile({
          ...data,
          allergies: data.allergies ? JSON.parse(data.allergies) : null,
          chronicDisease: data.chronicDisease
            ? JSON.parse(data.chronicDisease)
            : null,
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
      aadhaarNo: "",
      profilePictureId: "",
      bloodGroup: "",
      allergies: [],
      chronicDisease: [],
    },

    validate: {
      dob: (value: any) => (!value ? "Date of Birth is Required" : undefined),
      phone: (value: any) => (!value ? "Phone Number is Required" : undefined),
      address: (value: any) => (!value ? "Address is Required" : undefined),
      aadhaarNo: (value: any) =>
        !value ? "Aadhaar Number is Required" : undefined,
    },
  });

  const handleEdit = () => {
    form.setValues({
      ...profile,
      dob: profile.dob ? new Date(profile.dob) : undefined,
      chronicDisease: profile.chronicDisease ?? [],
      allergies: profile.allergies ?? [],
    });
    setEdit(true);
  };

  const handleSubmit = (e: any) => {
    let values = form.getValues();
    form.validate();
    if (!form.isValid()) return;
    updatePatient({
      ...profile,
      ...values,
      allergies: values.allergies ? JSON.stringify(values.allergies) : null,
      chronicDisease: values.chronicDisease
        ? JSON.stringify(values.chronicDisease)
        : null,
    })
      .then((data) => {
        successNotification("Profile Updated Successfully");
        setProfile({ ...profile, ...values });
        setLocalPreviewUrl(null);
        setEdit(false);
        // Update Redux profile state so ProfileMenu header gets the new picture
        dispatch(
          setProfileAction({ profilePictureId: values.profilePictureId })
        );
      })
      .catch((error) => {
        errorNotification(error.response.data.errorMessage);
      });
  };

  const url = useProtectedImage(profile.profilePictureId);

  const handleModalClose = () => {
    setLocalPreviewUrl(null);
    close();
  };

  return (
    <div className="md:p-10 p-5">
      <div className="flex lg:flex-row flex-col justify-between items-center">
        <div className="flex gap-5 items-center">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              variant="filled"
              src={localPreviewUrl || url}
              size={matches ? 120 : 150}
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
            <div className="md:text-xl text-lg text-neutral-700">
              {user.email}
            </div>
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
            Edit
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            size={matches ? "sm" : "lg"}
            type="submit"
            variant="filled"
          >
            Submit
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
              <Table.Td className="md:font-semibold md:text-xl text-lg font-medium">Aadhaar No</Table.Td>
              {editMode ? (
                <Table.Td className="md:text-xl text-lg">
                  <NumberInput
                    {...form.getInputProps("aadhaarNo")}
                    maxLength={12}
                    clampBehavior="strict"
                    hideControls
                    placeholder="Aadhaar No"
                  />
                </Table.Td>
              ) : (
                <Table.Td className="md:text-xl text-lg">
                  {profile.aadhaarNo ?? "-"}
                </Table.Td>
              )}
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="md:font-semibold md:text-xl text-lg font-medium">Blood Group</Table.Td>
              {editMode ? (
                <Table.Td className="md:text-xl text-lg">
                  <Select
                    {...form.getInputProps("bloodGroup")}
                    placeholder="Blood Group"
                    data={bloodGroups}
                  />
                </Table.Td>
              ) : (
                <Table.Td className="md:text-xl text-lg">
                  {bloodGroup[profile.bloodGroup] ?? "-"}
                </Table.Td>
              )}
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="md:font-semibold md:text-xl text-lg font-medium">Allergies</Table.Td>
              {editMode ? (
                <Table.Td className="md:text-xl text-lg">
                  <TagsInput
                    {...form.getInputProps("allergies")}
                    placeholder="Allergies seperated by Comma"
                  />
                </Table.Td>
              ) : (
                <Table.Td className="md:text-xl text-lg">
                  {arrayToCSV(profile.allergies) ?? "-"}
                </Table.Td>
              )}
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="md:font-semibold md:text-xl text-lg font-medium">
                Chronic Disease
              </Table.Td>
              {editMode ? (
                <Table.Td className="md:text-xl text-lg">
                  <TagsInput
                    {...form.getInputProps("chronicDisease")}
                    placeholder="Chronic Diseases seperated by Comma"
                  />
                </Table.Td>
              ) : (
                <Table.Td className="md:text-xl text-lg">
                  {arrayToCSV(profile.chronicDisease) ?? "-"}
                </Table.Td>
              )}
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <Modal
        centered
        opened={opened}
        onClose={handleModalClose}
        title={
          <span className="text-xl font-medium"> Upload Profile Picture</span>
        }
      >
        <DropzoneButton
          close={close}
          form={form}
          id="profilePictureId"
          onFileSelected={(file: File) =>
            setLocalPreviewUrl(URL.createObjectURL(file))
          }
        />
      </Modal>
    </div>
  );
};

export default Profile;
