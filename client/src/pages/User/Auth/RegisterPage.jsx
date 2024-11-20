import GenericForm from "../../../components/Form/GenericForm";
import { registerFields } from "../../../constants/Form/registerFields";
import { registerUser } from "../../../api/auth";
import Modal from "../../../components/Modal/Modal";
import { useState } from "react";

function RegisterPage() {
  // const USERS_API = import.meta.env.VITE_USERS_API_BASE_URL;
  const [modalStatus, setModalStatus] = useState(false)
  return (
    <>
      <GenericForm inputFields={registerFields} apiFunction={registerUser} />
      {/* <button onClick={() => setModalStatus(true)}>open model</button>
      <Modal isOpen={modalStatus} onClose={() => setModalStatus(false)}>
      <p>This is the modal content.</p>
        <button
          onClick={() => alert("Action!")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Take Action
        </button>
      </Modal> */}
    </>
  );
}

export default RegisterPage;
