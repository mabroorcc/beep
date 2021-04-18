import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { Home, HOME_PAGE_ADDRESS } from "./pages/Home";
import { UploadFile, UPLOAD_PAGE_ADDRESS } from "./pages/UploadFile";
import { useAppSelector } from "./app/hooks";
import { selectUser } from "./features/user/userSlice";

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
  const user = useAppSelector(selectUser);

  return (
    <Switch location={location}>
      <Route exact path={HOME_PAGE_ADDRESS} component={Home} />
      {user && (
        <Route exact path={UPLOAD_PAGE_ADDRESS} component={UploadFile} />
      )}
      <Route path="*" component={Home} />
    </Switch>
  );
};

export default App;
