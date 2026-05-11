import { useNavigate } from "react-router-dom";
import { FormContainer } from "@components";
import { ForgotPasswordForm } from "../components";
import { useLanguage } from "@providers";

export const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const t = translations || {};
  const auth = t.auth || {};
  const forgotPassword = auth.forgotPassword || {};

  return (
    <FormContainer
      title={forgotPassword.title || "Forgot Password"}
      onClose={() => navigate(-1)}
      className="max-w-[700px]"
    >
      <ForgotPasswordForm />
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
