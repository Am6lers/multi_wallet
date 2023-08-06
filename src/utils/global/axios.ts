import axios from 'axios';
import config from '../../config';

const axiosClient = axios.create({
  timeout: config.REQUEST_TIMEOUT,
  headers: {
    'User-Agent': config.USER_AGENT,
  },
});

export default axiosClient;
