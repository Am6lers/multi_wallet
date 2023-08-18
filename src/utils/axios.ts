import axios from 'axios';
import Constants from '@constants/app';

const axiosClient = axios.create({
  timeout: Constants.REQUEST_TIMEOUT,
  headers: {
    'User-Agent': Constants.USER_AGENT,
  },
});

export default axiosClient;
