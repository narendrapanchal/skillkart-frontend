import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { FaYoutube, FaBook, FaQuestion, FaChevronDown } from "react-icons/fa";

const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

function LearnerDashboard() {
  const { user, setUser } = useAuth();
  const [steps, setSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState(user.completedSteps);
  const [openWeek, setOpenWeek] = useState(null);

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      const res = await axios.post(
        `${VITE_APP_BACKEND_URL}/api/learner/my-roadmap`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSteps(res.data.steps || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (stepId,type) => {
    try {
      const res = await axios.post(
        `${VITE_APP_BACKEND_URL}/api/learner/mark-step`,
        { stepId,type },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setCompletedSteps(res.data.completedSteps);
      setUser({...user,...res.data});
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    if (type === "video") return <FaYoutube className="text-red-500" />;
    if (type === "blog") return <FaBook className="text-blue-500" />;
    if (type === "quiz") return <FaQuestion className="text-yellow-500" />;
    return null;
  };

  const groupStepsByWeek = (steps, hoursPerWeek = 10) => {
    const weeks = [];
    let currentWeek = [];
    let currentHours = 0;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      // Always include the first step in week 1
      if (weeks.length === 0) {
        currentWeek.push(step);
        currentHours += step.timeToComplete;
        if (currentHours >= hoursPerWeek) {
          weeks.push(currentWeek);
          currentWeek = [];
          currentHours = 0;
        }
        continue;
      }

      if (currentHours + step.timeToComplete > hoursPerWeek) {
        if (currentWeek.length) weeks.push(currentWeek);
        currentWeek = [step];
        currentHours = step.timeToComplete;
      } else {
        currentWeek.push(step);
        currentHours += step.timeToComplete;
      }
    }

    if (currentWeek.length) weeks.push(currentWeek);
    return weeks;
  };

  const totalProgress = steps.length
    ? Math.floor((completedSteps.length / steps.length) * 100)
    : 0;

  const weekGroups = groupStepsByWeek(steps);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{user.skillName} Roadmap</h1>

      {/* Total Progress */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${totalProgress}%` }}
        ></div>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        {completedSteps.length} / {steps.length} steps completed
      </p>

      {/* Accordion Weeks */}
      {weekGroups.map((weekSteps, i) => {
        const weekCompleted = weekSteps.filter((step) =>
          completedSteps.includes(step._id)
        ).length;
        const weekProgress = Math.floor(
          (weekCompleted / weekSteps.length) * 100
        );

        return (
          <div key={i} className="mb-4 border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenWeek(openWeek === i ? null : i)}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-left"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">Week {i + 1}</span>
                <FaChevronDown
                  className={`transition-transform ${
                    openWeek === i ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Progress Bar on Accordion Header */}
              <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${weekProgress}%` }}
                ></div>
              </div>
            </button>

            {openWeek === i && (
              <div className="bg-white px-4 py-3">
                {weekSteps.map((step) => (
                  <div
                    key={step._id}
                    className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        disabled={completedSteps.includes(step._id)}
                        checked={completedSteps.includes(step._id)}
                        onChange={() => handleComplete(step._id,step.type)}
                      />
                      {getIcon(step.type)}
                      <a
                        href={step.link}
                        target="_blank"
                        className="text-blue-600 font-medium hover:underline"
                      >
                        {step.title}
                      </a>
                    </div>
                    <span className="text-sm text-gray-500">
                      {step.timeToComplete} hr
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default LearnerDashboard;
