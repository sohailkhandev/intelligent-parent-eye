import {
  Box,
  Typography,
  Alert,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  OutlineButton,
  MainDialog,
  MainButton,
  DialogStepper,
} from "@components";
import { Check, Close } from "@mui/icons-material";
import { useAuthContext, useAppContext, useLanguage } from "@providers";
import { SlotApis } from "@apis";
import { CameraIcon } from "@assets/icons/svg";
import { COLORS } from "@constants";

interface UploadPhotoDialogProps {
  open: boolean;
  onClose: () => void;
  slotNumber: number;
  slotId: string;
}

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/** Explicit list helps OS pickers surface WebP/HEIC; `image/*` alone is inconsistent. */
const FILE_INPUT_ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,.heic,.heif";

const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const ALLOWED_UPLOAD_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
]);

function isAllowedUploadImageFile(file: File): boolean {
  const type = (file.type || "").toLowerCase().trim();
  if (type && ALLOWED_UPLOAD_MIME_TYPES.has(type)) return true;

  const name = file.name || "";
  const ext = name.includes(".")
    ? name.slice(name.lastIndexOf(".") + 1).toLowerCase()
    : "";

  if (ext && ALLOWED_UPLOAD_EXTENSIONS.has(ext)) return true;

  if (type.startsWith("image/")) return false;

  return false;
}

function getCroppedExportMimeType(sourceType: string): {
  mime: string;
  ext: string;
} {
  const t = (sourceType || "").toLowerCase();
  if (t === "image/png") return { mime: "image/png", ext: ".png" };
  if (t === "image/webp") return { mime: "image/webp", ext: ".webp" };
  // HEIC/HEIF and encoders: browsers cannot re-encode as HEIC from canvas; use JPEG.
  return { mime: "image/jpeg", ext: ".jpg" };
}

/** Backend daily cap — choosing another photo does not help. */
function isDailyAiGenerationLimitMessage(
  message: string | undefined | null
): boolean {
  if (!message) return false;
  const s = message.toLowerCase();
  return (
    s.includes("daily ai photo generation limit") ||
    (s.includes("daily") &&
      s.includes("ai") &&
      s.includes("photo") &&
      s.includes("generation limit"))
  );
}

export const UploadPhotoDialog = ({
  open,
  onClose,
  slotNumber,
  slotId,
}: UploadPhotoDialogProps) => {
  const { authUser } = useAuthContext();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const uploadMutation = SlotApis.useGeneratePhotos();
  const uploadSelectedMutation = SlotApis.useUploadSelectedPhotoToSlot();

  const t = translations || {};
  const home = t.home || {};
  const uploadDialog = home.uploadDialog || {};
  const stepper = uploadDialog.stepper || {};
  const uploadSteps = [
    {
      id: 1,
      label: stepper.step1Label || "STEP 1",
      title: stepper.step1Title || "Choose",
    },
    {
      id: 2,
      label: stepper.step2Label || "STEP 2",
      title: stepper.step2Title || "Crop",
    },
    {
      id: 3,
      label: stepper.step3Label || "STEP 3",
      title: stepper.step3Title || "Validate",
    },
    {
      id: 4,
      label: stepper.step4Label || "STEP 4",
      title: stepper.step4Title || "Select",
    },
  ];

  const [file, setFile] = useState<File | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [selectedGeneratedKey, setSelectedGeneratedKey] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  // Step derivation: 1 = Choose, 2 = Crop, 3 = Validate, 4 = Select
  const currentStep: 1 | 2 | 3 | 4 = showCropper
    ? 2
    : file && !showCropper
      ? result?.final === "valid"
        ? 4
        : 3
      : 1;
  const step1Done = !!file || showCropper;
  const step2Done = !!file && !showCropper;
  const step3Done = result?.final === "valid";
  const stepCompleted = (step: number) =>
    step === 1
      ? step1Done
      : step === 2
        ? step2Done
        : step === 3
          ? step3Done
          : false;

  // Helper function to normalize backend error messages
  const normalizeErrorMessage = (errorMessage: string): string => {
    if (!errorMessage) return errorMessage;

    const errorLower = errorMessage.toLowerCase();

    // Check if it's a gender mismatch error
    if (errorLower.includes("gender mismatch")) {
      const genderMismatch = uploadDialog.genderMismatch || {};

      // Extract the required gender from the error message
      // Try multiple patterns: "must be Female", "must be Male", "must be female", "must be male"
      let requiredGender = "";
      if (
        errorLower.includes("must be female") ||
        errorMessage.includes("Female")
      ) {
        requiredGender = translateDetectedGender("female");
      } else if (
        errorLower.includes("must be male") ||
        errorMessage.includes("Male")
      ) {
        requiredGender = translateDetectedGender("male");
      }

      // If we found the required gender, use the specific message
      if (requiredGender) {
        const messageTemplate =
          genderMismatch.message ||
          "Gender mismatch. The person in the photo must be {gender}.";
        return messageTemplate.replace("{gender}", requiredGender);
      }

      // Fallback to generic gender mismatch message
      return (
        genderMismatch.generic ||
        "Gender mismatch. The person in the photo does not match the required gender."
      );
    }

    // Check if it's a validation error message
    if (
      errorLower.includes("image validation failed") ||
      errorLower.includes("validation failed")
    ) {
      // Use the translated validation error message
      return (
        uploadDialog.validationFailed ||
        "Photo validation failed. The photo must contain one clear, visible face to the camera."
      );
    }

    // Replace "Image" with "Photo" and "image" with "photo"
    let normalized = errorMessage
      .replace(/Image validation failed/gi, "Photo validation failed")
      .replace(/image validation failed/gi, "photo validation failed")
      .replace(/The image must/gi, "The photo must")
      .replace(/the image must/gi, "the photo must")
      .replace(/close to the camera/gi, "to the camera");

    return normalized;
  };

  // Helper function to translate detected gender
  const translateDetectedGender = (
    gender: string | null | undefined
  ): string => {
    if (!gender) return "";
    const genderLower = gender.toLowerCase();
    const aiAnalysis = uploadDialog.aiAnalysis || {};

    if (genderLower === "male") {
      return aiAnalysis.male || "Male";
    } else if (genderLower === "female") {
      return aiAnalysis.female || "Female";
    } else if (genderLower === "human") {
      return aiAnalysis.human || "Human";
    }
    return gender;
  };

  // Handle mutation results
  useEffect(() => {
    if (uploadMutation.isSuccess) {
      const responseData = uploadMutation.data as any;
      const images = responseData?.data?.images ?? [];
      setResult({ final: "valid", images });
      setSelectedGeneratedKey(null);
    }
    if (uploadMutation.isError) {
      const error = uploadMutation.error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const backendMessage =
        error?.response?.data?.message || error?.message || "";
      const message =
        normalizeErrorMessage(backendMessage) ||
        uploadDialog.failedToUpload ||
        "Failed to upload photo";
      setResult({
        final: "invalid",
        reason: message,
      });
      showToast(message, "error");
    }
  }, [
    uploadMutation.isSuccess,
    uploadMutation.isError,
    uploadMutation.error,
    uploadMutation.data,
    showToast,
    uploadDialog,
  ]);

  const handleClearSelection = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setFile(null);
    setOriginalFile(null);
    setPreviewUrl(null);
    setResult(null);
    setSelectedGeneratedKey(null);
    setFileSizeError(null);
    setShowCropper(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Clear previous validation result/errors FIRST
      setResult(null);
      setFileSizeError(null);

      // Check file size (max 4MB)
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
        const errorMsg = uploadDialog.fileSizeError
          ? uploadDialog.fileSizeError
              .replace("{fileSizeMB}", fileSizeMB)
              .replace("{maxSizeMB}", MAX_FILE_SIZE_MB.toString())
          : `File size (${fileSizeMB}MB) exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB}MB. Please choose a smaller image.`;
        setFileSizeError(errorMsg);
        // Clear the file input
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (!isAllowedUploadImageFile(selectedFile)) {
        setFileSizeError(
          uploadDialog.unsupportedFileFormat ||
            "This file type is not supported. Please use PNG, JPG, JPEG, WebP, or HEIC."
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Revoke old preview URL before creating new one
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      // Store original file and create preview URL
      setOriginalFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      previewUrlRef.current = url;
      setPreviewUrl(url);
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Function to create cropped image
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    originalFile: File
  ): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Set canvas size to match cropped area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped portion of the image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    const { mime, ext } = getCroppedExportMimeType(originalFile.type);
    const baseName =
      (originalFile.name || "cropped-image").replace(/\.[^.]+$/, "") ||
      "cropped-image";
    const outName = `${baseName}${ext}`;

    return new Promise<File>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          const croppedFile = new File([blob], outName, {
            type: mime,
            lastModified: Date.now(),
          });
          resolve(croppedFile);
        },
        mime,
        mime === "image/jpeg" ? 0.95 : undefined
      );
    });
  };

  const handleCropComplete = async () => {
    if (!previewUrl || !croppedAreaPixels || !originalFile) return;

    try {
      const croppedFile = await getCroppedImg(
        previewUrl,
        croppedAreaPixels,
        originalFile
      );

      // Revoke old preview URL
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      // Create new preview URL from cropped file
      const croppedPreviewUrl = URL.createObjectURL(croppedFile);
      previewUrlRef.current = croppedPreviewUrl;

      setFile(croppedFile);
      setPreviewUrl(croppedPreviewUrl);
      setShowCropper(false);
      setCroppedAreaPixels(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      showToast(
        uploadDialog.failedToCrop || "Failed to crop image. Please try again.",
        "error"
      );
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    try {
      // Generate photos (POST /slots/generate-photos: image, gender, ageGroup)
      uploadMutation.mutate({
        image: file,
        gender: authUser?.gender || "male",
        ageGroup: authUser?.ageGroup || "26-35",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setResult({
        final: "invalid",
        reason: uploadDialog.failedToUploadImage || "Error uploading image",
      });
      showToast(
        uploadDialog.failedToUploadImage ||
          "Failed to upload image. Please try again.",
        "error"
      );
    }
  };

  const handleClose = () => {
    // In step 4, when cancel/close: send slotId "" with same body (all images "unused")
    if (currentStep === 4 && result?.images?.length) {
      const imagesWithUnused = (
        result.images as { imageUrl: string; s3Key: string; status: string }[]
      ).map((img) => ({ ...img, status: "unused" }));
      uploadSelectedMutation.mutate({ slotId: "", images: imagesWithUnused });
    }
    handleClearSelection();
    onClose();
  };

  return (
    <MainDialog
      open={open}
      onClose={handleClose}
      title={`${uploadDialog.generateForSlot || "Generate for Slot"} ${slotNumber}`}
      maxWidth="md"
    >
      <Box className="space-y-6 mt-6" data-slot-id={slotId}>
        <DialogStepper
          steps={uploadSteps}
          currentStep={currentStep}
          stepCompleted={stepCompleted}
          isStepLocked={(id) => id === 4 && !step3Done}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-[200px]"
          >
            {/* Step 1: Choose Photo */}
            {currentStep === 1 && !showCropper && !file && (
              <Box
                className="py-8 rounded-xl border-2 border-dashed mb-4 transition-colors hover:bg-[#FA949D08]"
                sx={{
                  borderColor: COLORS.secondary,
                  backgroundColor: `${COLORS.secondary}08`,
                }}
              >
                <Box
                  component="label"
                  className="flex flex-col items-center w-full cursor-pointer"
                >
                  <Box className="flex flex-col items-center gap-0">
                    <Box sx={{ color: COLORS.primary }}>
                      <CameraIcon />
                    </Box>
                    <Typography
                      variant="body1"
                      className="font-semibold text-base "
                      sx={{ color: COLORS.generalText }}
                    >
                      {uploadDialog.clickToChoose || "Choose a photo"}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-sm leading-5 font-normal"
                      sx={{ color: COLORS.grayStrong }}
                    >
                      {uploadDialog.fileFormats ||
                        "PNG, JPG, JPEG, WebP, HEIC, up to"}{" "}
                      {MAX_FILE_SIZE_MB}MB
                    </Typography>
                    <MainButton
                      className="mt-4 min-w-[140px]"
                      onClick={(e) => {
                        e?.preventDefault();
                        e?.stopPropagation();
                        if (previewUrlRef.current) {
                          URL.revokeObjectURL(previewUrlRef.current);
                          previewUrlRef.current = null;
                        }
                        setResult(null);
                        setFile(null);
                        setPreviewUrl(null);
                        setFileSizeError(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                          fileInputRef.current.click();
                        }
                      }}
                    >
                      {uploadDialog.choose || "Choose"}
                    </MainButton>
                  </Box>
                  <input
                    type="file"
                    accept={FILE_INPUT_ACCEPT}
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </Box>
              </Box>
            )}

            {/* File Size Error - show in step 1 or 2 */}
            {fileSizeError && (
              <Alert
                severity="error"
                className="!rounded-[10px] !bg-transparent mb-4"
                sx={{ border: "2px solid #DE1C39", color: "white" }}
                onClose={() => setFileSizeError(null)}
              >
                <Typography
                  variant="body2"
                  className="font-medium text-[#DE1C39]"
                >
                  {fileSizeError}
                </Typography>
              </Alert>
            )}

            {/* Step 2: Crop */}
            {currentStep === 2 && showCropper && previewUrl && (
              <Box className="">
                <Box className="relative w-full h-[calc(100vh-400px)] overflow-hidden mb-4">
                  <Cropper
                    image={previewUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape="rect"
                    showGrid={true}
                    style={{
                      containerStyle: {
                        backgroundColor: "transparent",
                      },
                      cropAreaStyle: {
                        border: `2px solid ${COLORS.primary}`,
                        boxShadow: "none",
                      },
                    }}
                  />
                </Box>
                <Box className="flex gap-4 justify-center items-center mt-4">
                  <IconButton
                    onClick={handleCropComplete}
                    disabled={!croppedAreaPixels}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: croppedAreaPixels
                        ? COLORS.primary
                        : COLORS.grayLight,
                      border: "none",
                      color: COLORS.black,
                      "&:hover": {
                        backgroundColor: croppedAreaPixels
                          ? COLORS.primary
                          : COLORS.grayLight,
                        opacity: croppedAreaPixels ? 0.9 : 1,
                      },
                      "&:disabled": {
                        opacity: 0.6,
                        cursor: "not-allowed",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Check sx={{ fontSize: 24 }} />
                  </IconButton>
                  <IconButton
                    onClick={handleClearSelection}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: COLORS.secondary,
                      border: "none",
                      color: COLORS.black,
                      "&:hover": {
                        backgroundColor: COLORS.secondary,
                        opacity: 0.9,
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Close sx={{ fontSize: 24 }} />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* Step 3: Validate - preview with turquoise border, filename at bottom (not full width) */}
            {currentStep === 3 && previewUrl && !showCropper && file && (
              <Box className="mb-4 flex justify-center">
                <Box
                  className="relative max-w-[280px] rounded-lg overflow-hidden bg-white"
                  sx={{
                    border: `2px solid ${COLORS.primary}`,
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-h-64 object-contain block"
                    style={{ display: "block" }}
                  />
                  <Box
                    className="absolute bottom-0 left-0 right-0 flex justify-center items-end text-center pb-2 pt-8"
                    sx={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: COLORS.white,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      {file?.name}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {currentStep === 3 && uploadMutation.isPending && (
              <Box
                className="p-4 rounded-xl mb-4"
                sx={{
                  backgroundColor: COLORS.white,
                  border: `1px solid ${COLORS.primary}`,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  className="text-center mb-2"
                  sx={{ color: COLORS.generalText, fontWeight: 500 }}
                >
                  {uploadDialog.validatingAndGenerating ||
                    "Validating and Generating"}
                </Typography>
                <LinearProgress
                  variant="indeterminate"
                  className="rounded-full mt-2"
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: COLORS.grayLight,
                    "& .MuiLinearProgress-bar": {
                      background: `linear-gradient(90deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)`,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            )}

            {/* Results Section (step 3) */}
            {currentStep === 3 && result && (
              <Box className="mb-4">
                {result.final === "invalid" &&
                  (() => {
                    const invalidMsg =
                      result.reason ||
                      uploadDialog.validationFailed ||
                      "Photo validation failed. The photo must contain one clear, visible face to the camera.";
                    const hideChooseAnotherPhoto =
                      isDailyAiGenerationLimitMessage(invalidMsg);
                    return (
                      <Alert
                        severity="error"
                        className="!rounded-[10px] !bg-transparent"
                        sx={{
                          border: "2px solid #0D9DFD1F",
                          color: "white",
                        }}
                        icon={
                          <Box
                            component="span"
                            className="text-[#DE1C39] text-xl"
                          >
                            !
                          </Box>
                        }
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            className={`font-medium text-[#DE1C39] ${hideChooseAnotherPhoto ? "" : "mb-3"}`}
                          >
                            {invalidMsg}
                          </Typography>
                          {!hideChooseAnotherPhoto && (
                            <OutlineButton
                              onClick={() => {
                                handleClearSelection();
                                fileInputRef.current?.click();
                              }}
                              className="!rounded-full py-2 px-4 text-sm w-full max-w-[220px] mx-auto !border-[#0D9DFD] !text-[#0D9DFD] hover:!bg-[rgba(13,157,253,0.1)]"
                            >
                              {uploadDialog.chooseAnother ||
                                "Choose Another Photo"}
                            </OutlineButton>
                          )}
                        </Box>
                      </Alert>
                    );
                  })()}
              </Box>
            )}

            {/* Action Buttons - Step 3: Validate & Upload (Main) + Cancel (Outline), horizontal */}
            {currentStep === 3 &&
              !showCropper &&
              file &&
              previewUrl &&
              result?.final !== "invalid" && (
                <Box className="flex gap-3 justify-center items-center flex-wrap max-w-[500px] mx-auto mt-6 lg:mt-10 mb-2">
                  <OutlineButton
                    onClick={handleClearSelection}
                    className="!rounded-full py-2.5 px-2 flex-1"
                  >
                    {uploadDialog.cancel || "Cancel"}
                  </OutlineButton>
                  <MainButton
                    disabled={!file || uploadMutation.isPending}
                    onClick={handleUpload}
                    className="!rounded-full py-2.5 px-0 flex-1 min-w-[120px]"
                  >
                    {uploadMutation.isPending
                      ? uploadDialog.loading || "Loading..."
                      : uploadDialog.generate || "Generate"}
                  </MainButton>
                </Box>
              )}

            {/* Step 4: Select generated photo to upload */}
            {currentStep === 4 && result?.images?.length > 0 && (
              <Box className="py-6">
                <Typography
                  variant="body1"
                  className="text-center mb-6"
                  sx={{ color: COLORS.generalText, fontWeight: 600 }}
                >
                  {uploadDialog.selectPhotoToUpload ||
                    "Select a photo to upload"}
                </Typography>
                <Box className="flex gap-4 justify-center items-stretch flex-wrap">
                  {(
                    result.images as {
                      imageUrl: string;
                      s3Key: string;
                      status: string;
                    }[]
                  ).map((img, index) => {
                    const selectionKey = img.s3Key || img.imageUrl || String(index);
                    const isSelected = selectedGeneratedKey === selectionKey;
                    return (
                      <Box
                        key={selectionKey}
                        onClick={() => setSelectedGeneratedKey(selectionKey)}
                        className="relative rounded-xl overflow-hidden cursor-pointer flex-1 min-w-[140px] max-w-[220px] aspect-square"
                        sx={{
                          border: `2px solid ${isSelected ? COLORS.primary : COLORS.grayLight}`,
                          borderRadius: 2,
                          boxShadow: isSelected
                            ? `0 0 0 2px ${COLORS.primary}33`
                            : "none",
                          "&:hover": {
                            borderColor: isSelected
                              ? COLORS.primary
                              : COLORS.grayStrong,
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={img.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <Box
                            className="absolute inset-0 flex items-center justify-center"
                            sx={{
                              backgroundColor: "rgba(0,0,0,0.2)",
                              zIndex: 2,
                            }}
                          >
                            <Box
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              sx={{ backgroundColor: COLORS.primary }}
                            >
                              <Check
                                sx={{ fontSize: 24, color: COLORS.white }}
                              />
                            </Box>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
                <Box className="flex gap-3 justify-center items-center flex-wrap max-w-[500px] mx-auto mt-10">
                  <OutlineButton
                    onClick={handleClose}
                    disabled={uploadSelectedMutation.isPending}
                    className="!rounded-full py-2.5 px-6 flex-1"
                  >
                    {uploadDialog.cancel || "Cancel"}
                  </OutlineButton>
                  <MainButton
                    disabled={
                      selectedGeneratedKey == null ||
                      uploadSelectedMutation.isPending
                    }
                    onClick={() => {
                      const allImages = result.images as {
                        imageUrl: string;
                        s3Key: string;
                        status: string;
                      }[];
                      const selectedIndex = allImages.findIndex(
                        (img, i) =>
                          (img.s3Key || img.imageUrl || String(i)) ===
                          selectedGeneratedKey
                      );
                      if (selectedIndex < 0) return;
                      const images = (
                        allImages
                      ).map((img, i) => ({
                        ...img,
                        status:
                          i === selectedIndex ? "used" : "unused",
                      }));
                      uploadSelectedMutation.mutate(
                        { slotId, images },
                        {
                          onSuccess: () => {
                            showToast(
                              uploadDialog.photoUploadedSuccess ||
                                "Photo uploaded successfully",
                              "success"
                            );
                            handleClose();
                          },
                          onError: (error: {
                            response?: { data?: { message?: string } };
                            message?: string;
                          }) => {
                            const msg =
                              error?.response?.data?.message ||
                              error?.message ||
                              uploadDialog.failedToUpload ||
                              "Failed to upload photo";
                            showToast(msg, "error");
                          },
                        }
                      );
                    }}
                    className="!rounded-full py-2.5 px-6 flex-1"
                  >
                    {uploadSelectedMutation.isPending
                      ? uploadDialog.uploadingButton || "Uploading..."
                      : uploadDialog.upload || "Upload"}
                  </MainButton>
                </Box>
              </Box>
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </MainDialog>
  );
};

export default UploadPhotoDialog;
