import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },    
  },
  plugins: [],
} satisfies Config;




// theme: {
//   extend: {      
//     keyframes: {
//       slideInText: {
//         '0%': { transform: 'translate(100%) scale(0.7)', opacity:'0' },           
//         '100%': { transform: 'translate(0%) scale(1)', opacity: '1'  }
//       },
//       slideOutText: {
//         '0%': { transform: 'translate(0%) scale(1)', opacity: '1' },
//         '100%': { transform: 'translate(100%) scale(0.7)', opacity: '0' },
//       },
//       slideInContent: {
//         '0%': { transform: 'translate(-100%) scale(0.7)', opacity: '0' },
//         '80%': { transform: 'translate(0%) scale(0.7)', opacity: '0.7' },
//         '100%': { transform: 'translate(0%) scale(1)', opacity: '1' }
//       }
//     },
//     animation: {
//       slideInText: 'slideInText 0.6s ease-in-out',
//       slideOutText: 'slideOutText 0.6s ease-in-out',
//       slideInContent: 'slideInContent 0.6s ease-in-out',
//     }
    
//   },    
// },