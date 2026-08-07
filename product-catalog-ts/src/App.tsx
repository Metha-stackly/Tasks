import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import "./styles/App.css";

function App() {

  return (

    <>

      <Navbar />

      <div className="container">

        <Routes>

          <Route

            path="/"

            element={<Products />}

          />

          <Route

            path="/product/:id"

            element={<ProductDetails />}

          />

        </Routes>

      </div>

    </>

  );

}

export default App;