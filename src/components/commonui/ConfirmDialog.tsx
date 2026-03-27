"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content: React.ReactNode;
  variant?: "primary" | "danger";
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "ยืนยันรายการ",
  content,
  variant = "primary",
}: ConfirmDialogProps) {
  const primaryColor = variant === "danger" ? "#ef4444" : "#e1e095";
  const hoverColor = variant === "danger" ? "#dc2626" : "#d4d386";
  const textColor = variant === "danger" ? "white" : "black";

  
  return (
    <Dialog
      className="font-sans"
      open={open}
      onClose={onClose}
      // hideBackdrop={true}
      sx={{ zIndex: 10001 }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "24px",
            p: 1,
            maxWidth: "350px",
            width: "90%",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "1.25rem",
          pt: 3,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography
          component="div"
          textAlign="center"
          sx={{
            color: "#6b7280", 
            fontWeight: "500",
            lineHeight: 1.6,
          }}
        >
          {content}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 4, px: 3 }}>
        <Button
          onClick={onConfirm}
          variant="contained"
      sx={{
            borderRadius: "16px",
            bgcolor: primaryColor,
            color: textColor,
            px: 4,
            py: 1,
            fontSize: "1rem",
            fontWeight: "bold",
            "&:hover": { bgcolor: hoverColor },
            textTransform: "none", 
          }}
        >
          ยืนยัน
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
        sx={{
            borderRadius: "16px",
            color: "#374151", 
            borderColor: "#d1d5db",
            px: 4,
            py: 1,
            fontSize: "1rem",
            fontWeight: "bold",
            "&:hover": { borderColor: "gray", bgcolor: "#f9fafb" },
            textTransform: "none",
          }}
        >
          ยกเลิก
        </Button>
      </DialogActions>
    </Dialog>
  );
}
