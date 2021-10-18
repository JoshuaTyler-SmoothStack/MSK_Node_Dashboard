// Libraries
import React, { Component } from "react";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={this.props.className || ""} style={this.props.style}>

        {/* Icon gallery of technologies */}
        <section
          className={"jumbotron text-center mt-2 kit-border-shadow"}
        >
          <div className={"row d-flex justify-content-around"}>
            Hello World!
          </div>
        </section>

      </div>
    );
  }
}
export default HomePage;
