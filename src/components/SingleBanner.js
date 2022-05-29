import React, {Component, useEffect} from 'react';
import bannerService from "../services/BannerService";
import categoryService from "../services/CategoryService";
import AuthService from "../services/AuthService";
import {Route, Switch, useParams } from "react-router-dom";
import Login from "./LoginComponent";
import Register from "./RegisterComponent";
import BoardUser from "./BoardUserComponent";
import BoardAdmin from "./BoardAdminComponent";
import CategoryComponent from "./CategoryComponent";

class SingleBanner extends Component {
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

        this.getBanner = this.getBanner.bind(this)
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
                category: {
                    name:""
                },
                content: ""
            }
        }
    }


    componentDidMount() {
        let { id } = this.props.params;
        this.getBanner(id)

        categoryService.getCategories()
            .then( res => {
                this.setState({...this.state, categories: res.data})
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
    getBanner(id) {
        return bannerService.getBannerById(id)
            .then(res => {
                this.setState({
                    ...this.state,
                    currentBanner: res.data,
                    onError: false,
                    editing: true,
                    editingBanner: res.data,
                    errorBody: []
                })
                return res.data
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
        this.setState({
            onError: true
        })
        if (e.response && e.response.data) {
            this.setState({
                errorBody : e.response.data.violations
            })}
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

        this.setState( res => ({
            editingBanner: {
                ...res.editingBanner,
                category: {
                    name: category
                }
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

        useEffect(() => {
            this.getBanner(this.params.id)
        }, [this.params]);

        return (
                <div>
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
                                        <select onChange={this.onChangeCategory} value={editingBanner.category.name}>
                                            <option value="" disabled hidden >Choose category...</option>
                                            {categories && categories.map((category) => (
                                                <option key={category.id}>{category.name}</option>
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
                                                        <select value={editingBanner.category.name} onChange={this.onChangeCategory}>
                                                            {categories && categories.map((category) => (
                                                                <option key={category.id}>{category.name}</option>
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
                                            <div><label>Name: <input type="text" readOnly value={currentBanner.name}/></label></div>
                                            <div><label>Price: <input type="text" readOnly value={currentBanner.price}/></label></div>
                                            <div><label>Category: <input type="text" readOnly value={currentBanner.category.name}/></label></div>
                                            <div><label>Text: <input type="text" readOnly value={currentBanner.content}/></label></div>
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
        );
    }
}

function withNavigate(Component) {
    return function(props) {
        // const navigate = useNavigate();
        const params = useParams();

        return <Component {...props} params={params} />;
    }
}

export default withNavigate(SingleBanner)