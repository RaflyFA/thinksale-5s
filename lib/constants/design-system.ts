/**
 * Design System Constants
 *
 * Konstanta untuk memastikan konsistensi desain di seluruh aplikasi
 * Mencakup colors, spacing, typography, shadows, dan breakpoints
 *
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

export const DESIGN_TOKENS = {
  // Color Palette
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      900: "#1e3a8a",
    },
    secondary: {
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
    },
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      800: "#1f2937",
      900: "#111827",
    },
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },

  // Spacing Scale
  spacing: {
    xs: "0.5rem", // 8px
    sm: "0.75rem", // 12px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  // Border Radius
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },

  // Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Animation Durations
  animation: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },

  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const

// Layout Constants
export const LAYOUT = {
  maxWidth: "1280px",
  containerPadding: {
    mobile: "1rem",
    desktop: "2rem",
  },
  headerHeight: "80px",
  footerMinHeight: "400px",
} as const

// Component Variants
export const COMPONENT_VARIANTS = {
  button: {
    sizes: ["sm", "md", "lg"] as const,
    variants: ["primary", "secondary", "outline", "ghost"] as const,
  },
  card: {
    variants: ["default", "elevated", "outlined"] as const,
  },
  input: {
    sizes: ["sm", "md", "lg"] as const,
  },
} as const
