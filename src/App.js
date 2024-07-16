import logo from "./logo.svg";
import "./App.css";
import HomePage from "pages/HomePage";
import { RouterProvider } from "react-router-dom";
import { router } from "pages/router";

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
