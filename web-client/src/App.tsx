import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { Home,HOME_PAGE_ADDRESS } from "./pages/Home"

const App: React.FC = () => {

  return (
    <div className="App">
      <Router>
        <AppWrapper />
      </Router>
    </div>
  );
};

const AppWrapper: React.FC = () => {
  const location = useLocation();

  return (
        <Switch location={location}>
          <Route exact path={HOME_PAGE_ADDRESS} component={Home} />
          <Route path="*" render={() => <h1>404 Not Found</h1>} />
        </Switch>
        );
};

export default App;
