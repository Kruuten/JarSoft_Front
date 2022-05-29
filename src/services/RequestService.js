import axios from 'axios';

const REQUEST_API_BASE_URL ="http://localhost:8080/api/request";

class RequestService{

    getBannerView(category){
        return axios.get(REQUEST_API_BASE_URL + '/bid/?category=' + category);
    }
}

export default new RequestService()