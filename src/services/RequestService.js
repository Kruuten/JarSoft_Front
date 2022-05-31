import axios from 'axios';


const REQUEST_API_BASE_URL ="http://localhost:8080/bid";

class RequestService{

    getBannerView(categoryNames){
        console.log(categoryNames)
        return axios.get(REQUEST_API_BASE_URL + "?" + categoryNames.map(c => "cat="+ c).join("&"));
    }
}

export default new RequestService()