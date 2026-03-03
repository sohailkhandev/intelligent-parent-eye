import { LoginScreen } from "../screens";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthValidations } from "@validations";
import { useEffect } from "react";
import { AuthApis } from "@apis";
import { ROUTES } from "@constants";
import { useAuthContext } from "@providers";

export const LoginContainer = () => {
  const navigate = useNavigate();
  const { setAuthUser, setIsLoggedIn } = useAuthContext();
  const loginMutation = AuthApis.useLogin();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AuthValidations.FormLoginType>({
    resolver: zodResolver(AuthValidations.FormLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (loginMutation.isSuccess && loginMutation.data?.user) {
      const user = loginMutation.data.user as { fullName?: string; email?: string; code?: string; _id?: string };
      setAuthUser(user ? { _id: user._id ?? "", fullName: user.fullName ?? "", email: user.email ?? "", code: user.code ?? "" } : null);
      setIsLoggedIn(true);
      navigate(ROUTES.home);
    }
  }, [loginMutation.isSuccess, loginMutation.data, navigate, setAuthUser, setIsLoggedIn]);

  const onSubmit = async (values: AuthValidations.FormLoginType) => {
    loginMutation.mutate(values);
  };

  return (
    <LoginScreen
      register={register}
      handleSubmit={handleSubmit(onSubmit)}
      errors={errors}
      isSubmitting={loginMutation.isPending}
      loginError={loginMutation.error?.message ?? null}
    />
  );
};
