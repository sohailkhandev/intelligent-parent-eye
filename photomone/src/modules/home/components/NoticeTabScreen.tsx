import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { Loading } from "@components";
import { useLanguage } from "@providers";
import { COLORS } from "@constants";
import type { Notice } from "@types";

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

export interface NoticeTabScreenProps {
  notices: Notice[];
  isLoading: boolean;
}

export const NoticeTabScreen = ({
  notices,
  isLoading,
}: NoticeTabScreenProps) => {
  const { translations } = useLanguage();

  const t = translations || {};
  const notice = t.notice || {};
  const home = t.home || {};
  const homeNoticeTab = home.noticeTab || {};
  const timeTranslations = notice.time || {};
  const emptyTranslations = notice.empty || {};

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

  const noticesByBucket = useMemo(() => {
    const map: Record<TimeBucket, Notice[]> = {
      today: [],
      yesterday: [],
      lastWeek: [],
      allTime: [],
    };
    const sorted = [...notices].sort(
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
  }, [notices]);

  if (isLoading) {
    return (
      <Box className="px-2 flex items-center justify-center min-h-[200px]">
        <Loading size={48} />
      </Box>
    );
  }

  return (
    <Box className="px-2">
      <Box
        sx={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 280px)",
          pr: 0.5,
        }}
      >
        {notices.length > 0 ? (
          noticesByBucket.map(({ bucket, items }) => (
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {items.map((item) => {
                  const isUnread = !item.isRead;
                  return (
                    <Box
                      key={item._id}
                      sx={{
                        cursor: "default",
                        borderRadius: 2,
                        border: `1px solid ${isUnread ? COLORS.secondary : COLORS.grayLight}`,
                        backgroundColor: COLORS.white,
                        p: 2,
                        transition: "background-color 0.2s, border-color 0.2s",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "0.9375rem",
                              fontWeight: 600,
                              color: COLORS.generalText,
                              flex: 1,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.8125rem",
                              color: COLORS.grayStrong,
                              lineHeight: 1.45,
                            }}
                          >
                            {item.content}
                          </Typography>
                        </Box>
                        <Box
                          className="flex lg:flex-row flex-col items-center justify-center gap-1 lg:gap-0"
                          sx={{
                            flexShrink: 0,
                          }}
                        >
                          {isUnread && (
                            <Box
                              sx={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: COLORS.primary,
                                backgroundColor: "#CEFCFF",
                                px: 1,
                                py: 0.25,
                                borderRadius: 4,
                              }}
                            >
                              {notice.newLabel || "New"}
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
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                color: COLORS.generalText,
                mb: 1,
              }}
            >
              {homeNoticeTab.noNotices ||
                emptyTranslations.noNotices ||
                "No notices yet"}
            </Typography>
            {/* Translation */}
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: COLORS.grayStrong,
              }}
            >
              {homeNoticeTab.noNoticesDescription ||
                emptyTranslations.noNoticesDescription ||
                "Notices will appear here when available."}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NoticeTabScreen;
