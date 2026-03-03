import { AuthService } from "@services";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => useMutation({ mutationFn: AuthService.login });
export const useRegister = () => useMutation({ mutationFn: AuthService.register });