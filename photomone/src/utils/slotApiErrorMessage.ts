export type SlotDetailErrors = {
  revealPointsFailed?: string;
  claimPointsFailed?: string;
  exposuresMinForReveal?: string;
  insufficientLockyForReveal?: string;
};

/** Maps known backend English messages to localized copy from slotDetail.errors. */
export function translateSlotApiError(
  message: string | undefined,
  errors: SlotDetailErrors | undefined,
  kind: "reveal" | "claim"
): string {
  const defaultReveal = errors?.revealPointsFailed ?? "Failed to reveal points";
  const defaultClaim = errors?.claimPointsFailed ?? "Failed to claim points";
  if (!message?.trim()) return kind === "claim" ? defaultClaim : defaultReveal;

  const lower = message.trim().toLowerCase();

  if (kind === "claim" && lower.includes("failed to claim points")) {
    return errors?.claimPointsFailed ?? message;
  }
  if (kind === "reveal" && lower.includes("failed to reveal points")) {
    return errors?.revealPointsFailed ?? message;
  }
  if (
    kind === "reveal" &&
    lower.includes("slot exposures") &&
    lower.includes("at least 20") &&
    lower.includes("reveal")
  ) {
    return errors?.exposuresMinForReveal ?? message;
  }
  if (
    kind === "reveal" &&
    lower.includes("locky") &&
    lower.includes("reveal") &&
    (lower.includes("need") || lower.includes("at least"))
  ) {
    return errors?.insufficientLockyForReveal ?? message;
  }

  return message;
}
