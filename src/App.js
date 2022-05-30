import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/AuthService";

import Login from "./components/LoginComponent";
import Register from "./components/RegisterComponent";
import BoardUser from "./components/BoardUserComponent";
import BoardAdmin from "./components/BoardAdminComponent";

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import BannerComponent from "./components/BannerComponent";
import CategoryComponent from "./components/CategoryComponent";
import BannerViewComponent from "./components/BannerViewComponent";
import ProfileComponent from "./components/ProfileComponent";


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showAdminBoard: false,
      currentUser: undefined,
    });
  }


  render() {
    const { currentUser, showAdminBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
          </Link>
          <div className="navbar-nav mr-auto">
            {showAdminBoard && (<>
              <li className="nav-item">
              <Link to={"/banners"} className="nav-link">
                Banners
              </Link>
              </li>
              <li className="nav-item">
              <Link to={"/categories"} className="nav-link">
                Categories
              </Link>
              </li>
              </>
            )
            }
          </div>

          {currentUser ?  (
            <div className="navbar-nav ml-auto">
              {showAdminBoard && (
                  <li className="nav-item">
                    <Link to={"/admin"} className="nav-link">
                      Admin
                    </Link>
                  </li>
              )}
              {currentUser && (
                    <li className="nav-item">
                      <Link to={"/user"} className="nav-link">
                        User
                      </Link>
                    </li>
              )
              }
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>     

        <div className="container-fluid mt-3">
          <Switch>
            <Route exact path={"/"} component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="/user" component={BannerViewComponent} />
            <Route path="/profile" component={ProfileComponent} />
            {showAdminBoard && <Route path="/admin" component={BoardAdmin}/>}
            {showAdminBoard && <Route path="/banners" component={BannerComponent}/>}
            {showAdminBoard && <Route path="/categories" component={CategoryComponent} />}

          </Switch>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */ }
      </div>
    );
  }
}
export default App;
