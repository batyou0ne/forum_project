const API_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:3003/api'
    : 'https://forum-project-batu.onrender.com/api';

export default API_URL;
