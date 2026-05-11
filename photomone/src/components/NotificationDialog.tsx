import { Box, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import { NotificationBellIcon } from "@assets/icons/svg";
import { COLORS } from "@constants";
import { TabBar, MainDialog } from "@components";
import { NotificationApis } from "@apis";
import { useLanguage } from "@providers";
import type { Notification } from "@types";

type TimeBucket = "today" | "yesterday" | "lastWeek" | "allTime";

const BUCKET_ORDER: TimeBucket[] = [
  "today",
  "yesterday",
  "lastWeek",
  "allTime",
];

function getTimeBucket(createdAt: string): TimeBucket {
  const date = new Date(createdAt);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const lastWeekStart = new Date(todayStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  if (date >= todayStart) return "today";
  if (date >= yesterdayStart) return "yesterday";
  if (date >= lastWeekStart) return "lastWeek";
  return "allTime";
}

interface NotificationDialogProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export const NotificationDialog = ({
  open,
  onClose,
  notifications,
}: NotificationDialogProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const markAsReadMutation = NotificationApis.useMarkNotificationAsRead();
  const { translations } = useLanguage();

  const t = translations || {};
  const notification = t.notification || {};
  const tabsTranslations = notification.tabs || {};
  const timeTranslations = notification.time || {};
  const emptyTranslations = notification.empty || {};
  const typesTranslations = notification.types || {};
  const headerTranslations = t.header || {};
  const shopPackNames =
    ((t.shop || {}) as { packNames?: Record<string, string> }).packNames ||
    {};

  const allNotifications = Array.isArray(notifications) ? notifications : [];

  const tabs = [
    { label: tabsTranslations.unread || "Unread", value: "unread" },
    { label: tabsTranslations.read || "Read", value: "read" },
  ];

  const sectionLabels: Record<TimeBucket, string> = {
    today: timeTranslations.today || "Today",
    yesterday: timeTranslations.yesterday || "Yesterday",
    lastWeek: timeTranslations.lastWeek || "Last week",
    allTime: timeTranslations.allTime || "All Time",
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
    }
    if (diffInDays === 1) {
      return timeTranslations.dayAgo || "1 day ago";
    }
    if (diffInDays < 7) {
      return (timeTranslations.daysAgo || "{days} days ago").replace(
        "{days}",
        diffInDays.toString()
      );
    }
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  // Translate notification heading and description based on type
  const translateNotification = (notification: Notification) => {
    const type = notification.type?.toLowerCase() || "";
    let heading = notification.heading;
    let description = notification.description;
    const photoMoneName = headerTranslations.photoMone || "PhotoMone";
    const headingLower = heading.trim().toLowerCase();

    const isPurchaseSuccessNotification = () => {
      if (type.includes("purchase") && type.includes("success")) return true;
      if (headingLower === "purchase successful") return true;
      if (
        /successfully\s+purchased/i.test(description) &&
        /your\s+.+\s+has\s+been\s+successfully\s+purchased/i.test(
          description
        )
      )
        return true;
      return false;
    };

    // Try to match notification type
    if (type.includes("profile") && type.includes("complete")) {
      // Profile Completed - extract points from description if available
      const pointsMatch = description.match(/(\d+(?:,\d+)?)/);
      const points = pointsMatch ? pointsMatch[1] : "5,000";
      heading = typesTranslations.profileCompleted?.title || heading;
      description = (
        typesTranslations.profileCompleted?.description || description
      )
        .replace("{points}", points)
        .replace("{photoMone}", photoMoneName);
    } else if (type.includes("welcome")) {
      heading = (typesTranslations.welcome?.title || heading).replace(
        "{photoMone}",
        photoMoneName
      );
      description = (
        typesTranslations.welcome?.description || description
      ).replace("{photoMone}", photoMoneName);
    } else if (isPurchaseSuccessNotification()) {
      // Purchase Successful — parse English API copy; localize via notification.types + shop.packNames
      const packageMatch = description.match(/Your\s+(.+?)\s+has\s+been/i);
      const pointsMatch = description.match(/(\d+(?:,\d+)?)\s+points/i);
      const bonusMatch = description.match(/(\d+(?:,\d+)?)\s+bonus/i);

      const rawPackage = packageMatch ? packageMatch[1].trim() : "";
      const packageName =
        (rawPackage &&
          (shopPackNames[rawPackage] ||
            shopPackNames[rawPackage.trim()])) ||
        rawPackage ||
        "{packageName}";
      const points = pointsMatch ? pointsMatch[1] : "{points}";
      const bonus = bonusMatch ? bonusMatch[1] : "";

      heading = typesTranslations.purchaseSuccessful?.title || heading;
      let bonusText = "";
      if (bonus) {
        bonusText = (
          typesTranslations.purchaseSuccessful?.bonusText ||
          " and {bonus} bonus points"
        ).replace("{bonus}", bonus);
      }
      description = (
        typesTranslations.purchaseSuccessful?.description || description
      )
        .replace("{packageName}", packageName)
        .replace("{points}", points)
        .replace("{bonus}", bonusText);
    } else if (type.includes("gift") && type.includes("card")) {
      // Gift Card Processed - extract giftName from description
      const giftMatch = description.match(/Your\s+"(.+?)"\s+gift card/);
      const giftName = giftMatch ? giftMatch[1] : "{giftName}";

      heading = typesTranslations.giftCardProcessed?.title || heading;
      description = (
        typesTranslations.giftCardProcessed?.description || description
      ).replace("{giftName}", giftName);
    }

    return { heading, description };
  };

  const filteredNotifications = useMemo(() => {
    if (!Array.isArray(allNotifications)) return [];
    if (activeTab === 0) {
      return allNotifications.filter((n) => !n.read);
    }
    return allNotifications.filter((n) => n.read);
  }, [allNotifications, activeTab]);

  const notificationsByBucket = useMemo(() => {
    const map: Record<TimeBucket, Notification[]> = {
      today: [],
      yesterday: [],
      lastWeek: [],
      allTime: [],
    };
    const sorted = [...filteredNotifications].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    sorted.forEach((n) => {
      const bucket = getTimeBucket(n.createdAt);
      map[bucket].push(n);
    });
    return BUCKET_ORDER.map((bucket) => ({
      bucket,
      items: map[bucket],
    })).filter((s) => s.items.length > 0);
  }, [filteredNotifications]);

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    // Only mark as read if it's not already read
    if (!isRead) {
      markAsReadMutation.mutate(notificationId);
    }
  };

  return (
    <MainDialog
      open={open}
      onClose={onClose}
      title={notification.title || "Notifications"}
      maxWidth="md"
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <Box sx={{ mb: 2 }}>
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Box>

        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "calc(100vh - 280px)",
            pr: 0.5,
          }}
        >
          {filteredNotifications.length > 0 ? (
            notificationsByBucket.map(({ bucket, items }) => (
              <Box key={bucket} sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: COLORS.generalText,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    mb: 1.5,
                    px: 0.5,
                  }}
                >
                  {sectionLabels[bucket]}
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {items.map((item) => {
                    const translated = translateNotification(item);
                    const isUnread = !item.read;
                    return (
                      <Box
                        key={item._id}
                        onClick={() =>
                          handleNotificationClick(item._id, item.read)
                        }
                        sx={{
                          cursor: "pointer",
                          borderRadius: 2,
                          border: `1px solid ${isUnread ? COLORS.primary : COLORS.grayLight}`,
                          backgroundColor: isUnread
                            ? `${COLORS.primary}08`
                            : COLORS.white,
                          p: 2,
                          transition:
                            "background-color 0.2s, border-color 0.2s",
                          "&:hover": {
                            backgroundColor: isUnread
                              ? `${COLORS.primary}12`
                              : COLORS.grayLight,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 1.5,
                            mb: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.9375rem",
                              fontWeight: 600,
                              color: COLORS.generalText,
                              flex: 1,
                            }}
                          >
                            {translated.heading}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              flexShrink: 0,
                            }}
                          >
                            {isUnread && (
                              <Box
                                sx={{
                                  fontSize: "0.625rem",
                                  fontWeight: 700,
                                  color: COLORS.white,
                                  backgroundColor: COLORS.primary,
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: 1,
                                }}
                              >
                                {tabsTranslations.new || "New"}
                              </Box>
                            )}
                            <Typography
                              component="span"
                              sx={{
                                fontSize: "0.75rem",
                                color: COLORS.primary,
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {formatTimestamp(item.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "0.8125rem",
                            color: COLORS.grayStrong,
                            lineHeight: 1.45,
                          }}
                        >
                          {translated.description}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                px: 2,
                borderRadius: 2,
                border: `1px solid ${COLORS.grayLight}`,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 2,
                  opacity: 0.6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NotificationBellIcon />
              </Box>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: COLORS.generalText,
                  mb: 1,
                }}
              >
                {activeTab === 0
                  ? emptyTranslations.noUnread || "No unread notifications"
                  : emptyTranslations.noRead || "No read notifications yet"}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: COLORS.grayStrong,
                }}
              >
                {activeTab === 0
                  ? emptyTranslations.noUnreadDescription ||
                    "You're all caught up! Check back later for new notifications."
                  : emptyTranslations.noReadDescription ||
                    "Read notifications will appear here after you click on them."}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </MainDialog>
  );
};

export default NotificationDialog;
