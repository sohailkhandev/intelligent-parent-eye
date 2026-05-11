import { useNavigate } from "react-router-dom";
import { FormContainer } from "@components";
import { LoginForm } from "../components";
import { useLanguage } from "@providers";

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const t = translations || {};
  const auth = t.auth || {};
  const login = auth.login || {};

  return (
    <FormContainer
      title={login.title || "Login to your account"}
      onClose={() => navigate(-1)}
      className="max-w-[700px]"
    >
      <LoginForm />
    </FormContainer>
  );
};

export default LoginScreen;
