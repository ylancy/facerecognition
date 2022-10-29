import React, { Component } from 'react';
import './App.css';
import { onAuthStateChangedListener, getUserAndDoc, updateUser } from "./utili/firebase";
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';

const emptyState = {
  imageUrl: '',
  boxes: [],
  route: 'signin',
  signedIn: false,
  user: {
    uid: '',
    name: '',
    email: '',
    entries: '',
    joined: ''
  }
};
class App extends Component {

  constructor() {
    super();
    this.state = emptyState;
  }

  resetState = () => {
    this.setState(emptyState);
  }

  readFirebase = async (currentUid) => {
    const userMap = await getUserAndDoc();
    const currentUser = userMap.find(user => user.uid === currentUid);
    this.setState({
      user: {
        uid: currentUid,
        name: currentUser.name,
        email: currentUser.email,
        entries: currentUser.entries,
        joined: currentUser.joined
      }
    });
  }

  componentDidMount() {
    onAuthStateChangedListener(async (user) => {
      if (user) {
        const currentUid = user.uid;
        this.readFirebase(currentUid);
        this.onRouteChange('home');

      } else {
        this.setState({
          user: {
            uid: '',
            name: '',
            email: '',
            entries: '',
            joined: ''
          }
        });
      }
    });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions.map((region) => region.region_info.bounding_box);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    const result =
      clarifaiFace.map((points) => {
        return {
          leftCol: points.left_col * width,
          topRow: points.top_row * height,
          rightCol: width - (points.right_col * width),
          bottomRow: height - (points.bottom_row * height)
        }
      });
    return result;
  }

  displayFaceBox = (box) => {
    this.setState({ boxes: box });
  }

  onInputChange = (event) => {
    this.setState({
      imageUrl: (event.target.value),
      boxes: []
    });
  }

  onRouteChange = (route) => {
    if (route === 'home') {
      this.setState({ signedIn: true })
    } else {
      this.setState({ signedIn: false })
    }
    this.setState({ route: route });
  }

  onButtonSubmit = () => {
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": "z3mbyqbwvnso",
        "app_id": "my-first-application"
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": this.state.imageUrl
            }
          }
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key 84033e8441774ff2860ccd25b172dadd'
      },
      body: raw
    };

    fetch("https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs", requestOptions)
      .then(res => res.json())
      .then(async data => {
        await updateUser(this.state.user);
        const currentUid = this.state.user.uid;
        this.readFirebase(currentUid);
        this.displayFaceBox(this.calculateFaceLocation(data));
      })
      .catch(error => console.log('error', error));
  }

  render() {
    return (
      <div className="App">
        <Navigation onRouteChange={this.onRouteChange} signedIn={this.state.signedIn} resetState={this.resetState} />
        {this.state.route === 'signin'
          ? < Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          : (this.state.route === 'home')
            ? this.state.user.uid === '' ? <p>Loading...</p> : <div>
              <Logo />
              <Rank entries={this.state.user.entries} name={this.state.user.name} />
              <ImageLinkForm
                imageUrl={this.state.imageUrl}
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition imageUrl={this.state.imageUrl} boxes={this.state.boxes} />
            </div>
            : < Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />}
      </div>
    );
  }


}


export default App;
