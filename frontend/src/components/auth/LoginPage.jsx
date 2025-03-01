import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import AuthLayout from "../../components/layout/AuthLayout";

const LoginForm = () => {
  const { login } = useAuth();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      })}
      onSubmit={login}
    >
      {/* Form implementation with Material-UI components */}
    </Formik>
  );
};

export default function LoginPage() {
  return (
    <AuthLayout title="Sign In">
      <LoginForm />
    </AuthLayout>
  );
}
