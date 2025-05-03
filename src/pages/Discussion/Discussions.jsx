import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

function Discussions() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const queryUserId = params.get("userId");
  const querySkillId = params.get("skillId");

  const [questions, setQuestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState(queryUserId ? "my" : "all");
  const [selectedSkill, setSelectedSkill] = useState(querySkillId || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Fetch questions when filters/page change
  useEffect(() => {
    fetchQuestions();
  }, [filter, selectedSkill, page]);

  const fetchSkills = async () => {
    try {
      const res = await axios.get(`${VITE_APP_BACKEND_URL}/api/public/skills`);
      setSkills(res.data);
    } catch (err) {
      console.error("Error fetching skills", err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.post(
        `${VITE_APP_BACKEND_URL}/api/common/asked-questions`,
        {},
        {
          params: {
            userId: filter === "my" ? (queryUserId || user?._id) : "",
            skillId: selectedSkill || "",
            page,
            perPage: 2,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setQuestions(res.data.questions);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching questions", err);
    }
  };

  const updateURL = (newFilter, newSkill) => {
    const searchParams = new URLSearchParams();
    if (newFilter === "my") searchParams.set("userId", user?._id);
    if (newSkill) searchParams.set("skillId", newSkill);
    navigate(`/discussion?${searchParams.toString()}`);
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    setPage(1);
    updateURL(newFilter, selectedSkill);
  };

  const handleSkillChange = (e) => {
    const newSkill = e.target.value;
    setSelectedSkill(newSkill);
    setPage(1);
    updateURL(filter, newSkill);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Public Discussions</h1>

      {/* Filters */}
      <div className="mb-4 flex justify-end items-center gap-4 flex-wrap">
        {/* Role Filter */}
        {/* {user.role === "learner" && (
          <select
            value={filter}
            onChange={handleFilterChange}
            className="border px-4 py-2 rounded-md"
          >
            <option value="all">All Questions</option>
            <option value="my">My Questions</option>
          </select>
        )} */}

        {/* Skill Filter */}
        <select
          value={selectedSkill}
          onChange={handleSkillChange}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">All Roadmap / Skills</option>
          {skills.map((s) => (
            <option key={s._id} value={s._id}>
              {s.skill}
            </option>
          ))}
        </select>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map((q) => (
            <Link
              key={q._id}
              to={`/discussion/${q._id}`}
              className="block bg-white shadow-md p-4 rounded-md hover:bg-blue-50 transition"
            >
              <h2 className="text-lg font-semibold text-blue-600">{q.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Asked by: {q.name || "Anonymous"}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-gray-600 text-center">No questions found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Discussions;
