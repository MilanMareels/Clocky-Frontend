// styles.ts
export const containerStyle = {
  maxWidth: 400,
  padding: 20,
  margin: "auto",
  fontFamily: "'Segoe UI', Roboto, sans-serif",
};

export const inputStyle = (disabled: boolean) => ({
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  backgroundColor: disabled ? "#f5f5f5" : "#fff",
  color: "#333",
  fontSize: "16px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  transition: "all 0.3s ease",
  outline: "none",
  boxSizing: "border-box" as const,
  margin: "4px 0",
  opacity: disabled ? 0.7 : 1,
});

export const getButtonStyle = (isDisabled: boolean, baseColor: string) => ({
  padding: "12px 24px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: isDisabled ? "#e0e0e0" : baseColor,
  color: "white",
  fontSize: "16px",
  fontWeight: 600,
  cursor: isDisabled ? "not-allowed" : "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  width: "100%",
  margin: "8px 0",
  letterSpacing: "0.5px",
  opacity: isDisabled ? 0.8 : 1,
  position: "relative" as const,
  ":hover": !isDisabled
    ? {
        backgroundColor: darkenColor(baseColor, 20),
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      }
    : {},
});

const darkenColor = (color: string, percent: number) => {
  // Vereenvoudigde implementatie
  const colors: Record<string, string> = {
    "#3a86ff": "#2667cc",
    "#4CAF50": "#3d8b40",
    "#F44336": "#d32f2f",
    "#FF9800": "#f57c00",
  };
  return colors[color] || color;
};

export const messageStyle = {
  marginTop: 20,
  padding: "10px 15px",
  borderRadius: "8px",
  backgroundColor: "#f8f9fa",
  color: "#333",
  border: "1px solid #e0e0e0",
};

export const inlogStyle = {
  padding: "10px 15px",
  borderRadius: "8px",
  backgroundColor: "#3a86ff",
  textAlign: "center" as const,
  color: "white",
  border: "1px solid #e0e0e0",
  width: "100%",
};
