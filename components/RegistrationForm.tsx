"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Participant {
  id: string;
  name: string;
  rollNo: string;
  gender: string;
  mobile: string;
  email: string;
}

interface RegistrationFormProps {
  eventName?: string;
}

export default function RegistrationForm({
  eventName = "Event",
}: RegistrationFormProps) {
  const [registrationType, setRegistrationType] = useState<
    "individual" | "team" | null
  >(null);
  const [teamName, setTeamName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", name: "", rollNo: "", gender: "", mobile: "", email: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const addParticipant = () => {
    setParticipants([
      ...participants,
      {
        id: Date.now().toString(),
        name: "",
        rollNo: "",
        gender: "",
        mobile: "",
        email: "",
      },
    ]);
  };

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  const updateParticipant = (
    id: string,
    field: keyof Participant,
    value: string
  ) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const participationType =
        registrationType === "individual" ? "solo" : "team";
      const [firstParticipant, ...restParticipants] = participants;

      const requestData = {
        participationType,
        teamName: registrationType === "team" ? teamName : undefined,
        leaderName: firstParticipant.name,
        leaderGender: firstParticipant.gender,
        leaderRollNumber: firstParticipant.rollNo,
        leaderContactNumber: firstParticipant.mobile,
        leaderEmail: firstParticipant.email,
        teamMembers:
          registrationType === "team"
            ? restParticipants.map((p) => ({
                name: p.name,
                gender: p.gender,
                rollNumber: p.rollNo,
                contactNumber: p.mobile,
                email: p.email,
              }))
            : [],
      };

      const response = await fetch(
        `/api/registrations/${encodeURIComponent(eventName)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Registration successful!");
        setMessage({
          type: "success",
          text: data.message || "Registration successful!",
        });
        setRegistrationType(null);
        setTeamName("");
        setParticipants([
          { id: "1", name: "", rollNo: "", gender: "", mobile: "", email: "" },
        ]);
      } else {
        toast.error(data.error || "Registration failed");
        setMessage({
          type: "error",
          text: data.error || "Registration failed",
        });
      }
    } catch {
      toast.error("Network error. Please try again.");
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelection = (type: "individual" | "team") => {
    setRegistrationType(type);
    setParticipants([
      { id: "1", name: "", rollNo: "", gender: "", mobile: "", email: "" },
    ]);
    if (type === "individual") {
      setTeamName("");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_50%)]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300 backdrop-blur-sm mb-4">
              <span className="text-base">📝</span>
              Event Registration
            </div>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              {eventName}
            </span>
          </motion.h1>

          <motion.p
            className="text-slate-600"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Fill in your details to register for this event
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="p-6 sm:p-8 md:p-10">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl ${
                    message.type === "success"
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                      : "bg-red-500/20 border border-red-500/30 text-red-300"
                  }`}
                >
                  {message.text}
                </motion.div>
              )}

              {!registrationType ? (
                <div className="py-8">
                  <h2 className="text-xl font-bold text-slate-900 text-center mb-8">
                    Choose Registration Type
                  </h2>
                  <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row justify-center items-center">
                    <motion.button
                      onClick={() => handleTypeSelection("individual")}
                      className="flex flex-col items-center justify-center w-full sm:w-64 h-44 rounded-2xl border-2 border-slate-200 bg-white hover:border-orange-500/50 hover:bg-slate-50 transition-all group shadow-sm"
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mb-4 group-hover:from-orange-500/30 group-hover:to-amber-500/30 transition-colors">
                        <svg
                          className="w-8 h-8 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span className="text-lg font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
                        Individual
                      </span>
                      <span className="text-sm text-slate-500 mt-1">
                        Register as solo participant
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => handleTypeSelection("team")}
                      className="flex flex-col items-center justify-center w-full sm:w-64 h-44 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500/50 hover:bg-slate-50 transition-all group shadow-sm"
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-colors">
                        <svg
                          className="w-8 h-8 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-lg font-bold text-slate-900 group-hover:text-blue-500 transition-colors">
                        Team
                      </span>
                      <span className="text-sm text-slate-500 mt-1">
                        Register with your team
                      </span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => setRegistrationType(null)}
                    className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back to selection
                  </button>

                  {/* Team Name */}
                  {registrationType === "team" && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
                        Team Information
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Team Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your team name"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Participants */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h3 className="text-lg font-bold text-slate-900">
                        {registrationType === "individual"
                          ? "Participant Details"
                          : "Team Members"}
                      </h3>
                      {registrationType === "team" && (
                        <motion.button
                          type="button"
                          onClick={addParticipant}
                          className="px-4 py-2 rounded-lg border border-orange-500/50 text-orange-400 text-sm font-medium hover:bg-orange-500/10 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          + Add Member
                        </motion.button>
                      )}
                    </div>

                    {participants.map((participant, index) => (
                      <motion.div
                        key={participant.id}
                        className="p-5 rounded-xl bg-slate-50 border border-slate-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-medium text-orange-600">
                            {registrationType === "individual"
                              ? "Your Information"
                              : index === 0
                              ? "Team Leader"
                              : `Member ${index + 1}`}
                          </span>
                          {registrationType === "team" &&
                            participants.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeParticipant(participant.id)
                                }
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove
                              </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1.5">
                              Full Name
                            </label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={participant.name}
                              onChange={(e) =>
                                updateParticipant(
                                  participant.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              required
                              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1.5">
                              Roll Number
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 123456"
                              value={participant.rollNo}
                              onChange={(e) =>
                                updateParticipant(
                                  participant.id,
                                  "rollNo",
                                  e.target.value
                                )
                              }
                              required
                              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1.5">
                              Gender
                            </label>
                            <select
                              value={participant.gender}
                              onChange={(e) =>
                                updateParticipant(
                                  participant.id,
                                  "gender",
                                  e.target.value
                                )
                              }
                              required
                              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                            >
                              <option value="" className="bg-white text-slate-900">
                                Select Gender
                              </option>
                              <option value="Male" className="bg-white text-slate-900">
                                Male
                              </option>
                              <option value="Female" className="bg-white text-slate-900">
                                Female
                              </option>
                              <option value="Other" className="bg-white text-slate-900">
                                Other
                              </option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1.5">
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              placeholder="9876543210"
                              value={participant.mobile}
                              onChange={(e) =>
                                updateParticipant(
                                  participant.id,
                                  "mobile",
                                  e.target.value
                                )
                              }
                              required
                              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-600 mb-1.5">
                              Email
                            </label>
                            <input
                              type="email"
                              placeholder="john@example.com"
                              value={participant.email}
                              onChange={(e) =>
                                updateParticipant(
                                  participant.id,
                                  "email",
                                  e.target.value
                                )
                              }
                              required
                              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.99 }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Registration"
                    )}
                  </motion.button>
                </motion.form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
