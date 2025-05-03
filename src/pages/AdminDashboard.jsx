import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

function AdminDashboard() {
  const { user } = useAuth();
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [step, setStep] = useState({ title: "", type: "video", link: "", time: 0, skill: "" });

  // Fetch available skills
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

  useEffect(() => {
    fetchSkills();
  }, []);

  // Add new skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${VITE_APP_BACKEND_URL}/api/admin/add-skill`, { skill: newSkill }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Skill added!");
      setNewSkill("");
      fetchSkills();
    } catch (error) {
      console.error(error);
    }
  };


  // Add single step
  const handleStepSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${VITE_APP_BACKEND_URL}/api/admin/add-step/${step.skill}`, step, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Step added!");
      setStep({ title: "", type: "video", link: "", time: "", skill: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Add Skill */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Add Skill / Roadmap</h2>
        <form onSubmit={handleAddSkill} className="flex gap-4">
          <input
            type="text"
            placeholder="Skill name"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Add Skill
          </button>
        </form>
      </div>


      {/* Add Step */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Add a step for Roadmap / Skill</h2>
        <form onSubmit={handleStepSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Step Title"
            value={step.title}
            onChange={(e) => setStep({ ...step, title: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />

          <select
            value={step.type}
            onChange={(e) => setStep({ ...step, type: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="video">Video</option>
            <option value="blog">Blog</option>
            <option value="quiz">Quiz</option>
          </select>

          <input
            type="text"
            placeholder="Link"
            value={step.link}
            onChange={(e) => setStep({ ...step, link: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="number"
            placeholder="Time (hrs)"
            value={step.time}
            onChange={(e) => setStep({ ...step, time: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />

          <select
            value={step.skill}
            onChange={(e) => setStep({ ...step, skill: e.target.value })}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Skill</option>
            {skills.map((skill) => (
              <option key={skill._id} value={skill._id}>
                {skill.skill}
              </option>
            ))}
          </select>

          <button type="submit" className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 w-full">
            Add Step
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminDashboard;
