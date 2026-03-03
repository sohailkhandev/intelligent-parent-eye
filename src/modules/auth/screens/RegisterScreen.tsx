import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { ValidatedInput, SubHeading, MainCard } from "@components";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthValidations } from "@validations";
import { ROUTES, COLORS } from "@constants";

interface RegisterScreenProps {
  register: UseFormRegister<AuthValidations.FormRegisterType>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => void;
  errors: FieldErrors<AuthValidations.FormRegisterType>;
  isSubmitting?: boolean;
  registerError?: string | null;
}

export const RegisterScreen = ({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  registerError,
}: RegisterScreenProps) => {
  return (
    <Box
      className="w-full px-4 flex flex-col min-h-[calc(100vh-8rem)] items-center justify-center"
      sx={{ minHeight: "calc(100vh - 8rem)" }}
    >
      <MainCard>
        {/* Already have an account? Login */}
        <Box
          className="text-center flex items-center justify-center gap-2 my-6"
          sx={{ color: COLORS.generalText }}
        >
          <span className="text-sm">Already have an account?</span>
          <Link
            to={ROUTES.login}
            className="!font-medium hover:opacity-90"
            style={{ color: COLORS.secondary, textDecoration: "none" }}
          >
            Login
          </Link>
        </Box>

        <Box
          component="form"
          className="flex flex-col gap-5 mt-6"
          onSubmit={handleSubmit}
        >
          <SubHeading
            title="Create your account"
            className="text-center mb-1"
          />

          <ValidatedInput
            label="Full name"
            type="text"
            placeholder="Enter your full name"
            required
            register={register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            variant="underline"
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

          <ValidatedInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            required
            register={register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            variant="underline"
          />

          {registerError && (
            <Box
              className="rounded-lg text-sm px-3 py-2"
              sx={{
                color: COLORS.secondary,
                border: `1px solid ${COLORS.secondary}`,
                backgroundColor: `${COLORS.secondary}12`,
              }}
            >
              {registerError}
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
                Signing up...
              </span>
            ) : (
              "Sign up"
            )}
          </button>
        </Box>
      </MainCard>
    </Box>
  );
};
