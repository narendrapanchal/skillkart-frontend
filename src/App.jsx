import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LearnerDashboard from "./pages/LearnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Header from "./components/Header";
import AskQuestion from "./pages/AskQuestion";
import Discussions from "./pages/Discussion/Discussions";
import DiscussionDetail from "./pages/Discussion/DiscussionDetail";

function App() {
  const {user} =useAuth();
  return (
    <Router>
      <Header/>
       <AuthProvider>
        <Routes>
          <Route path="/" element={user?.role=="learner" && <LearnerDashboard />||user?.role=="admin" && <AdminDashboard/>||<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ask-question" element={user?.role=="learner" && <AskQuestion/> || <Login/>}  />
          <Route path="/discussion" element={((user?.role=="learner" || user?.role=="admin") && <Discussions/>) || <Login/>}  />
          <Route path="/discussion/:discussionId" element={((user?.role=="learner" || user?.role=="admin") && <DiscussionDetail/>) || <Login/>}  />
        </Routes>
       </AuthProvider>
      </Router>
  );
}

export default App;