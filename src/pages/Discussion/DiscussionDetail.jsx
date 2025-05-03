import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

function DiscussionDetail() {
  const { discussionId } = useParams();
  const { user } = useAuth();

  const [discussion, setDiscussion] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscussion();
  }, [discussionId]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${VITE_APP_BACKEND_URL}/api/common/asked-questions/${discussionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setDiscussion(res.data);
    } catch (err) {
      console.error("Error fetching discussion:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(
        `${VITE_APP_BACKEND_URL}/api/common/reply`,
        { message: newComment,
          questionId:discussionId
         },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setNewComment("");
      fetchDiscussion(); // reload comments
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading discussion...</div>;
  if (!discussion) return <div className="text-center mt-10 text-red-500">Discussion not found</div>;

  const { question, replies } = discussion;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
      <p className="text-gray-700 mb-2">Asked by: {question.userId.name}</p>
      <div className="bg-gray-100 p-4 rounded mb-6 whitespace-pre-wrap">{question.description}</div>

            {/* Add Reply */}
            {user ? (
        <div>
          <textarea
            rows={4}
            placeholder="Write your reply..."
            className="w-full border rounded p-3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? "Posting..." : "Post Reply"}
          </button>
        </div>
      ) : (
        <p className="text-red-500">Login to reply.</p>
      )}

      {/* Replies */}
      <h2 className="text-xl font-semibold mb-2">Replies</h2>

      <div className="space-y-4 mb-6">
  {replies.length > 0 ? (
    replies.map((reply) => (
      <div
        key={reply._id}
        className="bg-white border p-3 rounded shadow-sm"
      >
        <p className="text-gray-800 whitespace-pre-wrap">{reply.message}</p>
        <p className="text-sm text-gray-500 mt-1">
          By: {reply.userId?.name || "Anonymous"}
        </p>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No replies yet. Be the first to reply!</p>
  )}
</div>



    </div>
  );
}

export default DiscussionDetail;
