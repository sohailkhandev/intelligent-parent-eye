import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SettingsApis } from "@apis";
import { useAuthContext } from "@providers";
import { AuthService } from "@services";
import { SettingsScreen } from "./SettingsScreen";

export const SettingsContainer = () => {
  const queryClient = useQueryClient();
  const { authUser, setAuthUser } = useAuthContext();
  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const updateProfileMutation = SettingsApis.useUpdateParentProfile();

  useEffect(() => {
    setFullName(authUser?.fullName ?? "");
    setFullNameError(null);
  }, [authUser?.fullName]);

  const isSaveDisabled = useMemo(() => {
    const trimmedName = fullName.trim();
    return (
      updateProfileMutation.isPending ||
      !trimmedName ||
      trimmedName === (authUser?.fullName ?? "").trim()
    );
  }, [authUser?.fullName, fullName, updateProfileMutation.isPending]);

  const handleSubmit = async () => {
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setFullNameError("Full name is required.");
      return;
    }

    setFullNameError(null);

    try {
      await updateProfileMutation.mutateAsync({
        fullName: trimmedName,
      });

      const freshProfile = await AuthService.getMe();
      setAuthUser(freshProfile.parent);
      queryClient.setQueryData(["parentMe"], freshProfile);
    } catch {
      // Global API toasts already surface the failure.
    }
  };

  return (
    <SettingsScreen
      connectionCode={authUser?.code ?? "—"}
      email={authUser?.email ?? "—"}
      fullName={fullName}
      fullNameError={fullNameError}
      isSaveDisabled={isSaveDisabled}
      isSubmitting={updateProfileMutation.isPending}
      onFullNameChange={(value) => {
        setFullName(value);
        if (fullNameError) {
          setFullNameError(null);
        }
      }}
      onSubmit={handleSubmit}
    />
  );
};
