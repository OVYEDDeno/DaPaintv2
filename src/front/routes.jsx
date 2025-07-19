// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Ads from "./pages/Ads";
import Auth from "./pages/1Auth";
import Product from "./pages/Product";
import DaPaintCreate from "./pages/14CreateMyDaPaint";
import DaPaintSubmit from "./pages/DaPaintSubmit";
import DaPaintFilter from "./pages/DaPaintFilter";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Feedback from "./pages/Feedback";
import AdvertiseOnDaPaint from "./pages/AdvertiseOnDaPaint";
import AdvertiseOnDaPaintToken from "./pages/AdvertiseOnDaPaintToken";
import LockInDaPaint from "./pages/13LockInDaPaint";
import PlayOnDaPaint from "./pages/1PlayOnDaPaint";
import PlayOnDaPaintToken from "./pages/2PlayOnDaPaintToken";
import LineupOnDaPaint from "./pages/LineupOnDaPaint";
import MyDaPaintSales from "./pages/MyDaPaintSales";
import StartMyDaPaint from "./pages/StartMyDaPaint";
import Tickets from "./pages/Tickets";
import AdsCopy from "./pages/Ads copy";

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
      <Route path="/advertise" element={<AdvertiseOnDaPaint />} />
      <Route path="/advertise-token" element={<AdvertiseOnDaPaintToken />} />
      <Route path="/lockin" element={<LockInDaPaint />} />
      <Route path="/play" element={<PlayOnDaPaint />} />
      <Route path="/play-token" element={<PlayOnDaPaintToken />} />
      <Route path="/lineupondapaint" element={<LineupOnDaPaint />} />
      <Route path="/sales" element={<MyDaPaintSales />} />
      <Route path="/start" element={<StartMyDaPaint />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/ads copy" element={<AdsCopy />} />
    </Route>
  )
);