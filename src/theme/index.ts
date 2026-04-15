import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        body: { value: "system-ui, sans-serif" },
      },

      colors: {},
    },

    semanticTokens: {
      colors: {
        logo_color: {
          value: {
            base: "#6494c4",
            _dark: "white",
          },
        },

        select_bg: {
          value: {
            base: "white",
            _dark: "colors.gray.900",
          },
        },

        input: {
          bg: {},
          border: { value: { base: "#e2e8f0", _dark: "#303235" } },
          color: { value: { base: "#5276a5", _dark: "gray.400" } },
          placeholder: { value: { base: "#94a3b8", _dark: "#475569" } },
        },

        navbar_bg: {
          value: {
            base: "white",
            _dark: "#28292c",
          },
        },

        main_container: {
          bg: { value: { base: "#ffffff", _dark: "colors.gray.800" } },
          border: { value: { base: "#f1f2f3", _dark: "#313131" } },
        },

        card: {
          bg: {
            value: { base: "#ffffff", _dark: "colors.gray.900" },
          },
          border: { value: { base: "#e2e8f0", _dark: "#2e3031" } },
        },

        cardhover: {
          border: {
            value: { base: "#c7d2fe", _dark: "#3b5bdb" },
          },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: { base: "white", _dark: "gray.900" },
      color: { base: "gray.800", _dark: "gray.100" },
    },
  },
});
