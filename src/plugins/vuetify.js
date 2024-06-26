/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
          background: "#121212",
          surface: "#333333",
          gold: "#E4BC00"
        },
      },
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
          background: "#CCC"
        },
      },
    },
  },
});
