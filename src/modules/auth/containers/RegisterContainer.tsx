import { RegisterScreen } from "../screens";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AuthValidations } from "@validations";
import { useEffect } from "react";
import { AuthApis } from "@apis";
import { ROUTES } from "@constants";

export const RegisterContainer = () => {
  const navigate = useNavigate();
  const registerMutation = AuthApis.useRegister();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AuthValidations.FormRegisterType>({
    resolver: zodResolver(AuthValidations.FormRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!registerMutation.isSuccess) return;
    const message =
      (registerMutation.data as { message?: string } | undefined)?.message;
    toast.success(message ?? "Sign up successful. Please log in.");
    navigate(ROUTES.login);
  }, [registerMutation.isSuccess, registerMutation.data, navigate]);

  const onSubmit = async (values: AuthValidations.FormRegisterType) => {
    registerMutation.mutate({
      fullName: values.name,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <RegisterScreen
      register={register}
      handleSubmit={handleSubmit(onSubmit)}
      errors={errors}
      isSubmitting={registerMutation.isPending}
      registerError={registerMutation.error?.message ?? null}
    />
  );
};
