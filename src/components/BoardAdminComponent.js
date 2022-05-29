import React, { Component } from "react";

import UserService from "../services/UserService";
import EventBus from "../common/EventBus";

export default class BoardAdmin extends Component {
  constructor(props) {
    super(props);
    this.routeBanners = this.routeBanners.bind(this);
    this.routeCategories = this.routeCategories.bind(this);

    this.state = {
      content: "",
      banners:[],
      filter:'',
    };
  }

  routeBanners() {
    let path = '/banners';
    this.props.history.push(path);
  }

  routeCategories() {
    let path = '/categories';
    this.props.history.push(path);
  }

  componentDidMount() {
    UserService.getAdminBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    const filtered = this.state.banners.filter((item) => {
      return item.name;
    });
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
          <button className="btn btn-primary" onClick={this.routeBanners}>Modify Banners</button>
          <button className="btn btn-primary" onClick={this.routeCategories}>Modify Categories</button>
        </header>
      </div>
    );
  }
}
