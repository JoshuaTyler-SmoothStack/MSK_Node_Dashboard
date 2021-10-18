// Libraries
import { Link } from "react-router-dom";
import React, { Component } from "react";

// Constants
import PageRoutes from "../PageRoutes";

class NotFoundPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        <div className={"row d-flex justify-content-center"}>
          {/* Card */}
          <div
            className={"card p-2 mt-3 mt-5 text-center"}
            style={{ maxWidth: "25rem" }}
          >
            {/* Header */}
            <h3 className={"card-title"}>{"404 - Page Not Found"}</h3>
            <hr className={"w-100 mt-0"} />

            {/* Body */}
            <div className={"card-body"}>
              {
                "It seems the page you're looking for may have moved or does not exist."
              }
            </div>

            {/* Button */}
            <div className={"ml-auto mr-3"}>
              <Link to={PageRoutes.home}>
                <button
                  className={"btn btn-success text-white kit-text-shadow-sm"}
                >
                  {"Home"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default NotFoundPage;
