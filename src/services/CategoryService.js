import axios from 'axios';
import authHeader from "./auth-header";


const CATEGORY_API_BASE_URL ="http://localhost:8080/category";

class CategoryService{

    getCategories(){
        return axios.get(CATEGORY_API_BASE_URL, { headers: authHeader() });
    }

    getCategoryById(categoryId){
        return axios.get(CATEGORY_API_BASE_URL +'/' + categoryId, { headers: authHeader() });
    }

    createCategory(category){
        return axios.post(CATEGORY_API_BASE_URL, category, { headers: authHeader() });
    }

    updateCategory(category, categoryId){
        return axios.put(CATEGORY_API_BASE_URL+'/' + categoryId, category, { headers: authHeader() });
    }

    deleteCategory(categoryId){
        return axios.delete(CATEGORY_API_BASE_URL+'/' + categoryId, { headers: authHeader() });
    }
}

export default new CategoryService()