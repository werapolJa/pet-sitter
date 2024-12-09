import React from "react";
import { Alert, Snackbar } from "@mui/material";

interface CustomAlertProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: () => void;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  variant?: "filled" | "outlined";
  size?: "small" | "medium";
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  open,
  message,
  severity,
  onClose,
  anchorOrigin,
  variant,
  size,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant={variant}
        sx={{
          fontSize: size === "small" ? "0.75rem" : "1.10rem",
          padding: size === "small" ? "4px 8px" : "10px 25px",
          backgroundColor:
            severity === "success"
              ? "#1CCD83"
              : severity === "error"
              ? "#EA1010"
              : severity === "info"
              ? "#76D0FC"
              : "#FFCA62",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          "& .MuiAlert-icon": {
            // Targeting the icon
            color:
              severity === "success"
                ? "#fff"
                : severity === "error"
                ? "#fff"
                : severity === "info"
                ? "#fff"
                : "#fff",
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
