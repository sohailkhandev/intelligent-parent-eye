import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { ValidatedInput, SubHeading, MainCard } from "@components";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthValidations } from "@validations";
import { ROUTES, COLORS } from "@constants";

interface LoginScreenProps {
  register: UseFormRegister<AuthValidations.FormLoginType>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => void;
  errors: FieldErrors<AuthValidations.FormLoginType>;
  isSubmitting?: boolean;
  loginError?: string | null;
}

export const LoginScreen = ({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  loginError,
}: LoginScreenProps) => {
  return (
    <Box
      className="w-full px-4 flex flex-col min-h-[calc(100vh-20rem)] items-center justify-center"
      sx={{ minHeight: "calc(100vh - 20rem)" }}
    >
      <MainCard>
        {/* Don't have an account? Sign up - matches reference */}
        <Box
          className="text-center flex items-center justify-center gap-2 my-2"
          sx={{ color: COLORS.generalText }}
        >
          <span className="text-sm">Don&apos;t have an account?</span>
          <Link
            to={ROUTES.register}
            className="!font-medium hover:opacity-90"
            style={{ color: COLORS.secondary, textDecoration: "none" }}
          >
            Sign up
          </Link>
        </Box>

        <Box
          component="form"
          className="flex flex-col gap-5 mt-6"
          onSubmit={handleSubmit}
        >
          <SubHeading
            title="Sign in to your account"
            className="text-center mb-1"
          />

          <ValidatedInput
            label="E-mail"
            type="email"
            placeholder="Enter the e-mail"
            required
            register={register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            variant="underline"
          />

          <Box>
            <ValidatedInput
              label="Password"
              type="password"
              placeholder="Enter the password"
              required
              register={register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="underline"
            />
            {/* <Box className="flex justify-end mt-2">
              <Link
                to={ROUTES.forgotPassword}
                className="!font-poppins !font-medium !text-sm"
                style={{ color: COLORS.secondary, textDecoration: "none" }}
              >
                Forgot Password?
              </Link>
            </Box> */}
          </Box>

          {loginError && (
            <Box
              className="rounded-lg text-sm px-3 py-2"
              sx={{
                color: COLORS.secondary,
                border: `1px solid ${COLORS.secondary}`,
                backgroundColor: `${COLORS.secondary}12`,
              }}
            >
              {loginError}
            </Box>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full !mt-2 flex justify-center items-center py-3 px-4 text-white text-sm font-medium rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            style={{
              minHeight: "44px",
              background: COLORS.primary,
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                  style={{ animation: "spin 0.7s linear infinite" }}
                />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

        </Box>
      </MainCard>
    </Box>
  );
};
