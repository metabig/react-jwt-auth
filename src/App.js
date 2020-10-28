import React, { useEffect, useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardAdmin from "./components/board-admin.component";
import DataEntry from "./components/data-entry.component"

export default function App() {
  const [showAdminBoard, setShowAdminBoard] = useState(false)
  const [showUserBoard, setShowUserBoard] = useState(false)
  const [currentUser, setCurrentUser] = useState(undefined)

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    setCurrentUser(user)
    if (user) {
      setShowAdminBoard(user.role === "admin")
      setShowUserBoard(user.role === "admin" || user.role === "trusted")
    }
  }, [])

  const logOut = () => {
    AuthService.logout();
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          Data Validation
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li>
          {showUserBoard &&
          <li className="nav-item">
            <Link to={"/user"} className="nav-link">
              User
              </Link>
          </li>
          }
          {showUserBoard &&
          <li className="nav-item">
            <Link to={"/data-entry"} className="nav-link">
              Data Entry
              </Link>
          </li>
          }
          {showAdminBoard &&
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Board
              </Link>
            </li>
          }
        </div>
        {currentUser ? (

          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
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

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/user" component={BoardUser} />
          <Route path="/admin" component={BoardAdmin} />
          <Route path="/data-entry" component={DataEntry} />
        </Switch>
      </div>
    </div>
  );
}
