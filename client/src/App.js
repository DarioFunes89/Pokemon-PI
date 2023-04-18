import './App.css';
import { BrowserRouter, Route, Switch} from 'react-router-dom'
import LandingPage from "./view/LandingPage/LandingPage"
import Home from './view/Home/Home';
import PokemonCreate from './view/PokemonCreate/PokemonCreate'
import Detail from './view/Detail/Detail'
import axios from 'axios'
axios.defaults.baseURL="https://pokemon-pi-production-2a39.up.railway.app"


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={LandingPage}/>
          <Route exact path="/home" component={Home}/>
          <Route path="/pokemons" component={PokemonCreate}/>
          <Route exact path="/home/:id" component={Detail}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
