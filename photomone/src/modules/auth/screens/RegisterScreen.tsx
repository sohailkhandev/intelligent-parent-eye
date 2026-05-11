import { useNavigate } from "react-router-dom";
import { FormContainer } from "@components";
import { RegisterForm } from "../components";
import { useLanguage } from "@providers";

export const RegisterScreen = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const t = translations || {};
  const auth = t.auth || {};
  const register = auth.register || {};

  return (
    <FormContainer
      title={register.title || "Create your account"}
      onClose={() => navigate(-1)}
      className="max-w-[700px]"
    >
      <RegisterForm />
    </FormContainer>
  );
};

export default RegisterScreen;
