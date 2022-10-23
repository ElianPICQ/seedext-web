import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginScreen from "./screens/auth/login_screen";
import RegisterScreen from "./screens/auth/register_screen";
import ResetScreen from "./screens/auth/reset_screen";

import Feed from "./screens/feed"
import FeedDetail from "./screens/feed_detail"

import Video from "./screens/video";
import VideoDetail from "./screens/video_detail"

import Response from './screens/response'

import Profile from "./screens/profile"
import Match from "./screens/match";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginScreen />} />
          <Route exact path="/register" element={<RegisterScreen />} />
          <Route exact path="/reset" element={<ResetScreen />} />

          <Route path="/feed" element={<Feed />} />
          <Route path="/feed/:id" element={<FeedDetail />} />

          <Route path="/video" element={<Video />} />
          <Route path="/video/:id" element={<VideoDetail />} />

          <Route path="/response/:id" element={<Response />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/match" element={<Match/>} />

        </Routes>
      </Router>
    </div>
  );
}
export default App;
   

