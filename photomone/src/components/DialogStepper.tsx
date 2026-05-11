import { Box, Typography } from "@mui/material";
import { Check } from "@mui/icons-material";
import { COLORS } from "@constants";

export interface DialogStepperStep {
  id: number;
  label: string;
  title: string;
}

const STEP_COMPLETED_COLOR = "#29C4D6";
const STEP_CIRCLE_BORDER = "#B0BEC5";
const STEP_LINE_COLOR = "#CFD8DC";
const STEP_TITLE_ACTIVE = "#26262C";
const STEP_TITLE_INACTIVE = "#90A4AE";

export interface DialogStepperProps {
  steps: DialogStepperStep[];
  currentStep: number;
  stepCompleted: (stepId: number) => boolean;
  /** No longer used – all steps show number (or checkmark when done) for consistent style */
  isStepLocked?: (stepId: number) => boolean;
}

export const DialogStepper = ({
  steps,
  currentStep,
  stepCompleted,
}: DialogStepperProps) => {
  return (
    <Box className="relative flex w-full">
      <Box
        className="h-px w-[69%] lg:w-[calc(100%-12em)] absolute top-[20px] lg:left-[6em] left-[15%] lg:right-0 right-[15%] self-center"
        sx={{
          background: `repeating-linear-gradient(90deg, ${STEP_LINE_COLOR} 0, ${STEP_LINE_COLOR} 3px, transparent 3px, transparent 6px)`,
        }}
      />
      {steps.map((step) => {
        const completed = stepCompleted(step.id);
        const isCurrent = currentStep === step.id;
        const completedOnly = completed && !isCurrent;
        const activeOrCompleted = completed || isCurrent;
        const titleColor = activeOrCompleted
          ? STEP_TITLE_ACTIVE
          : STEP_TITLE_INACTIVE;
        const titleBold = activeOrCompleted;

        return (
          <Box
            key={step.id}
            className="flex flex-1 flex-col w-full items-center min-w-0 px-0.5"
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box
              className="flex w-full items-center justify-center"
              sx={{ height: 40 }}
            >
              <Box
                className="flex-shrink-0 flex items-center justify-center rounded-full border-2"
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: completedOnly
                    ? STEP_COMPLETED_COLOR
                    : COLORS.white,
                  borderColor: completedOnly
                    ? STEP_COMPLETED_COLOR
                    : isCurrent
                      ? COLORS.primary
                      : STEP_CIRCLE_BORDER,
                }}
              >
                {completedOnly ? (
                  <Check sx={{ fontSize: 22, color: COLORS.white }} />
                ) : (
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: isCurrent ? COLORS.primary : STEP_CIRCLE_BORDER,
                    }}
                  >
                    {step.id}
                  </Typography>
                )}
              </Box>
            </Box>

            <Typography
              variant="body2"
              className="text-center block w-full text-sm"
              sx={{
                fontWeight: titleBold ? 700 : 400,
                color: titleColor,
                marginTop: 0.5,
                lineHeight: 1.3,
              }}
            >
              {step.title}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default DialogStepper;
