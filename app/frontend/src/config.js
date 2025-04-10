const config = {
  development: {
    apiUrl: `http://localhost:${import.meta.env.VITE_PORT || '3000'}`
  },
  production: {
    apiUrl: import.meta.env.VITE_API_URL || 'https://your-production-api.com'
  },
  test: {
    apiUrl: `http://localhost:${import.meta.env.VITE_PORT || '3000'}`
  }
};

const environment = import.meta.env.MODE || 'development';

export default config[environment]; 