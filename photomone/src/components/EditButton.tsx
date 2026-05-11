import { IconButton } from "@mui/material";
// import { Pencil as PencilIcon } from "@assets/icons/svg";

interface EditButtonProps {
  onClick?: () => void;
  className?: string;
}

export const EditButton = ({ onClick, className = "" }: EditButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      className={`p-3 bg-white border border-[#D7E2FF] shadow-[0_0_10px_#003F861A] z-50 ${className}`}
    >
      s
      {/* <PencilIcon /> */}
    </IconButton>
  );
};

export default EditButton;
