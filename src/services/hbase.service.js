import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:12345/api/hbase/';

class HbaseService {
  getData(key) {
    return axios.get(API_URL + 'getData/' + key, { headers: authHeader() });
  }

  getMetadata(start, end) {
    return axios.get(API_URL + 'getMetadata/' + start + "/" + end, { headers: authHeader() });
  }
}

export default new HbaseService();
