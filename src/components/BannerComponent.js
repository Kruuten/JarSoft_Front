import React, { Component } from 'react';
import bannerService from "../services/BannerService";
import categoryService from "../services/CategoryService";


class BannerComponent extends Component {
    constructor(props) {
        super(props)
        this.onChangeSearchName = this.onChangeSearchName.bind(this)
        this.onChangeName = this.onChangeName.bind(this)
        this.onChangePrice = this.onChangePrice.bind(this)
        this.onChangeCategory = this.onChangeCategory.bind(this)
        this.onChangeContent = this.onChangeContent.bind(this)

        this.setActiveBanner = this.setActiveBanner.bind(this)
        this.searchName = this.searchName.bind(this)

        this.setEditBanner = this.setEditBanner.bind(this)
        this.setCreateBanner = this.setCreateBanner.bind(this)

        this.getBanners = this.getBanners.bind(this)
        this.updateBanner = this.updateBanner.bind(this)
        this.createBanner = this.createBanner.bind(this)
        this.deleteBanner = this.deleteBanner.bind(this)

        this.cancelButton = this.cancelButton.bind(this)

        this.state = {
            banners: [],
            currentBanner: null,
            currentId: -1,
            searchName: "",

            editing: false,
            creating: false,
            onError: false,
            errorBody: [],

            categories: [],

            editingBanner: {
                name: "",
                price: 0,
                categories : [],
                content: ""
            }
        }
    }


    componentDidMount() {
        this.getBanners()

        categoryService.getCategories()
            .then( res => {
                this.setState({categories: res.data})
            })
            .catch(e => {
                console.log(e)
            })
    }

    onChangeSearchName(e) {
        const searchName = e.target.value;

        this.setState({
            searchName: searchName
        });
    }

    searchName() {
        bannerService.findBannerByName(this.state.searchName)
            .then( res => {
                this.setState({
                    banners: res.data
                });
            })
    }

    getBanners() {
        bannerService.getBanners()
            .then(res => {
                this.setState({
                    banners : res.data,
                    onError: false,
                    errorBody: []
                })
            })
            .catch(e => {
                console.log(e);
            })
    }

/////////////////////////////////////////////////

    createBanner() {
        bannerService.createBanner(this.state.editingBanner)
            .then( res => {
                this.setActiveBanner(res.data, res.data.id)
                this.setState({
                    creating: false,
                    editingBanner: {
                        name: "",
                        price: 0,
                        categories : {
                            category: {
                                name: ""
                            },
                        },
                        content: ""
                    }
                })
                this.getBanners()
            })
            .catch(e => {
                this.errorHandle(e)
            })
    }

    updateBanner() {
        bannerService.updateBanner(
            this.state.editingBanner.id,
            this.state.editingBanner
        )
            .then( res => {
                this.setActiveBanner(res.data, res.data.id)
                this.setState({
                    editing: false,
                    editingBanner: {
                        name: "",
                        price: 0,
                        category: {
                            name:""
                        },
                        content: ""
                    }
                })
                this.getBanners()
            })
            .catch(e => {
                this.errorHandle(e)
            })
    }

    deleteBanner() {
        bannerService.deleteBanner(this.state.currentBanner.id)
            .then(() => {
                this.setState({
                    currentBanner: null,
                    currentId: -1,
                })
                this.getBanners()
            })
            .catch(e => {
                this.errorHandle(e)
            })
    }

////////////////////////////////////////////////

    errorHandle(e) {
        console.log(e)
        this.setState({
            onError: true
        })
         // (e.response && e.response.data) {
            this.setState({
                errorBody : [e]
            })
    // }
    }

    setCreateBanner() {
        this.setState({
            creating: true,
            editing: false,
        });
    }

    setEditBanner() {
        this.setState(res => ({
            editing: true,
            creating: false,
            editingBanner: {
                ...res.currentBanner
            }
        }));
    }

    setActiveBanner(banner, index) {
        this.setState({
            currentBanner: banner,
            currentId: index,
            editing: false,
            creating: false
        });
    }

////////////////////////////////////////////////

    cancelButton() {
        this.setState({
            editing: false,
            creating: false,
            onError: false,
            errorBody: []
        })
    }

    onChangeName(e) {
        const name = e.target.value;

        this.setState( res => ({
            editingBanner: {
                ...res.editingBanner,
                name: name
            }
        }))
    }

    onChangePrice(e) {
        const price = e.target.value;

        this.setState( res => ({
            editingBanner: {
                ...res.editingBanner,
                price: price
            }
        }))
    }

    onChangeCategory(e) {
        const category = e.target.value;
        const selectedOptions = e.target ? Array.from(e.target.selectedOptions) : []
        console.log(category, selectedOptions)
        this.setState( res => ({
            editingBanner: {
                ...res.editingBanner,
                categories: this.state.categories.filter(c=> selectedOptions.find(o => o.value === c.id.toString()))
            }
        }))
    }

    onChangeContent(e) {
        const content = e.target.value;

        this.setState( res => ({
            editingBanner: {
                ...res.editingBanner,
                content: content
            }
        }))
    }

/////////////////////////////////////////////////////////
    render() {
        const {searchName, banners, currentBanner, currentId, editing, creating, categories, editingBanner, errorBody} = this.state;


        return (
            <div className="lis row">
                <div className="col-sd-6">
                    <h4>
                        Banners:
                        <pre>{JSON.stringify(this.user)}</pre>
                    </h4>
                    <div className="col-sd-8">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Filter"
                                value={searchName}
                                onChange={this.onChangeSearchName}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-info"
                                    type="button"
                                    onClick={this.searchName}
                                >Filter</button>
                            </div>
                        </div>
                    </div>
                    <ul className="list-group">
                        {banners && banners.map((banner, _index) => (
                            <>

                                <li
                                    className={"list-group-item list-group-item-action" + (banner.id === currentId ? " active" : "")}
                                    onClick={() => this.setActiveBanner(banner, banner.id)}
                                    key={banner.id}
                                >
                                    {banner.name}
                                </li>
                            </>
                        ))}
                    </ul>
                    <button className="btn btn-primary" onClick={() => this.setCreateBanner()}>Create banner</button>
                </div>
                <div className="col-md-6">
                    {errorBody.length > 0 && <div class="alert alert-danger">{JSON.stringify(errorBody)}</div>}
                    {creating ? (
                        <div className="edit-form">
                            <h4 align="center">Create new banner</h4>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter banner name"
                                        onChange={this.onChangeName}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Price:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price"
                                        placeholder="Enter banner price"
                                        onChange={this.onChangePrice}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category">Category:</label>
                                    <div>
                                        <select class="form-control" multiple aria-label="Disabled select example"   onChange={this.onChangeCategory}>
                                            <option value="" disabled hidden >Choose category...</option>
                                            {categories && categories.map((category) => (
                                                <option value={category.id} key={category.id} selected={!!editingBanner.categories.find(c=> c.name === category.name)}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="content">Content:</label>
                                    <textarea
                                        rows="2"
                                        type="text"
                                        className="form-control"
                                        id="content"
                                        placeholder="Enter banner content"
                                        onChange={this.onChangeContent}
                                    />
                                </div>
                            </form>
                            <div>
                                <button className="btn btn-success" onClick={() => this.createBanner(currentBanner)}>Create</button>
                                <button className="btn btn-info" onClick={() => this.cancelButton()}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {currentBanner ? (
                                <div>
                                    {editing ? (
                                        <div className="edit-form">
                                            <h4 align="center"> Banner, id: {currentBanner.id} editing</h4>
                                            <form>
                                                <div className="form-group">
                                                    <label htmlFor="name">Name:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        value={editingBanner.name}
                                                        onChange={this.onChangeName}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="price">Price:</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="price"
                                                        value={editingBanner.price}
                                                        onChange={this.onChangePrice}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="category">Category:</label>
                                                    <div>
                                                        <select class="form-control" multiple onChange={this.onChangeCategory}>
                                                            {categories && categories.map((category) => (
                                                                <option value={category.id} key={category.id} selected={!!editingBanner.categories.find(c=> c.name === category.name)}>{category.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="content">Content:</label>
                                                    <textarea
                                                        rows="2"
                                                        type="text"
                                                        className="form-control"
                                                        id="content"
                                                        value={editingBanner.content}
                                                        onChange={this.onChangeContent}
                                                    />
                                                </div>
                                            </form>
                                            <div>
                                                <button className="btn btn-success" onClick={() => this.updateBanner()}>Save</button>
                                                {" "}
                                                <button className="btn btn-info" onClick={() => this.cancelButton()}>Cancel</button>
                                            </div>
                                        </div>

                                    ) : (
                                        <div>
                                            <h4>Description:</h4>
                                            <div><label><strong>Name:</strong></label>{currentBanner.name}</div>
                                            <div><label><strong>Price:</strong></label>{currentBanner.price}</div>
                                            <div><label><strong>Category:</strong></label> {currentBanner && currentBanner.categories.map((category) => (
                                                <div key={category.id}>{category.name}</div>
                                            ))}</div>
                                            <div><label><strong>Content:</strong></label>{currentBanner.content}</div>
                                            <button className="btn btn-warning" onClick={() => this.setEditBanner()}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => this.deleteBanner()}>Delete</button>

                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    <p>Choose banner</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className = {"container d-" + (this.state.onError ? "block" : "none")} role="alert">
                    <br/>
                    {errorBody && errorBody.map((error) => (
                        <div key={error.name} className="alert alert-danger">
                            {error.message}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

}

export default BannerComponent