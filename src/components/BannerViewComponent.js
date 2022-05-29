import React, { Component } from 'react';
import RequestService from "../services/RequestService";


class BannerViewComponent extends Component {
    constructor(props) {
        super(props)
        this.onChangeCategoryReqName = this.onChangeCategoryReqName.bind(this)
        this.getTaskBanner = this.getTaskBanner.bind(this)

        this.state = {
            bannerText: "",
            categoryReqName: ""
        }
    }

    onChangeCategoryReqName(e){
        const reqName = e.target.value;

        this.setState({
            categoryReqName: reqName
        });
    }

    getTaskBanner() {
        RequestService.getBannerView(this.state.categoryReqName)
        .then( res => {
            this.setState({
                bannerText: res.data
            })
            // if(this.state.bannerText.length === 0) {
            //     this.setState({
            //         bannerText: 'По вашему запросу баннеров не найдено'
            //     })
            // }
        })
        .catch(e => {
            console.log(e)
        })
    }

    render() {
        const {bannerText, categoryReqName} = this.state;

        return (
            <div className="lis row">
                <div className="col-md-3">
                    <form>
                        <div className="form-group">
                            <label htmlFor="reqName">
                                <strong>Category ID:</strong>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="reqName"
                                placeholder="Enter category ID"
                                value={categoryReqName}
                                onChange={this.onChangeCategoryReqName}
                            />
                        </div>
                    </form>
                    <button className="btn btn-primary" onClick={() => this.getTaskBanner()}>Get banner</button>
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