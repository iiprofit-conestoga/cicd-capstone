const config = {
  development: {
    apiUrl: `http://localhost:${import.meta.env.VITE_BACKEND_PORT || '3000'}`
  },
  production: {
    apiUrl: import.meta.env.VITE_API_URL || 'https://your-production-api.com'
  },
  test: {
    apiUrl: `http://localhost:${import.meta.env.VITE_BACKEND_PORT || '3000'}`
  },
  docker: {
    apiUrl: import.meta.env.VITE_DOCKER_API_URL || 'http://backend:5000'
  }
};

// Determine the environment
let environment = import.meta.env.MODE || 'development';

// Check if we're running in Docker
if (import.meta.env.VITE_DOCKER === 'true') {
  environment = 'docker';
}

export default config[environment]; 