import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./components/App";

const Root = () => {
  return (
    <RecoilRoot>
      <Router>
        <App />
      </Router>
    </RecoilRoot>
  );
};

export default Root;
