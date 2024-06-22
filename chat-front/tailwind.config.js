export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      backgroundImage: {
        image: "url('img/bg2.jpg')",
        'error-image': "url('img/err.jpeg')",
      },
      backdropBlur: {
        xs: '2px',
      },
      height: {
        'chat-height': 'calc(100vh - 170px)',
        'chat-lg': 'calc(100vh - 134px)',
        'mobile-chat-window': 'calc(100vh - 52px)',
      },
      colors: {
        'blue-85': '#183B56',
        'blue-75': '#1565D8',
        'blue-50': '#527AA6',
        'blue-40': '#6088BC',
        'blue-30': '#8ab2ec',
        'blue-20': '#a1c1ef',
        'blue-10': '#b9d1f3',
        'blue-0': '#d0e0f7',
        textColor: '#5A7184',
        purple: '#7269ef',
        lightPurple: '#8b85f9',
        lightestPurple: '#9791fa',
        darkPurple: '#5e56d8',
      },
    },
  },
  variants: {
    extend: {
      backdropBlur: ['hover', 'focus'],
    },
  },
  plugins: [],
};
