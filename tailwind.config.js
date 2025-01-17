/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	backgroundSize: {
  		full: '100%'
  	},
  	extend: {
  		screens: {
  			mobile: '550px',
  			tablet: '850px'
  		},
  		transitionProperty: {
  			width: 'width'
  		},
  		spacing: {
  			'18': '70px',
  			'30': '120px',
  			'84': '350px',
  			'86': '380px',
  			'88': '430px',
  			'90': '440px',
  			'98': '400px',
  			'99': '430px',
  			'100': '450px',
  			'105': '470px',
  			'12/12': '95%'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
