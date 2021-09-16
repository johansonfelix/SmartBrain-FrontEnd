import "./App.css";
import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Entries from "./components/Entries/Entries";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

const particlesOptions = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#eb4034",
        blur: 5,
      },
    },
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 500,
      },
    },
  },
};

const initialState = {
  input: "",
  imageURL: "",
  boxes: {
    locations: [],
    gender: "",
    age: "",
    ethnicity: "",
  },
  isGroup: false,
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (detection) => {
    const clarifaiFaceDetectionData = detection.outputs[0].data.regions;

    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    const boxData = clarifaiFaceDetectionData.map((el) => {
      const data = el.region_info.bounding_box;

      return {
        leftCol: data.left_col * width,
        topRow: data.top_row * height,
        rightCol: width - data.right_col * width,
        bottomRow: height - data.bottom_row * height,
      };
    });

    return boxData;
  };

  displayFaceBoxes = (boxes) => {
    this.setState((prevState) => ({
      boxes: {
        ...prevState.boxes,
        locations: boxes,
      },
    }));
    if (this.state.boxes.locations.length > 1) {
      this.setState({ isGroup: true }, () => {});
    } else {
      this.setState({ isGroup: false }, () => {});
    }
  };

  displayGender = (detection) => {
    console.log(detection);
    const clarifaiGenderData = detection.outputs[0].data.concepts[0].name;
    let gender = "Unknown";
    switch (clarifaiGenderData.toUpperCase()) {
      case "FEMININE":
        gender = "Female";
        break;
      case "MASCULINE":
        gender = "Male";
        break;
      default:
        gender = "Unknown";
    }

    this.setState((prevState) => ({
      boxes: {
        ...prevState.boxes,
        gender: gender,
      },
    }));
  };

  displayAge = (detection) => {
    const clarifaiAgeData = detection.outputs[0].data.concepts[0].name;

    let age = "Unknown";
    if (clarifaiAgeData) age = clarifaiAgeData;

    this.setState((prevState) => ({
      boxes: {
        ...prevState.boxes,
        age: age,
      },
    }));
  };

  displayEthnicity = (detection) => {
    const clarifaiEthnicityData = detection.outputs[0].data.concepts[0].name;

    let ethnicity = "Unknown";
    if (clarifaiEthnicityData) ethnicity = clarifaiEthnicityData;

    this.setState((prevState) => ({
      boxes: {
        ...prevState.boxes,
        ethnicity: ethnicity,
      },
    }));
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onSubmit = () => {
    this.setState({ imageURL: this.state.input });

    fetch("http://localhost:3001/imagedetection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch("http://localhost:3001/image/", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              this.setState(Object.assign(this.state.user, { entries: data }));
            })
            .catch((err) => console.log);
        }
        this.displayFaceBoxes(this.calculateFaceLocation(response));
      })
      .catch((err) => this.handleError(err));

    fetch("http://localhost:3001/gender", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((gender) => this.displayGender(gender))
      .catch((err) => console.log(err));

    fetch("http://localhost:3001/age", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((age) => this.displayAge(age))
      .catch((err) => console.log(err));

    fetch("http://localhost:3001/ethnicity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((ethnicity) => this.displayEthnicity(ethnicity))
      .catch((err) => console.log(err));
  };
  handleEnter = (e) => {
    if (e.key === "Enter") {
      this.onSubmit();
    }
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };
  render() {
    const { isSignedIn, imageURL, route, boxes, isGroup } = this.state;

    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Entries
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
              handleEnter={this.handleEnter}
            />

            <FaceRecognition
              isGroup={isGroup}
              boxes={boxes}
              imageURL={imageURL}
            />
          </div>
        ) : route === "register" ? (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        ) : (
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        )}
      </div>
    );
  }
}

export default App;
