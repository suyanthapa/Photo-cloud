// Unified theme configuration for all auth pages
export const authTheme = {
  // Common gradient background
  backgroundGradient:
    "bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100",

  // Card styling
  card: {
    base: "w-full max-w-md rounded-3xl shadow-2xl border border-white/20 bg-white/80 backdrop-blur-xl",
    padding: "p-8",
  },

  // Primary button styling
  primaryButton: {
    base: "w-full text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    gradient:
      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
    shadow: "shadow-lg hover:shadow-xl",
  },

  // Input styling
  input: {
    base: "w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed",
    focus:
      "focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white",
    background: "bg-gray-50/50 focus:bg-white",
  },

  // Text colors
  text: {
    title:
      "text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent",
    subtitle: "text-gray-600",
    label: "text-sm font-semibold text-gray-700",
    link: "text-blue-600 hover:text-purple-600 transition-colors duration-200",
    error: "text-red-500",
    success: "text-green-600",
  },

  // Special elements
  divider: "border-gray-200",
  accent: "text-blue-600",
};
