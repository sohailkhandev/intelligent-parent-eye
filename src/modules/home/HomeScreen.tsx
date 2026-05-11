import { Box } from "@mui/material";
import { IParent, IChild } from "@types";
import { COLORS } from "@constants";

function formatJoinedAt(iso?: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

interface HomeScreenProps {
  parent: IParent | null;
  children: IChild[];
  isLoading: boolean;
}

export const HomeScreen = ({
  parent,
  children,
  isLoading,
}: HomeScreenProps) => {
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: COLORS.primary }}
        />
      </Box>
    );
  }

  return (
    <Box className="space-y-8">
      {/* Page title */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: COLORS.generalText }}
        >
          Overview
        </h1>
      </div>


      {/* Parent code card - for child mobile connecting */}
      {parent?.code && (
        <Box
          className="rounded-2xl p-8 text-center shadow-sm"
          sx={{
            border: `2px solid ${COLORS.primary}`,
            backgroundColor: COLORS.white,
            boxShadow: `0 4px 20px ${COLORS.primary}20`,
          }}
        >
          <p
            className="text-sm font-medium mb-3 opacity-90"
            style={{ color: COLORS.generalText }}
          >
            Your connection code - enter this in the child&apos;s app
          </p>
          <p
            className="font-bold"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: COLORS.primary,
              letterSpacing: "0.35em",
            }}
          >
            {parent.code}
          </p>
        </Box>
      )}

      {/* Children table */}
      <Box>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: COLORS.generalText }}
        >
          Children
        </h2>
        <Box
          component="table"
          className="w-full border-collapse rounded-xl overflow-hidden"
          sx={{
            border: `1px solid ${COLORS.border}`,
            boxShadow: `0 2px 12px ${COLORS.border}`,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: `${COLORS.primary}18` }}>
              <th
                className="text-left py-4 px-5 text-sm font-semibold"
                style={{ color: COLORS.generalText }}
              >
                #
              </th>
              <th
                className="text-left py-4 px-5 text-sm font-semibold"
                style={{ color: COLORS.generalText }}
              >
                Name
              </th>
              <th
                className="text-left py-4 px-5 text-sm font-semibold"
                style={{ color: COLORS.generalText }}
              >
                Age group
              </th>
              <th
                className="text-left py-4 px-5 text-sm font-semibold"
                style={{ color: COLORS.generalText }}
              >
                Joined at
              </th>
              <th
                className="text-left py-4 px-5 text-sm font-semibold"
                style={{ color: COLORS.generalText }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {children.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-sm"
                  style={{ color: COLORS.generalText }}
                >
                  No children added yet.
                </td>
              </tr>
            ) : (
              children.map((child, index) => (
                <tr
                  key={child._id}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? COLORS.white : `${COLORS.primary}08`,
                  }}
                >
                  <td
                    className="py-4 px-5 text-sm"
                    style={{ color: COLORS.generalText }}
                  >
                    {index + 1}
                  </td>
                  <td
                    className="py-4 px-5 text-sm font-medium"
                    style={{ color: COLORS.generalText }}
                  >
                    {child.name}
                  </td>
                  <td
                    className="py-4 px-5 text-sm"
                    style={{ color: COLORS.generalText }}
                  >
                    {child.ageGroup}
                  </td>
                  <td
                    className="py-4 px-5 text-sm"
                    style={{ color: COLORS.generalText }}
                  >
                    {formatJoinedAt(child.createdAt)}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: `${COLORS.primary}22`,
                        color: COLORS.primary,
                      }}
                    >
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Box>
      </Box>
    </Box>
  );
};
