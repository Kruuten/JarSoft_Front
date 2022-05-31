import React, { Component } from 'react';
import CategoryService from '../services/CategoryService';

class CategoryComponent extends Component {
    constructor(props) {
        super(props)
        this.onChangeSearchName = this.onChangeSearchName.bind(this)
        this.onChangeName = this.onChangeName.bind(this)
        this.onChangeReqName = this.onChangeReqName.bind(this)

        this.setActiveCategory = this.setActiveCategory.bind(this)
        this.searchName = this.searchName.bind(this)

        this.setEditCategory = this.setEditCategory.bind(this)
        this.setCreateCategory = this.setCreateCategory.bind(this)

        this.getCategories = this.getCategories.bind(this)
        this.updateCategory = this.updateCategory.bind(this)
        this.createCategory = this.createCategory.bind(this)
        this.deleteCategory = this.deleteCategory.bind(this)

        this.cancelButton = this.cancelButton.bind(this)

        this.state = {
            categories: [],

            currentCategory: null,
            currentId: -1,
            searchName: "",

            editing: false,
            creating: false,
            onError: false,
            errorBody: [],

            editingCategory: {
                name: "",
                reqName: "",
            }
        }
    }

    componentDidMount() {
        this.getCategories()
    }

    getCategories() {
        CategoryService.getCategories()
            .then(res => {
                this.setState({
                    categories: res.data,
                    onError: false,
                    errorBody: []
                })
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
        CategoryService.findCategoryByName(this.state.searchName)
            .then( res => {
                this.setState({
                    categories: res.data
                });
            })
    }

    createCategory() {
        CategoryService.createCategory(this.state.editingCategory)
            .then( res => {
                this.setActiveCategory(res.data, res.data.id)
                this.setState({
                    creating: false,
                    editingCategory: {
                        name: "",
                        reqName: ""
                    }
                })
                this.getCategories()
            })
            .catch(e => {
                this.errorHandle(e);
            })
    }

    updateCategory() {
        CategoryService.updateCategory(
            this.state.editingCategory,
            this.state.currentCategory.id,

        )
            .then( res => {
                this.setActiveCategory(res.data, res.data.id)
                this.setState({
                    ...this.state,
                    editing: false,
                    editingCategory: {
                        ...this.state.editingCategory,
                        name: "",
                        reqName: ""
                    }
                })
                console.log()
                this.getCategories()
            })
            .catch(e => {
                console.log(e)
                this.errorHandle(e);
            })
    }

    deleteCategory() {
        console.log(this.state.currentCategory.id)
        CategoryService.deleteCategory(this.state.currentCategory.id)
            .then(() => {
                this.setState({
                    currentCategory: null,
                    currentId: -1,
                })
                this.getCategories()
            })
            .catch(e => {
                this.errorHandle(e);
            })
    }

    errorHandle(e) {
        this.setState({
            onError: true
        })
        if (e.response && e.response.data) {
            this.setState({
                errorBody : e.response.data.violations
            })}
    }

    setCreateCategory() {
        this.setState({
            creating: true,
            editing: false,
        });
    }

    setEditCategory() {
        this.setState(res => ({
            editing: true,
            creating: false,
            editingCategory: {
                ...res.currentCategory
            }
        }));
    }

    setActiveCategory(category, id) {
        this.setState({
            currentCategory: category,
            currentId: id,
            editing: false,
            creating: false
        });
    }

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
            editingCategory: {
                ...res.editingCategory,
                name: name
            }
        }))
    }

    onChangeReqName(e) {
        const reqName = e.target.value;

        this.setState( res => ({
            editingCategory: {
                ...res.editingCategory,
                reqName: reqName
            }
        }))
    }

    render() {
        const {searchName, categories, currentCategory, currentId, editing, creating, editingCategory, errorBody} = this.state;
        return (
            <div className="lis row">
                <div className="col-sd-6">
                    <h4>
                        Categories:
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
                        {categories && categories.map((category, _index) => (
                            <li
                                className={"list-group-item list-group-item-action" + (category.id === currentId ? " active" : "")}
                                onClick={() => this.setActiveCategory(category, category.id)}
                                key={category.id}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-primary" onClick={() => this.setCreateCategory()}>Create category</button>
                </div>
                <div className="col-md-6">
                    {creating ? (
                        <div className="edit-form">
                            <h4 align="center">Create new category</h4>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter category name"
                                        onChange={this.onChangeName}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Request ID:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="price"
                                        placeholder="Enter short req_name"
                                        onChange={this.onChangeReqName}
                                    />
                                </div>
                            </form>
                            <div>
                                <button className="btn btn-success" onClick={() => this.createCategory()}>Create</button>
                                <button className="btn btn-info" onClick={() => this.cancelButton()}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {currentCategory ? (
                                <div>
                                    {editing ? (
                                        <div className="edit-form">
                                            <h4 align="center">Category, id: {currentCategory.id} editing</h4>
                                            <form>
                                                <div className="form-group">
                                                    <label htmlFor="name">Name:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        value={editingCategory.name}
                                                        onChange={this.onChangeName}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="reqName">Request ID:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="price"
                                                        value={editingCategory.reqName}
                                                        onChange={this.onChangeReqName}
                                                    />
                                                </div>
                                            </form>
                                            <div>
                                                <button className="btn btn-success" onClick={() => this.updateCategory()}>Save</button>
                                                {" "}
                                                <button className="btn btn-info" onClick={() => this.cancelButton()}>Cancel</button>
                                            </div>
                                        </div>

                                    ) : (
                                        <div>
                                                <h4>Description:</h4>
                                                <div><label>Name: <input type="text" readOnly value={currentCategory.name}/></label></div>
                                                <div><label>Request ID: <input type="text" readOnly value={currentCategory.reqName}/></label></div>
                                                <button className="btn btn-warning" onClick={() => this.setEditCategory()}>Edit</button>
                                                <button className="btn btn-danger" onClick={() => this.deleteCategory()}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <p>Choose category</p>
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


export default CategoryComponent;