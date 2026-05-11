import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL, API_URLS, ROUTES } from "@constants";
import { AuthService } from "@services";
import { AppsApis } from "@apis";
import { ChildDetailsScreen } from "./ChildDetailsScreen";
import { IChildApp, IChildAppFilter } from "@types";

export const ChildDetailsContainer = () => {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const [apps, setApps] = useState<IChildApp[]>([]);
  const [isAppsLoading, setIsAppsLoading] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<IChildAppFilter>("today");

  const { data, isLoading } = useQuery({
    queryKey: ["parentMe"],
    queryFn: () => AuthService.getMe(),
  });
  const {
    mutateAsync: getChildApps,
  } = AppsApis.useGetChildApps();
  const {
    mutateAsync: updateChildAppRestriction,
  } = AppsApis.useUpdateChildAppRestriction();

  useEffect(() => {
    if (!childId) {
      setApps([]);
      return;
    }

    const requestUrl = `${API_BASE_URL.replace(/\/$/, "")}${API_URLS.childApps}/${childId}?filter=${selectedFilter}`;
    let isActive = true;

    const fetchChildApps = async () => {
      try {
        setIsAppsLoading(true);
        console.log("Fetching child apps for childId:", childId);
        console.log("Child apps filter:", selectedFilter);
        console.log("Child apps request URL:", requestUrl);

        const response = await getChildApps({
          childId,
          filter: selectedFilter,
        });

        if (!isActive) {
          return;
        }

        console.log("Child apps response:", response);
        setApps(response.data ?? []);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("Child apps error:", error);
        setApps([]);
      } finally {
        if (isActive) {
          setIsAppsLoading(false);
        }
      }
    };

    void fetchChildApps();

    return () => {
      isActive = false;
    };
  }, [childId, getChildApps, selectedFilter]);

  const child =
    data?.children.find((item) => item._id === childId) ?? null;

  const handleToggleRestriction = async (appId: string, blocked: boolean) => {
    if (!childId) {
      return;
    }

    try {
      setUpdatingAppId(appId);
      const response = await updateChildAppRestriction({
        childId,
        appId,
        blocked,
      });

      console.log("Update child app restriction response:", response);

      setApps((currentApps) =>
        currentApps.map((app) =>
          app._id === appId ? { ...app, blocked } : app
        )
      );
    } catch (error) {
      console.error("Update child app restriction error:", error);
    } finally {
      setUpdatingAppId(null);
    }
  };

  return (
    <ChildDetailsScreen
      apps={apps}
      child={child}
      isAppTableLoading={isAppsLoading}
      isProfileLoading={isLoading}
      onBack={() => navigate(ROUTES.childOverview)}
      onFilterChange={setSelectedFilter}
      onToggleRestriction={handleToggleRestriction}
      selectedFilter={selectedFilter}
      updatingAppId={updatingAppId}
    />
  );
};

export default ChildDetailsContainer;
