import axios from 'axios';
import authHeader from "./auth-header";

const BANNER_API_BASE_URL ="http://localhost:8080/api/banner/banners";
const BANNER_BID_URL = "http://localhost:8080/bid";

class BannerService{

    getBanners() {
        return axios.get(BANNER_API_BASE_URL, { headers: authHeader() });
    }

    createBanner(banner) {
        return axios.post(BANNER_API_BASE_URL, banner, { headers: authHeader() });
    }

    getBannerById(bannerId) {
        return axios.get(BANNER_API_BASE_URL + '/' + bannerId, { headers: authHeader() });
    }

    updateBanner(bannerId, banner) {
        return axios.put(BANNER_API_BASE_URL + '/' + bannerId, banner, { headers: authHeader() });
    }

    deleteBanner(bannerId) {
        return axios.delete(BANNER_API_BASE_URL + '/' + bannerId, { headers: authHeader() });
    }

    findBannerByName(name) {
        return axios.get(BANNER_API_BASE_URL + '?name=' + name, { headers: authHeader() });
    }

    getBannerByCategoryReq(categoryReq) {
        return axios.get(BANNER_BID_URL + '?category=' + categoryReq)
    }
}

export default new BannerService()