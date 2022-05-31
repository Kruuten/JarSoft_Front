import React, { Component } from 'react';
import RequestService from "../services/RequestService";
import categoryService from "../services/CategoryService";


class BannerViewComponent extends Component {
    constructor(props) {
        super(props)
        this.getBannerView = this.getBannerView.bind(this)
        this.onChangeCategory = this.onChangeCategory.bind(this)

        this.state = {
            bannerText: "",
            categoryReqName: "",
            categories: [],
            selectedCategories:[]
        }
    }

    onChangeCategory(e) {
        const category = e.target.value;
        const selectedOptions = e.target ? Array.from(e.target.selectedOptions) : []
        console.log(category, selectedOptions)
        this.setState( res => ({
                selectedCategories: this.state.categories.filter(c=> selectedOptions.find(o => o.value === c.reqName))
        }))
    }

    componentDidMount() {

        categoryService.getCategories()
            .then( res => {
                this.setState({categories: res.data})
            })
            .catch(e => {
                console.log(e)
            })
    }

    getBannerView() {
        RequestService.getBannerView(this.state.selectedCategories.map(c=> c.reqName))
        .then( res => {
            this.setState({
                bannerText: res.data
            })
        })
        .catch(e => {
            console.log(e)
        })
    }

    render() {
        const {bannerText, categories, selectedCategories} = this.state;
        return (
            <div className="lis row">
                <div className="col-md-3">
                    <form>
                        <div className="form-group">
                            <label htmlFor="reqName"><strong>Choose categories</strong></label>
                            <div>
                                <select className="form-control" multiple aria-label="Disabled select example"
                                        onChange={this.onChangeCategory}>
                                    <option value="" disabled hidden>Choose categories</option>
                                    {categories && categories.map((category) => (
                                        <option value={category.reqName} key={category.id}
                                                selected={!!selectedCategories.find(c => c.id)}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </form>
                    <button className="btn btn-primary" onClick={this.getBannerView}>Get banner</button>
                </div>
                <div className="col-md-6">
                    <div>
                        <label>
                            <strong>Banner Text:</strong>
                        </label>{" "}
                        <div>
                            {bannerText}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BannerViewComponent;