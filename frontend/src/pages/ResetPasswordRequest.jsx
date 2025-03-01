import { Formik } from "formik";
import * as Yup from "yup";
import api from "../services/api";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
});

export default function ResetPasswordRequest() {
  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await api.post("/auth/reset-password/request", values);
          alert("Reset instructions sent to email");
        } catch (error) {
          console.error(error);
        }
        setSubmitting(false);
      }}
    >
      {/* Form UI implementation */}
    </Formik>
  );
}
