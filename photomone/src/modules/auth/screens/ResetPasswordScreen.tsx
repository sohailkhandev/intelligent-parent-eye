import { useNavigate } from "react-router-dom";
import { FormContainer } from "@components";
import { ResetPasswordForm } from "../components";
import { useLanguage } from "@providers";

export const ResetPasswordScreen = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const t = translations || {};
  const auth = t.auth || {};
  const resetPassword = auth.resetPassword || {};

  return (
    <FormContainer
      title={resetPassword.title || "Reset Password"}
      onClose={() => navigate(-1)}
      className="max-w-[700px]"
    >
      <ResetPasswordForm />
    </FormContainer>
  );
};

export default ResetPasswordScreen;
