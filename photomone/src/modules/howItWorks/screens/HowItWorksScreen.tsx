import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { COLORS } from "@constants";
import {
  HeroHeading,
  LabelBadge,
  ThemeText,
  MainHeading,
  CheckListItem,
} from "@components";
import heroBg from "@assets/images/heroBg.png";
import { useLanguage } from "@providers";

/** Inline emphasis in body copy — max 600 weight (avoids browser default bold heavier than app headings). */
const Em = ({ children }: { children: ReactNode }) => (
  <Box component="span" sx={{ fontWeight: 600, color: "inherit" }}>
    {children}
  </Box>
);

type PageSection = Record<string, string | string[] | undefined>;
type TextSection = Record<string, string | undefined>;
type DeleteAccountSection = {
  heading?: string;
  intro?: string;
  agree?: string;
  removedBefore?: string;
  removedEm?: string;
  removedAfter?: string;
  dataItems?: string[];
  cannotBefore?: string;
  cannotEm?: string;
  cannotAfter?: string;
};

export const HowItWorksScreen = () => {
  const { translations } = useLanguage();
  const rawPage = translations?.howItWorks?.page;
  const p: Record<string, PageSection> =
    rawPage != null && typeof rawPage === "object" && !Array.isArray(rawPage)
      ? (rawPage as Record<string, PageSection>)
      : {};

  /** Same tab name as sidebar / dashboard nav; keeps copy in sync with `sidebar.mone`. */
  const sidebarTabName = translations?.sidebar?.mone as string | undefined;

  const hero = (p.hero ?? {}) as TextSection;
  const signUp = (p.signUp ?? {}) as TextSection;
  const createProfile = p.createProfile ?? {};
  const uploadPhoto = (p.uploadPhoto ?? {}) as TextSection;
  const purchasePhotos = (p.purchasePhotos ?? {}) as TextSection;
  const sellPhotos = (p.sellPhotos ?? {}) as TextSection;
  const photoFusion = (p.photoFusion ?? {}) as TextSection;
  const checkResults = (p.checkResults ?? {}) as TextSection;
  const redeemGiftCards = (p.redeemGiftCards ?? {}) as TextSection;
  const purchasePackages = (p.purchasePackages ?? {}) as TextSection;
  const editProfile = (p.editProfile ?? {}) as TextSection;
  const deleteAccount = (p.deleteAccount ?? {}) as DeleteAccountSection;

  const profileFields: string[] =
    Array.isArray(createProfile.fields) && createProfile.fields.length > 0
      ? createProfile.fields
      : [
          "Display Name",
          "Email Address",
          "Gender",
          "Age Group",
          "Country",
          "Short Bio",
        ];

  const deleteDataItems: string[] =
    Array.isArray(deleteAccount.dataItems) &&
    deleteAccount.dataItems.length > 0
      ? deleteAccount.dataItems
      : ["Profile information", "Photos", "Points", "Scores"];

  return (
    <>
      {/* Hero section - HOW IT WORKS tag, title with wavy underline, subtitle */}
      <Box
        component="section"
        className="relative flex items-center justify-center overflow-hidden pt-30 pb-15 min-h-[400px] lg:min-h-[80vh]"
        sx={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box className="relative z-10 flex flex-col items-center max-w-[900px] mx-auto text-center">
          <LabelBadge label={hero.badge || "Learn"} />
          <HeroHeading
            title={hero.titleBefore || "HOW IT"}
            lastWord={hero.titleLast || "WORKS"}
          />
          <Box className="max-w-[800px] mt-2 mb-8">
            <ThemeText text={hero.subtitle || "How to Use PhotoMone"} />
          </Box>
        </Box>
      </Box>

      {/* Sign Up */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading title={signUp.heading || "Sign Up"} />
          <Box className="mt-2">
            <ThemeText
              text={
                signUp.body ||
                "Create your account using Google login or email. Anyone can join in just a few steps."
              }
            />
          </Box>
        </Box>
      </Box>

      {/* Create Your Profile */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading title={createProfile.heading || "Create Your Profile"} />
          <Box className="mt-2 mb-4">
            <ThemeText
              text={createProfile.intro || "Fill in your basic information:"}
            />
          </Box>
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-3 mb-6"
          >
            {profileFields.map((text, index) => (
              <CheckListItem key={index} text={text} />
            ))}
          </Box>
          <Box className="mb-4">
            <ThemeText
              text={
                createProfile.uploadLine ||
                "Upload your profile photo and complete registration."
              }
            />
          </Box>
          <ThemeText
            text={
              <>
                {createProfile.pointsBefore || "You will receive "}
                <Em>{createProfile.pointsEm || "100 free points"}</Em>
                {createProfile.pointsAfter ||
                  " after completing your profile."}
              </>
            }
          />
        </Box>
      </Box>

      {/* Upload Your Photo (list + generated-photo copy in one section) */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading title={uploadPhoto.heading || "Upload Your Photo"} />
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-3 mt-2 mb-6"
          >
            <CheckListItem
              text={uploadPhoto.selectFace || "Select a photo of your face"}
            />
            <CheckListItem
              text={
                uploadPhoto.adjustSquare ||
                "Adjust it to fit within the square frame"
              }
            />
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {uploadPhoto.validatePrefix || "Click \""}
                    <Em>
                      {uploadPhoto.validateButton || "Validate & Generate"}
                    </Em>
                    {uploadPhoto.validateSuffix || "\""}
                  </>
                }
              />
            </CheckListItem>
          </Box>
          <Box className="mb-4">
            <ThemeText
              text={
                <>
                  {uploadPhoto.afterGenBefore || "After about "}
                  <Em>{uploadPhoto.afterGenEm || "30 seconds"}</Em>
                  {uploadPhoto.afterGenAfter ||
                    ", two generated photos will appear."}
                </>
              }
            />
          </Box>
          <ThemeText
            text={
              uploadPhoto.chooseGallery ||
              "Choose the one you like → it will be saved in your gallery."
            }
          />
        </Box>
      </Box>

      {/* Purchase Photos (Get Exposure Opportunities) */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading
            title={
              purchasePhotos.heading ||
              "Purchase Photos (Get Exposure Opportunities)"
            }
          />
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-3 mt-2 mb-6"
          >
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {purchasePhotos.item1Before || "Go to "}
                    <Em>
                      {purchasePhotos.item1Em1 ||
                        sidebarTabName ||
                        "Photo+"}
                    </Em>
                    {purchasePhotos.item1Mid || " → "}
                    <Em>{purchasePhotos.item1Em2 || "Monetization"}</Em>
                  </>
                }
              />
            </CheckListItem>
            <CheckListItem
              text={
                purchasePhotos.item2 ||
                "Choose a market with available entries (entry > 0)"
              }
            />
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {purchasePhotos.item3Before || "Click "}
                    <Em>{purchasePhotos.item3Em || "Purchase"}</Em>
                  </>
                }
              />
            </CheckListItem>
          </Box>
          <Box className="mb-4">
            <ThemeText
              text={
                purchasePhotos.browse ||
                "Browse and buy a photo you like."
              }
            />
          </Box>
          <Box className="mb-6">
            <ThemeText
              text={
                <>
                  {purchasePhotos.afterPurchaseBefore ||
                    "After purchase, you will instantly receive "}
                  <Em>
                    {purchasePhotos.afterPurchaseEm || "exposure opportunities"}
                  </Em>
                  {purchasePhotos.afterPurchaseAfter ||
                    " (between 1-99), shown in a popup."}
                </>
              }
            />
          </Box>
          <Typography
            className="text-sm lg:text-[17px] mb-2"
            sx={{
              fontStyle: "italic",
              fontWeight: 500,
              color: COLORS.generalText,
            }}
          >
            {purchasePhotos.whyPurchaseTitle || "Why purchase?"}
          </Typography>
          <ThemeText
            text={
              purchasePhotos.whyPurchaseBody ||
              "Buying other users' photo licenses gives you exposure opportunities to help sell your own photos."
            }
          />
        </Box>
      </Box>

      {/* Sell Your Photos */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading title={sellPhotos.heading || "Sell Your Photos"} />
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-3 mt-2 mb-6"
          >
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {sellPhotos.item1Before || "Go to "}
                    <Em>
                      {sellPhotos.item1Em ||
                        `${purchasePhotos.item1Em1 || sidebarTabName || "Photo+"}${sellPhotos.item1Mid || purchasePhotos.item1Mid || " → "}${purchasePhotos.item1Em2 || "Monetization"}`}
                    </Em>
                  </>
                }
              />
            </CheckListItem>
            <CheckListItem
              text={
                sellPhotos.item2 ||
                "Select a market with available entries"
              }
            />
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {sellPhotos.item3Before || "Click "}
                    <Em>{sellPhotos.item3Em || "Sell"}</Em>
                  </>
                }
              />
            </CheckListItem>
          </Box>
          <Box className="mb-4">
            <ThemeText text={sellPhotos.thenLabel || "Then:"} />
          </Box>
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-3 mb-6"
          >
            <CheckListItem
              text={
                sellPhotos.then1 || "Choose a photo from your gallery"
              }
            />
            <CheckListItem
              text={sellPhotos.then2 || "Set your exposure amount"}
            />
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {sellPhotos.then3Before || "Click "}
                    <Em>{sellPhotos.then3Em || "Sell"}</Em>
                    {sellPhotos.then3After || " to start"}
                  </>
                }
              />
            </CheckListItem>
          </Box>
          <Box className="mb-4">
            <ThemeText
              text={
                sellPhotos.notifIntro ||
                "You'll receive real-time updates via notifications:"
              }
            />
          </Box>
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-3 mb-6"
          >
            <CheckListItem
              text={
                sellPhotos.notifFail ||
                "If it fails → failure notification"
              }
            />
            <CheckListItem
              text={
                sellPhotos.notifSuccess ||
                "If it succeeds → celebration screen 🎉"
              }
            />
          </Box>
          <ThemeText
            text={
              <>
                {sellPhotos.finalBefore ||
                  "Once all exposures are used, a "}
                <Em>{sellPhotos.finalEm || "final result summary"}</Em>
                {sellPhotos.finalAfter || " will appear in a popup."}
              </>
            }
          />
        </Box>
      </Box>

      {/* Photo Fusion */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading title={photoFusion.heading || "Photo Fusion"} />
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-3 mt-2 mb-6"
          >
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {photoFusion.item1Before || "Go to "}
                    <Em>
                      {photoFusion.item1Em1 ||
                        sidebarTabName ||
                        "Photo+"}
                    </Em>
                    {photoFusion.item1Mid || " → "}
                    <Em>{photoFusion.item1Em2 || "Photo Fusion"}</Em>
                  </>
                }
              />
            </CheckListItem>
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {photoFusion.item2Before ||
                      "Your photo must have a "}
                    <Em>
                      {photoFusion.item2Em || "score of 5 or higher"}
                    </Em>
                  </>
                }
              />
            </CheckListItem>
          </Box>
          <Box className="mb-4">
            <ThemeText text={photoFusion.stepsLabel || "Steps:"} />
          </Box>
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-3 mb-6"
          >
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {photoFusion.step1Before || "Add a photo to the "}
                    <Em>{photoFusion.step1Em || "Primary slot"}</Em>
                  </>
                }
              />
            </CheckListItem>
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {photoFusion.step2Before || "Add another to the "}
                    <Em>{photoFusion.step2Em || "Secondary slot"}</Em>
                  </>
                }
              />
            </CheckListItem>
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {photoFusion.step3Before || "Click "}
                    <Em>{photoFusion.step3Em || "Fuse"}</Em>
                    {photoFusion.step3After || " and wait"}
                  </>
                }
              />
            </CheckListItem>
          </Box>
          <Box className="mb-4">
            <ThemeText
              text={
                photoFusion.afterComplete ||
                "After completion, you'll see the result."
              }
            />
          </Box>
          <ThemeText
            text={
              <>
                {photoFusion.goGalleryPrefix || "Click \""}
                <Em>{photoFusion.goGalleryEm || "Go to Gallery"}</Em>
                {photoFusion.goGallerySuffix || "\" to view it."}
              </>
            }
          />
        </Box>
      </Box>

      {/* Check Results */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading title={checkResults.heading || "Check Results"} />
          <Box className="mt-2 mb-4">
            <ThemeText
              text={
                <>
                  {checkResults.introBefore || "On the "}
                  <Em>{checkResults.introEm || "Results Page"}</Em>
                  {checkResults.introAfter || ", you can view:"}
                </>
              }
            />
          </Box>
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-3 mb-6"
          >
            <CheckListItem
              text={
                checkResults.result1 || "Purchased photos (Slots)"
              }
            />
            <CheckListItem
              text={
                checkResults.result2 || "Selling results (Trading)"
              }
            />
            <CheckListItem
              text={checkResults.result3 || "Fusion results"}
            />
          </Box>
          <Box className="mb-4">
            <ThemeText
              text={
                checkResults.revealQ || "Want to reveal hidden points?"
              }
            />
          </Box>
          <ThemeText
            text={
              <>
                {checkResults.lockyBefore || "Use "}
                <Em>{checkResults.lockyEm || "1 Locky"}</Em>
                {checkResults.lockyAfter ||
                  " to unlock and view the score."}
              </>
            }
          />
        </Box>
      </Box>

      {/* Redeem Gift Cards */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading
            title={redeemGiftCards.heading || "Redeem Gift Cards"}
          />
          <Box className="mt-2 mb-4">
            <ThemeText
              text={
                <>
                  {redeemGiftCards.body1Before ||
                    "Once your points reach a certain level, you can request a "}
                  <Em>{redeemGiftCards.body1Em || "gift card"}</Em>
                  {redeemGiftCards.body1After || "."}
                </>
              }
            />
          </Box>
          <ThemeText
            text={
              redeemGiftCards.body2 ||
              "Details will be sent to your registered email."
            }
          />
        </Box>
      </Box>

      {/* Purchase Packages */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading
            title={purchasePackages.heading || "Purchase Packages"}
          />
          <Box className="mt-2 mb-6">
            <ThemeText
              text={
                <>
                  {purchasePackages.introBefore || "There are "}
                  <Em>{purchasePackages.introEm || "4 types of packages"}</Em>
                  {purchasePackages.introAfter || " available."}
                </>
              }
            />
          </Box>
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-3 mb-6"
          >
            <CheckListItem
              text={
                purchasePackages.payItem ||
                "Payment is made via credit card"
              }
            />
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {purchasePackages.ticketsBefore ||
                      "Packages include "}
                    <Em>
                      {purchasePackages.ticketsEm || "market entry tickets"}
                    </Em>
                  </>
                }
              />
            </CheckListItem>
          </Box>
          <Typography
            className="text-sm lg:text-[17px] mb-2"
            sx={{ fontWeight: 700, color: COLORS.generalText }}
          >
            {purchasePackages.ticketRulesTitle || "Ticket rules:"}
          </Typography>
          <Box component="ul" className="list-none p-0 m-0 flex flex-col gap-3">
            <CheckListItem>
              <ThemeText
                text={
                  <>
                    {purchasePackages.ticket1Before ||
                      "Each ticket allows entry to "}
                    <Em>{purchasePackages.ticket1Em || "one market"}</Em>
                  </>
                }
              />
            </CheckListItem>
            <CheckListItem
              text={
                purchasePackages.ticket2 ||
                "Number of entries depends on the market's base price"
              }
            />
          </Box>
        </Box>
      </Box>

      {/* Edit Profile */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading title={editProfile.heading || "Edit Profile"} />
          <Box className="mt-2">
            <ThemeText
              text={
                <>
                  {editProfile.bodyBefore ||
                    "You can update your profile anytime in the "}
                  <Em>{editProfile.bodyEm || "Account"}</Em>
                  {editProfile.bodyAfter || " menu."}
                </>
              }
            />
          </Box>
        </Box>
      </Box>

      {/* Delete Account */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading title={deleteAccount.heading || "Delete Account"} />
          <Box className="mt-2 mb-4">
            <ThemeText
              text={deleteAccount.intro || "To delete your account:"}
            />
          </Box>
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-3 mb-6"
          >
            <CheckListItem
              text={
                deleteAccount.agree || "Agree to the deletion terms"
              }
            />
          </Box>
          <Box className="mb-4">
            <ThemeText
              text={
                <>
                  {deleteAccount.removedBefore || "Once deleted, "}
                  <Em>
                    {deleteAccount.removedEm ||
                      "all data is permanently removed"}
                  </Em>
                  {deleteAccount.removedAfter || ", including:"}
                </>
              }
            />
          </Box>
          <Box
            className="pt-6 mt-2"
            sx={{
              borderTop: `1px solid ${COLORS.grayLight}`,
            }}
          >
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3 mb-6"
            >
              {deleteDataItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
          </Box>
          <ThemeText
            text={
              <>
                {deleteAccount.cannotBefore || "This action "}
                <Em>{deleteAccount.cannotEm || "cannot be undone"}</Em>
                {deleteAccount.cannotAfter || "."}
              </>
            }
          />
        </Box>
      </Box>
    </>
  );
};

export default HowItWorksScreen;
