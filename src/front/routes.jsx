// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Ads from "./pages/Ads";
import Auth from "./pages/Auth";
import Product from "./pages/Product";
import DaPaintCreate from "./pages/DaPaintCreate";
import DaPaintSubmit from "./pages/DaPaintSubmit";
import DaPaintFilter from "./pages/DaPaintFilter";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Feedback from "./pages/Feedback";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>404 Not found!</h1>}>
      {/* Landing Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/ads" element={<Ads />} />
      
      {/* Auth */}
      <Route path="/auth" element={<Auth />} />
      
      {/* Main App Pages (for authenticated users) */}
      <Route path="/product" element={<Product />} />
      <Route path="/create" element={<DaPaintCreate />} />
      <Route path="/submit" element={<DaPaintSubmit />} />
      <Route path="/filter" element={<DaPaintFilter />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/feedback" element={<Feedback />} />
    </Route>
  )
);