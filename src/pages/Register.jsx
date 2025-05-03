import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const goalsOptions = ["Get a job", "Build a portfolio", "Switch career", "Learn for fun"];

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interest, setInterest] = useState("");
  const [goal, setGoal] = useState("");
  const [weeklyTime, setWeeklyTime] = useState();
  const [skills, setSkills] = useState([]);
  
  const fetchSkills = async () => {
    try {
      const res = await axios.get(`${VITE_APP_BACKEND_URL}/api/public/skills`, {
      });
      console.log(res.data)
      setSkills(res.data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };
  useEffect(()=>{
    fetchSkills();
  },[])
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!interest || !goal || !weeklyTime) {
      alert("Please select interest, goal, and weekly time.");
      return;
    }

    try {
      await axios.post(`${VITE_APP_BACKEND_URL}/api/auth/register`, {
        name,
        email,
        password,
        interest,
        goal,
        weeklyTime,
      });
      alert("Registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <div>
          <label className="font-medium block mb-1">Interest <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-4">
            {skills.map((item) => (
              <label key={item._id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="interest"
                  value={item._id}
                  checked={interest === item}
                  onChange={() => setInterest(item)}
                  required
                />
                {item.skill}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-medium block mb-1">Goal <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-4">
            {goalsOptions.map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="goal"
                  value={item}
                  checked={goal === item}
                  onChange={() => setGoal(item)}
                  required
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-medium block mb-1">Available Weekly Time <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-4">
            {[10, 20, 30, 40].map((time) => (
              <label key={time} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="weeklyTime"
                  value={time}
                  checked={weeklyTime === time}
                  onChange={() => setWeeklyTime(time)}
                  required
                />
                {time}+ hours/week
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>

        <p className="text-center text-sm">
          Already have an account? <Link to="/" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
