import React, { useState } from "react";
import axios from "axios";
const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
import { useAuth } from "../contexts/AuthContext";
function AskQuestion() {
  const {user} =useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(
        `${VITE_APP_BACKEND_URL}/api/learner/ask-question`, // adjust if route is different
        { title, description: content, skill:user.interest }, // content = description
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // if auth is needed
          },
        }
      );
  
      console.log("Question submitted:", res.data);
  
      // Reset fields
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error submitting question:", err);
    }
  };
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Ask a Question</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            placeholder="e.g., How to center a div in CSS?"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Your Question</label>
          <textarea
            rows="10"
            placeholder="Write your question here... (you can include code or examples)"
            className="w-full border border-gray-300 rounded-md p-3 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
}

export default AskQuestion;
