import GenericForm from "@/components/Form/GenericForm";
import { profileFields } from "@/constants/user/Form/profileFields";

export default function ProfileInfo() {
  return (
    <>
      <div className="flex gap-2 items-center">
        <h1 className="text-2xl font-bold">Profile Information</h1>
        <p className="text-[#33A0FF] text-lg">Edit</p>
      </div>
      <GenericForm inputFields={profileFields} />
    </>
  );
}
