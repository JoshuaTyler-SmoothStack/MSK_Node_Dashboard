// Libraries
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import LoggerUtils from "./utils/LoggerUtils";
import ResizeUtils from "./utils/ResizeUtils";

// Components
import Navbar from "./componentgroups/Navbar/Navbar";

// Pages
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

// Styles
import "./styles/bootstrap.css";
import "./styles/kit.css";

// Constants (Global)
import PageRoutes from "./pages/PageRoutes";

// Constants (Local)
const PAGE_CLASSNAME = "container-fluid h-100";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breakpoint: "xx_small",
    };
  }

  render() {
    return (
      <div id={"content"}>
        <header role={"header"}>
          <Navbar style={{ height: "60px" }}/>
        </header>
        <main role={"main"}>
          <Router>
            <Switch>
              {/* ========== SWITCH ========== */}
              {/* Home Page */}
              <Route exact path={PageRoutes.home}>
                <HomePage className={PAGE_CLASSNAME} />
              </Route>

              {/* 404 - No Path */}
              <Route path={PageRoutes.notFound}>
                <NotFoundPage className={PAGE_CLASSNAME} />
              </Route>
              <Redirect to={PageRoutes.notFound} />
              {/* ========== SWITCH ========== */}
            </Switch>
          </Router>
        </main>
      </div>
    );
  }

  componentDidMount() {
    ResizeUtils.initialize(
      (size) => this.onResize(size),
      () => {/* no display warning */},
      () => {/* no display warning */},
    );
  }

  onResize(size) {
    this.setState({ breakpoint: size });
    LoggerUtils.debug(size);
  }
}
export default App;
