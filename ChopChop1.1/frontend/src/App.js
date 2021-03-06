import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import auth0Client from './Auth';
import NavBar from './NavBar/NavBar';
import Question from './Question/Question';
import Questions from './Questions/Questions';
import Callback from './Callback';
import NewQuestion from './NewQuestion/NewQuestion';
import SecuredRoute from './SecuredRoute/SecuredRoute';
import Distance from './Distance/Distance';
import { Map, Marker, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import CurrentLocation from './Map';

const mapStyles = {
  width: '50%',
  height: '50%',
  marginLeft: '263px',
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true,
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    }
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };


  async componentDidMount() {
    if (this.props.location.pathname === '/callback') {
      this.setState({checkingSession:false});
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
    this.setState({checkingSession:false});
  }

  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path='/' component={Questions}/>
        <Route exact path='/question/:questionId' component={Question}/>
        <Route exact path='/callback' component={Callback}/>\
        <Route exact path = '/' component = {Distance} />
        <SecuredRoute path='/new-question'
                      component={NewQuestion}
                      checkingSession={this.state.checkingSession} />
        <script src="https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.14.5/firebase-analytics.js"></script>

        <script>
          firebase.initializeApp(firebaseConfig);
          firebase.analytics();
        </script>
        <CurrentLocation
        centerAroundCurrentLocation
        google={this.props.google}
        >
        <Marker onClick={this.onMarkerClick} name={'current location'} />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </CurrentLocation>       
      </div>    
    );
  }
}

export default GoogleApiWrapper ({
  apiKey: 'AIzaSyDPKvgOhMorW7BVV6O9Z597wYb7L7p9Tcw'
}) (withRouter(App));
