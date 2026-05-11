import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { IParent, IChild } from "@types";
import { COLORS } from "@constants";

const ROWS_PER_PAGE = 8;

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
  deletingChildId: string | null;
  isTableLoading: boolean;
  onDeleteChild: (childId: string, childName: string) => Promise<void>;
}

export const HomeScreen = ({
  parent,
  children,
  deletingChildId,
  isTableLoading,
  onDeleteChild,
}: HomeScreenProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [childPendingDelete, setChildPendingDelete] = useState<IChild | null>(null);

  const totalPages = Math.max(1, Math.ceil(children.length / ROWS_PER_PAGE));

  const paginatedChildren = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return children.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [children, currentPage]);

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  const isDeleteConfirming = childPendingDelete !== null;
  const isDeletingPendingChild =
    childPendingDelete !== null && deletingChildId === childPendingDelete._id;

  const handleConfirmDelete = async () => {
    if (!childPendingDelete) {
      return;
    }

    try {
      await onDeleteChild(childPendingDelete._id, childPendingDelete.name);
      setChildPendingDelete(null);
    } catch {
      // Keep the dialog open so the user can retry or cancel after an error.
    }
  };

  const startRow = children.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endRow = Math.min(currentPage * ROWS_PER_PAGE, children.length);

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
        {!isTableLoading && children.length > 0 && (
          <p
            className="text-sm mb-4"
            style={{ color: COLORS.generalText, opacity: 0.72 }}
          >
            Showing {startRow}-{endRow} of {children.length} children
          </p>
        )}
        {isTableLoading ? (
          <Box
            className="rounded-xl flex flex-col items-center justify-center py-16"
            sx={{
              border: `1px solid ${COLORS.border}`,
              boxShadow: `0 2px 12px ${COLORS.border}`,
              backgroundColor: COLORS.white,
            }}
          >
            <div
              className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
              style={{ borderColor: `${COLORS.primary}55`, borderTopColor: COLORS.primary }}
            />
            <p
              className="text-sm mt-4"
              style={{ color: COLORS.generalText, opacity: 0.7 }}
            >
              Loading children...
            </p>
          </Box>
        ) : (
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
                <th
                  className="text-right py-4 px-5 text-sm font-semibold"
                  style={{ color: COLORS.generalText }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {children.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm"
                    style={{ color: COLORS.generalText }}
                  >
                    No children added yet.
                  </td>
                </tr>
              ) : (
                paginatedChildren.map((child, index) => {
                  const absoluteIndex =
                    (currentPage - 1) * ROWS_PER_PAGE + index;

                  return (
                    <tr
                      key={child._id}
                      style={{
                        backgroundColor:
                          absoluteIndex % 2 === 0
                            ? COLORS.white
                            : `${COLORS.primary}08`,
                      }}
                    >
                      <td
                        className="py-4 px-5 text-sm"
                        style={{ color: COLORS.generalText }}
                      >
                        {absoluteIndex + 1}
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
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => setChildPendingDelete(child)}
                          disabled={deletingChildId === child._id}
                          className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                          style={{
                            color: COLORS.white,
                            backgroundColor: COLORS.secondary,
                            border: `1px solid ${COLORS.secondary}`,
                          }}
                        >
                          {deletingChildId === child._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Box>
        )}
        {children.length > ROWS_PER_PAGE && (
          <Box className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
              style={{
                color: currentPage === 1 ? `${COLORS.generalText}80` : COLORS.generalText,
                backgroundColor:
                  currentPage === 1 ? `${COLORS.border}80` : `${COLORS.primary}12`,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              Previous
            </button>

            <Box className="flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="min-w-10 h-10 px-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? COLORS.white : COLORS.generalText,
                      backgroundColor: isActive ? COLORS.primary : COLORS.white,
                      border: `1px solid ${isActive ? COLORS.primary : COLORS.border}`,
                      boxShadow: isActive ? `0 6px 18px ${COLORS.primary}26` : "none",
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </Box>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
              style={{
                color:
                  currentPage === totalPages
                    ? `${COLORS.generalText}80`
                    : COLORS.white,
                backgroundColor:
                  currentPage === totalPages
                    ? `${COLORS.border}80`
                    : COLORS.primary,
                border: `1px solid ${
                  currentPage === totalPages ? COLORS.border : COLORS.primary
                }`,
              }}
            >
              Next
            </button>
          </Box>
        )}

        <Dialog
          open={isDeleteConfirming}
          onClose={() => {
            if (!isDeletingPendingChild) {
              setChildPendingDelete(null);
            }
          }}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: "20px",
              border: `1px solid ${COLORS.border}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              color: COLORS.generalText,
              fontWeight: 700,
              px: 3,
              pt: 3,
              pb: 1.5,
            }}
          >
            Delete child?
          </DialogTitle>
          <DialogContent sx={{ px: 3, pb: 2 }}>
            <p
              className="text-sm leading-6"
              style={{ color: COLORS.generalText, margin: 0 }}
            >
              Remove{" "}
              <strong>{childPendingDelete?.name ?? "this child"}</strong> from your
              account? This action cannot be undone.
            </p>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
            <button
              type="button"
              onClick={() => setChildPendingDelete(null)}
              disabled={isDeletingPendingChild}
              className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
              style={{
                color: COLORS.generalText,
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleConfirmDelete()}
              disabled={isDeletingPendingChild}
              className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
              style={{
                color: COLORS.white,
                backgroundColor: COLORS.secondary,
                border: `1px solid ${COLORS.secondary}`,
              }}
            >
              {isDeletingPendingChild ? "Deleting..." : "Delete"}
            </button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
