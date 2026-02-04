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
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "ยืนยันรายการ",
  content,
}: ConfirmDialogProps) {
  return (
    <Dialog className="font-sans"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "24px",
            p: 1,
            maxWidth: "350px",
            width: "90%",
            
          },
        },
      }}
    >
      <DialogTitle
        sx={{ fontWeight: "bold", textAlign: "center", fontSize: "1.25rem" }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography component="div" textAlign="center" color="textSecondary">
          {content}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            borderRadius: "12px",
            bgcolor: "#e1e095",
            color: "black",
            px: 3,
            fontWeight: "bold",
            "&:hover": { bgcolor: "#d4d386" },
          }}
        >
          ยืนยัน
        </Button>
           <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "12px",
            color: "gray",
            borderColor: "gray",
            px: 3,
          }}
        >
          ยกเลิก
        </Button>
      </DialogActions>
    </Dialog>
  );
}
