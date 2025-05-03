import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login")
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-blue-600">
        SkillTrack
      </Link>

      <nav className="flex gap-6 items-center">
      {user?.role === "learner" &&  <strong> Points Earned {user.xp}</strong> }
        {user?.role === "learner" && (
          <Link to="/ask-question" className="text-gray-700 hover:text-blue-600">
            Ask a Question
          </Link>
        )}

        <Link to="/discussion" className="text-gray-700 hover:text-blue-600">
          Public Threads
        </Link>

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
