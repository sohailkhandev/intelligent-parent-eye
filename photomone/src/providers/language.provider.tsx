import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ko" | "zh" | "ja" | "ur" | "hi" | "es" | "de" | "fr" | "ru";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });
  const [translations, setTranslations] = useState<any>(null);

  // RTL languages
  const RTL_LANGUAGES = new Set(["ur"]);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const [landingResponse, howItWorksResponse, faqResponse, aboutUsResponse, privacyPolicyResponse, termsAndConditionsResponse, customerSupportResponse, authResponse, sidebarResponse, homeResponse, appHeaderResponse, shopResponse, photomoneResponse, marketResponse, resultResponse, profileResponse, promotionPackageResponse, promotionSocialResponse, noticeResponse, notificationResponse, slotDetailResponse] = await Promise.all([
          fetch(`/locales/${language}/landing.json`),
          fetch(`/locales/${language}/howItWorks.json`).catch(() => null),
          fetch(`/locales/${language}/faq.json`).catch(() => null),
          fetch(`/locales/${language}/aboutUs.json`).catch(() => null),
          fetch(`/locales/${language}/privacyPolicy.json`).catch(() => null),
          fetch(`/locales/${language}/termsAndConditions.json`).catch(() => null),
          fetch(`/locales/${language}/customerSupport.json`).catch(() => null),
          fetch(`/locales/${language}/auth.json`).catch(() => null),
          fetch(`/locales/${language}/sidebar.json`).catch(() => null),
          fetch(`/locales/${language}/home.json`).catch(() => null),
          fetch(`/locales/${language}/appHeader.json`).catch(() => null),
          fetch(`/locales/${language}/shop.json`).catch(() => null),
          fetch(`/locales/${language}/photomone.json`).catch(() => null),
          fetch(`/locales/${language}/market.json`).catch(() => null),
          fetch(`/locales/${language}/result.json`).catch(() => null),
          fetch(`/locales/${language}/profile.json`).catch(() => null),
          fetch(`/locales/${language}/promotionPackage.json`).catch(() => null),
          fetch(`/locales/${language}/promotionSocial.json`).catch(() => null),
          fetch(`/locales/${language}/notice.json`).catch(() => null),
          fetch(`/locales/${language}/notification.json`).catch(() => null),
          fetch(`/locales/${language}/slotDetail.json`).catch(() => null),
        ]);

        const landingData = await landingResponse.json();
        let howItWorksData = null;
        let faqData = null;
        let aboutUsData = null;
        let privacyPolicyData = null;
        let termsAndConditionsData = null;
        let customerSupportData = null;
        let authData = null;
        let sidebarData = null;
        let homeData = null;
        let appHeaderData = null;
        let shopData = null;
        let photomoneData = null;
        let marketData = null;
        let resultData = null;
        let profileData = null;
        let promotionPackageData = null;
        let promotionSocialData = null;
        let noticeData = null;
        let notificationData = null;
        let slotDetailData = null;

        if (howItWorksResponse) {
          try {
            howItWorksData = await howItWorksResponse.json();
          } catch (e) {
            console.warn("Failed to load howItWorks translations:", e);
          }
        }

        if (faqResponse) {
          try {
            faqData = await faqResponse.json();
          } catch (e) {
            console.warn("Failed to load FAQ translations:", e);
          }
        }

        if (aboutUsResponse) {
          try {
            aboutUsData = await aboutUsResponse.json();
          } catch (e) {
            console.warn("Failed to load About Us translations:", e);
          }
        }

        if (privacyPolicyResponse) {
          try {
            privacyPolicyData = await privacyPolicyResponse.json();
          } catch (e) {
            console.warn("Failed to load Privacy Policy translations:", e);
          }
        }

        if (termsAndConditionsResponse) {
          try {
            termsAndConditionsData = await termsAndConditionsResponse.json();
          } catch (e) {
            console.warn("Failed to load Terms and Conditions translations:", e);
          }
        }

        if (customerSupportResponse) {
          try {
            customerSupportData = await customerSupportResponse.json();
          } catch (e) {
            console.warn("Failed to load Customer Support translations:", e);
          }
        }

        if (authResponse) {
          try {
            authData = await authResponse.json();
          } catch (e) {
            console.warn("Failed to load Auth translations:", e);
          }
        }

        if (sidebarResponse) {
          try {
            sidebarData = await sidebarResponse.json();
          } catch (e) {
            console.warn("Failed to load Sidebar translations:", e);
          }
        }

        if (homeResponse) {
          try {
            homeData = await homeResponse.json();
          } catch (e) {
            console.warn("Failed to load Home translations:", e);
          }
        }

        if (appHeaderResponse) {
          try {
            appHeaderData = await appHeaderResponse.json();
          } catch (e) {
            console.warn("Failed to load AppHeader translations:", e);
          }
        }

        if (shopResponse) {
          try {
            shopData = await shopResponse.json();
          } catch (e) {
            console.warn("Failed to load Shop translations:", e);
          }
        }

        if (photomoneResponse) {
          try {
            photomoneData = await photomoneResponse.json();
          } catch (e) {
            console.warn("Failed to load Photomone translations:", e);
          }
        }

        if (marketResponse) {
          try {
            marketData = await marketResponse.json();
          } catch (e) {
            console.warn("Failed to load Market translations:", e);
          }
        }

        if (resultResponse) {
          try {
            resultData = await resultResponse.json();
          } catch (e) {
            console.warn("Failed to load Result translations:", e);
          }
        }

        if (profileResponse) {
          try {
            profileData = await profileResponse.json();
          } catch (e) {
            console.warn("Failed to load Profile translations:", e);
          }
        }

        if (promotionPackageResponse) {
          try {
            promotionPackageData = await promotionPackageResponse.json();
          } catch (e) {
            console.warn("Failed to load PromotionPackage translations:", e);
          }
        }

        if (promotionSocialResponse) {
          try {
            promotionSocialData = await promotionSocialResponse.json();
          } catch (e) {
            console.warn("Failed to load PromotionSocial translations:", e);
          }
        }

        if (noticeResponse) {
          try {
            noticeData = await noticeResponse.json();
          } catch (e) {
            console.warn("Failed to load Notice translations:", e);
          }
        }

        if (notificationResponse) {
          try {
            notificationData = await notificationResponse.json();
          } catch (e) {
            console.warn("Failed to load Notification translations:", e);
          }
        }

        if (slotDetailResponse) {
          try {
            slotDetailData = await slotDetailResponse.json();
          } catch (e) {
            console.warn("Failed to load SlotDetail translations:", e);
          }
        }

        // Merge translations - properly merge howItWorks to preserve both landing and detail page structures
        const mergedHowItWorks = landingData?.howItWorks ? { ...landingData.howItWorks } : {};
        if (howItWorksData) {
          // Merge top-level properties
          Object.keys(howItWorksData).forEach(key => {
            if (key.startsWith('step') && typeof howItWorksData[key] === 'object') {
              // Merge step objects to preserve both heading (landing) and title (detail page)
              mergedHowItWorks[key] = {
                ...(mergedHowItWorks[key] || {}),
                ...howItWorksData[key]
              };
            } else {
              // For non-step properties, allow override
              mergedHowItWorks[key] = howItWorksData[key];
            }
          });
        }

        // Extract header from appHeader if it exists
        const headerData = appHeaderData?.header || null;

        // Merge photomone data - preserve landingData.photomone for landing screen, merge with photomoneData for photomone screen
        const mergedPhotomone = landingData?.photomone ? { ...landingData.photomone } : {};
        if (photomoneData) {
          // Merge photomoneData into mergedPhotomone, preserving landing screen keys
          Object.keys(photomoneData).forEach(key => {
            // Only override if the key doesn't exist in landing photomone, or merge objects
            if (!mergedPhotomone[key] || typeof photomoneData[key] !== 'object') {
              mergedPhotomone[key] = photomoneData[key];
            } else if (typeof mergedPhotomone[key] === 'object' && typeof photomoneData[key] === 'object') {
              mergedPhotomone[key] = { ...mergedPhotomone[key], ...photomoneData[key] };
            }
          });
        }

        // Merge translations
        const mergedTranslations = {
          ...landingData,
          ...(Object.keys(mergedHowItWorks).length > 0 && { howItWorks: mergedHowItWorks }),
          ...(faqData && { faq: faqData }),
          ...(aboutUsData && { aboutUs: aboutUsData }),
          ...(privacyPolicyData && { privacyPolicy: privacyPolicyData }),
          ...(termsAndConditionsData && { termsAndConditions: termsAndConditionsData }),
          ...(customerSupportData && { customerSupport: customerSupportData }),
          ...(authData && { auth: authData }),
          ...(sidebarData && { sidebar: sidebarData }),
          ...(homeData && { home: homeData }),
          ...(appHeaderData && { appHeader: appHeaderData }),
          ...(headerData && { header: headerData }),
          ...(shopData && { shop: shopData }),
          ...(Object.keys(mergedPhotomone).length > 0 && { photomone: mergedPhotomone }),
          ...(marketData && { market: marketData }),
          ...(resultData && { result: resultData }),
          ...(profileData && { profile: profileData }),
          ...(promotionPackageData && { promotionPackage: promotionPackageData }),
          ...(promotionSocialData && { promotionSocial: promotionSocialData }),
          ...(noticeData && { notice: noticeData }),
          ...(notificationData && { notification: notificationData }),
          ...(slotDetailData && { slotDetail: slotDetailData }),
        };

        setTranslations(mergedTranslations);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to English if loading fails
        if (language !== "en") {
          try {
            const [fallbackLanding, fallbackHowItWorks, fallbackFaq, fallbackAboutUs, fallbackPrivacyPolicy, fallbackTermsAndConditions, fallbackCustomerSupport, fallbackAuth, fallbackSidebar, fallbackHome, fallbackAppHeader, fallbackShop, fallbackPhotomone, fallbackPromotionPackage] = await Promise.all([
              fetch("/locales/en/landing.json"),
              fetch("/locales/en/howItWorks.json").catch(() => null),
              fetch("/locales/en/faq.json").catch(() => null),
              fetch("/locales/en/aboutUs.json").catch(() => null),
              fetch("/locales/en/privacyPolicy.json").catch(() => null),
              fetch("/locales/en/termsAndConditions.json").catch(() => null),
              fetch("/locales/en/customerSupport.json").catch(() => null),
              fetch("/locales/en/auth.json").catch(() => null),
              fetch("/locales/en/sidebar.json").catch(() => null),
              fetch("/locales/en/home.json").catch(() => null),
              fetch("/locales/en/appHeader.json").catch(() => null),
              fetch("/locales/en/shop.json").catch(() => null),
              fetch("/locales/en/photomone.json").catch(() => null),
              fetch("/locales/en/promotionPackage.json").catch(() => null),
            ]);
            const fallbackLandingData = await fallbackLanding.json();
            let fallbackHowItWorksData = null;
            let fallbackFaqData = null;
            let fallbackAboutUsData = null;
            let fallbackPrivacyPolicyData = null;
            let fallbackTermsAndConditionsData = null;
            let fallbackCustomerSupportData = null;
            let fallbackAuthData = null;
            let fallbackSidebarData = null;
            let fallbackHomeData = null;
            let fallbackAppHeaderData = null;
            let fallbackShopData = null;
            let fallbackPhotomoneData = null;
            let fallbackPromotionPackageData = null;
            if (fallbackHowItWorks) {
              try {
                fallbackHowItWorksData = await fallbackHowItWorks.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackFaq) {
              try {
                fallbackFaqData = await fallbackFaq.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackAboutUs) {
              try {
                fallbackAboutUsData = await fallbackAboutUs.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackPrivacyPolicy) {
              try {
                fallbackPrivacyPolicyData = await fallbackPrivacyPolicy.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackTermsAndConditions) {
              try {
                fallbackTermsAndConditionsData = await fallbackTermsAndConditions.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackCustomerSupport) {
              try {
                fallbackCustomerSupportData = await fallbackCustomerSupport.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackAuth) {
              try {
                fallbackAuthData = await fallbackAuth.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackSidebar) {
              try {
                fallbackSidebarData = await fallbackSidebar.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackHome) {
              try {
                fallbackHomeData = await fallbackHome.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackAppHeader) {
              try {
                fallbackAppHeaderData = await fallbackAppHeader.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackShop) {
              try {
                fallbackShopData = await fallbackShop.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackPhotomone) {
              try {
                fallbackPhotomoneData = await fallbackPhotomone.json();
              } catch (e) {
                // Ignore
              }
            }
            if (fallbackPromotionPackage) {
              try {
                fallbackPromotionPackageData = await fallbackPromotionPackage.json();
              } catch (e) {
                // Ignore
              }
            }
            // Merge fallback howItWorks properly
            const mergedFallbackHowItWorks = fallbackLandingData?.howItWorks ? { ...fallbackLandingData.howItWorks } : {};
            if (fallbackHowItWorksData) {
              Object.keys(fallbackHowItWorksData).forEach(key => {
                if (key.startsWith('step') && typeof fallbackHowItWorksData[key] === 'object') {
                  mergedFallbackHowItWorks[key] = {
                    ...(mergedFallbackHowItWorks[key] || {}),
                    ...fallbackHowItWorksData[key]
                  };
                } else {
                  mergedFallbackHowItWorks[key] = fallbackHowItWorksData[key];
                }
              });
            }

            // Extract header from fallback appHeader if it exists
            const fallbackHeaderData = fallbackAppHeaderData?.header || null;

            // Merge fallback photomone data - preserve fallbackLandingData.photomone for landing screen
            const mergedFallbackPhotomone = fallbackLandingData?.photomone ? { ...fallbackLandingData.photomone } : {};
            if (fallbackPhotomoneData) {
              // Merge fallbackPhotomoneData into mergedFallbackPhotomone, preserving landing screen keys
              Object.keys(fallbackPhotomoneData).forEach(key => {
                // Only override if the key doesn't exist in landing photomone, or merge objects
                if (!mergedFallbackPhotomone[key] || typeof fallbackPhotomoneData[key] !== 'object') {
                  mergedFallbackPhotomone[key] = fallbackPhotomoneData[key];
                } else if (typeof mergedFallbackPhotomone[key] === 'object' && typeof fallbackPhotomoneData[key] === 'object') {
                  mergedFallbackPhotomone[key] = { ...mergedFallbackPhotomone[key], ...fallbackPhotomoneData[key] };
                }
              });
            }

            setTranslations({
              ...fallbackLandingData,
              ...(Object.keys(mergedFallbackHowItWorks).length > 0 && { howItWorks: mergedFallbackHowItWorks }),
              ...(fallbackFaqData && { faq: fallbackFaqData }),
              ...(fallbackAboutUsData && { aboutUs: fallbackAboutUsData }),
              ...(fallbackPrivacyPolicyData && { privacyPolicy: fallbackPrivacyPolicyData }),
              ...(fallbackTermsAndConditionsData && { termsAndConditions: fallbackTermsAndConditionsData }),
              ...(fallbackCustomerSupportData && { customerSupport: fallbackCustomerSupportData }),
              ...(fallbackAuthData && { auth: fallbackAuthData }),
              ...(fallbackSidebarData && { sidebar: fallbackSidebarData }),
              ...(fallbackHomeData && { home: fallbackHomeData }),
              ...(fallbackAppHeaderData && { appHeader: fallbackAppHeaderData }),
              ...(fallbackHeaderData && { header: fallbackHeaderData }),
              ...(fallbackShopData && { shop: fallbackShopData }),
              ...(Object.keys(mergedFallbackPhotomone).length > 0 && { photomone: mergedFallbackPhotomone }),
              ...(fallbackPromotionPackageData && { promotionPackage: fallbackPromotionPackageData }),
            });
          } catch (fallbackError) {
            console.error("Failed to load fallback translations:", fallbackError);
          }
        }
      }
    };

    loadTranslations();
  }, [language]);

  // Handle RTL support
  useEffect(() => {
    const isRTL = RTL_LANGUAGES.has(language);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};