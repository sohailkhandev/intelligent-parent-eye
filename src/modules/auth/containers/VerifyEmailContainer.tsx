import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthApis } from "@apis";
import { ROUTES } from "@constants";
import { useAuthContext } from "@providers";
import { VerifyEmailScreen } from "../screens";

const SUCCESS_REDIRECT_DELAY_MS = 2200;

const formatVerificationError = (errorCode: string) => {
  switch (errorCode) {
    case "invalid_or_expired_token":
      return "This verification link is invalid or has expired.";
    case "already_verified":
      return "This email has already been verified.";
    default:
      return errorCode
        .split("_")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
};

export const VerifyEmailContainer = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const { refreshAuthUser, setAuthUser, setIsLoggedIn } = useAuthContext();
  const hasRequestedRef = useRef(false);
  const [redirectSeconds, setRedirectSeconds] = useState(
    Math.ceil(SUCCESS_REDIRECT_DELAY_MS / 1000),
  );
  const queryToken = searchParams.get("token");
  const verificationToken = token ?? queryToken ?? undefined;
  const errorCode = searchParams.get("error");
  const queryMessage = searchParams.get("message");
  const successFromQuery =
    searchParams.get("success") === "true" ||
    searchParams.get("verified") === "true" ||
    searchParams.get("status") === "success";

  const { mutate, isPending, isSuccess, isError, data, error } =
    AuthApis.useVerifyEmail();

  useEffect(() => {
    if (!verificationToken || errorCode || successFromQuery || hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;
    mutate(verificationToken);
  }, [errorCode, mutate, successFromQuery, verificationToken]);

  useEffect(() => {
    if (errorCode || (!isSuccess && !successFromQuery)) {
      return;
    }

    let isCancelled = false;
    let redirectTimeout: number | undefined;
    let countdownInterval: number | undefined;

    const syncAuthAndRedirect = async () => {
      setRedirectSeconds(Math.ceil(SUCCESS_REDIRECT_DELAY_MS / 1000));

      if (isSuccess && data?.parent) {
        if (!isCancelled) {
          setAuthUser(data.parent);
          setIsLoggedIn(true);
        }
      } else if (localStorage.getItem("token")) {
        await refreshAuthUser();
      }

      if (isCancelled) {
        return;
      }

      countdownInterval = window.setInterval(() => {
        setRedirectSeconds((current) => (current > 1 ? current - 1 : current));
      }, 1000);

      redirectTimeout = window.setTimeout(() => {
        navigate(ROUTES.home);
      }, SUCCESS_REDIRECT_DELAY_MS);
    };

    void syncAuthAndRedirect();

    return () => {
      isCancelled = true;

      if (countdownInterval) {
        window.clearInterval(countdownInterval);
      }

      if (redirectTimeout) {
        window.clearTimeout(redirectTimeout);
      }
    };
  }, [
    data,
    errorCode,
    isSuccess,
    navigate,
    refreshAuthUser,
    setAuthUser,
    setIsLoggedIn,
    successFromQuery,
  ]);

  const screenState = useMemo(() => {
    if (errorCode) {
      return {
        status: "error" as const,
        title: "We could not verify your email",
        message:
          queryMessage ??
          formatVerificationError(errorCode),
        helperText:
          "This link may have expired, already been used, or been opened from an incomplete redirect.",
        actionLabel: "Back to login",
        onAction: () => navigate(ROUTES.login),
      };
    }

    if (!verificationToken && !successFromQuery) {
      return {
        status: "error" as const,
        title: "Invalid verification link",
        message:
          "This verification link is incomplete. Please request a new email and try again.",
        helperText: "Return to login to request a fresh verification email.",
        actionLabel: "Go to login",
        onAction: () => navigate(ROUTES.login),
      };
    }

    if (isSuccess || successFromQuery) {
      return {
        status: "success" as const,
        title: "Email verified successfully",
        message:
          queryMessage ??
          data?.message ??
          "Your account is now verified and ready to use.",
        helperText: `Redirecting to your dashboard in ${redirectSeconds}s...`,
        actionLabel: "Open dashboard now",
        onAction: () => navigate(ROUTES.home),
      };
    }

    if (isError) {
      return {
        status: "error" as const,
        title: "We could not verify your email",
        message:
          error?.message ??
          "This link may have expired or has already been used.",
        helperText:
          "You can head back to login and request another verification email if needed.",
        actionLabel: "Back to login",
        onAction: () => navigate(ROUTES.login),
      };
    }

    return {
      status: "pending" as const,
      title: "Checking your verification link",
      message:
        "We are securely confirming your email with Parent Eye. This should only take a moment.",
      helperText: isPending
        ? "Please keep this tab open while we complete verification."
        : "Preparing verification...",
      actionLabel: undefined,
      onAction: undefined,
    };
  }, [
    data,
    error?.message,
    errorCode,
    isError,
    isPending,
    isSuccess,
    navigate,
    queryMessage,
    redirectSeconds,
    successFromQuery,
    verificationToken,
  ]);

  return <VerifyEmailScreen {...screenState} />;
};

export default VerifyEmailContainer;
