import axios from 'axios';
import authHeader from "./auth-header";

const CATEGORY_API_BASE_URL ="http://localhost:8080/api/category";

class CategoryService{

    getCategories(){
        return axios.get(CATEGORY_API_BASE_URL+'/category');
    }

    getCategoryById(categoryId){
        return axios.get(CATEGORY_API_BASE_URL +'/category/' + categoryId);
    }

    createCategory(category){
        return axios.post(CATEGORY_API_BASE_URL+'/category', category);
    }

    updateCategory(category, categoryId){
        return axios.put(CATEGORY_API_BASE_URL+'/category/' + categoryId, category);
    }

    deleteCategory(categoryId){
        return axios.delete(CATEGORY_API_BASE_URL+'/category/' + categoryId);
    }
}

export default new CategoryService()