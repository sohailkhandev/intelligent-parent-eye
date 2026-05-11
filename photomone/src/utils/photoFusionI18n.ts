/** Normalize common English fusion API errors to localized `fuseFailed`. */
export function translateFusionFuseError(
  message: string,
  photoFusion: Record<string, string | undefined>
): string {
  const generic = photoFusion.fuseFailed ?? "Fusion failed. Please try again.";
  const m = message.trim();
  if (!m) return generic;
  const low = m.toLowerCase();
  if (
    low.includes("fusion failed") ||
    low.includes("self-fuse failed") ||
    low.includes("unable to fuse") ||
    low.includes("could not fuse") ||
    low.includes("failed to fuse")
  ) {
    return generic;
  }
  return m;
}

const ASSIGN_FAIL_EN =
  "Failed to assign photo to slot. Please try again.";

/** Map assign-to-fused-slot API errors to localized copy. */
export function translateAssignFusedPhotoError(
  message: string | undefined,
  assignFailed: string | undefined
): string {
  const generic = assignFailed ?? ASSIGN_FAIL_EN;
  const m = (message ?? "").trim();
  if (!m) return generic;
  const low = m.toLowerCase();
  if (
    m === ASSIGN_FAIL_EN ||
    low === ASSIGN_FAIL_EN.toLowerCase() ||
    low.includes("failed to assign photo to slot")
  ) {
    return generic;
  }
  return m;
}

/** Localized fused-slot badge (Primary, Secondary, etc.) by API slotNumber 1–4. */
export function getFusedSlotBadgeLabel(
  slotNumber: number | undefined | null,
  photoFusion: Record<string, string | undefined>,
  fallbackName?: string | null
): string {
  if (slotNumber == null || Number.isNaN(Number(slotNumber))) {
    return (fallbackName && String(fallbackName)) || "";
  }
  const n = Number(slotNumber);
  if (n >= 1 && n <= 4) {
    const k = `slotBadge${n}` as keyof typeof photoFusion;
    const v = photoFusion[k as string];
    if (v) return v;
  }
  return (fallbackName && String(fallbackName)) || "";
}
