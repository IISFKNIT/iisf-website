"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

interface Event {
  _id: string;
  name: string;
  slug: string;
  description: string;
  date: string;
  isActive: boolean;
}

interface Participant {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  contactNumber: string;
  gender: string;
  isLeader: boolean;
}

interface DetailedRegistration {
  _id: string;
  eventName: string;
  isTeam: boolean;
  teamName?: string;
  totalParticipants: number;
  participants: Participant[];
  createdAt: Date;
}

interface EventDetails {
  stats: {
    totalRegistrations: number;
    individualCount: number;
    teamCount: number;
    totalParticipants: number;
  };
  registrations: DetailedRegistration[];
}

interface EventStats {
  eventName: string;
  totalRegistrations: number;
  individualCount: number;
  teamCount: number;
  totalParticipants: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<EventStats[]>([]);
  const [eventDetails, setEventDetails] = useState<{
    [key: string]: EventDetails;
  }>({});
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, statsRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/admin/stats"),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.data || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetails = async (eventName: string) => {
    try {
      const response = await fetch(
        `/api/events/${encodeURIComponent(eventName)}`
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setEventDetails((prev) => ({ ...prev, [eventName]: result.data }));
        }
      }
    } catch {}
  };

  const toggleEventExpanded = (eventName: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventName)) {
      newExpanded.delete(eventName);
    } else {
      newExpanded.add(eventName);
      if (!eventDetails[eventName]) {
        fetchEventDetails(eventName);
      }
    }
    setExpandedEvents(newExpanded);
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    toast.success("Logged out successfully");
    router.push("/admin-login");
  };

  const handleDeleteEvent = async (eventName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${eventName}" and all its registrations?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/events/${encodeURIComponent(eventName)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Event deleted successfully");
        fetchData();
        setExpandedEvents((prev) => {
          const newSet = new Set(prev);
          newSet.delete(eventName);
          return newSet;
        });
        setEventDetails((prev) => {
          const newDetails = { ...prev };
          delete newDetails[eventName];
          return newDetails;
        });
      } else {
        toast.error(data.error || "Failed to delete event");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const handleDeleteRegistration = async (
    registrationId: string,
    eventName: string
  ) => {
    if (!confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/registrations/${registrationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Registration deleted successfully");
        fetchEventDetails(eventName);
        fetchData();
      } else {
        toast.error(data.error || "Failed to delete registration");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const handleDeleteParticipant = async (
    participantId: string,
    eventName: string
  ) => {
    if (
      !confirm(
        "Are you sure you want to remove this participant from the team?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/participants/${participantId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Participant removed successfully");
        fetchEventDetails(eventName);
        fetchData();
      } else {
        toast.error(data.error || "Failed to remove participant");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600">
                Manage events and view analytics
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
              Total Events
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
              {events.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
              Registrations
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
              {stats.reduce((sum, s) => sum + s.totalRegistrations, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 col-span-2 sm:col-span-1">
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
              Participants
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
              {stats.reduce((sum, s) => sum + s.totalParticipants, 0)}
            </p>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow mb-6 sm:mb-8">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Events
            </h2>
            <button
              onClick={() => setShowEventForm(true)}
              style={{ backgroundColor: "#2563eb" }}
              className="px-3 sm:px-4 py-2 text-white rounded-lg hover:opacity-90 transition font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              + Add New Event
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {events.length === 0 ? (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
                No events yet. Create your first event!
              </p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {events.map((event) => {
                  const eventStat = stats.find(
                    (s) => s.eventName === event.name
                  );
                  return (
                    <div
                      key={event._id}
                      className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              {event.name}
                            </h3>
                            <span
                              className={`px-2 py-0.5 sm:py-1 text-xs font-medium rounded ${
                                event.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {event.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 mt-1">
                            {event.description}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-2">
                            📅 {event.date}
                          </p>
                        </div>
                        <div className="flex items-center sm:items-start justify-between sm:justify-end gap-3 sm:gap-4">
                          {eventStat && (
                            <div className="text-left sm:text-right">
                              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                                {eventStat.totalRegistrations}
                              </p>
                              <p className="text-xs text-gray-500">
                                registrations
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {eventStat.individualCount} solo |{" "}
                                {eventStat.teamCount} teams
                              </p>
                            </div>
                          )}
                          <button
                            onClick={() => handleDeleteEvent(event.name)}
                            className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm font-medium whitespace-nowrap"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Event Registration Details */}
        {stats.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Detailed Registration Data
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Click on an event to view participant details
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    {/* Event Header - Clickable */}
                    <div
                      onClick={() => toggleEventExpanded(stat.eventName)}
                      className="bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 cursor-pointer hover:bg-gray-100 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-lg sm:text-2xl">
                            {expandedEvents.has(stat.eventName) ? "▼" : "▶"}
                          </span>
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                            {stat.eventName}
                          </h3>
                        </div>
                        <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-6 text-xs sm:text-sm ml-6 sm:ml-0">
                          <div className="text-center">
                            <p className="text-gray-600 text-xs">Regs</p>
                            <p className="font-bold text-blue-600">
                              {stat.totalRegistrations}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600 text-xs">Total</p>
                            <p className="font-bold text-orange-600">
                              {stat.totalParticipants}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600 text-xs">Solo</p>
                            <p className="font-bold text-green-600">
                              {stat.individualCount}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600 text-xs">Teams</p>
                            <p className="font-bold text-purple-600">
                              {stat.teamCount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedEvents.has(stat.eventName) && (
                      <div className="p-3 sm:p-6 bg-white">
                        {!eventDetails[stat.eventName] ? (
                          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm">
                            Loading details...
                          </div>
                        ) : eventDetails[stat.eventName].registrations
                            .length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            No registrations yet
                          </div>
                        ) : (
                          <div className="space-y-3 sm:space-y-4">
                            {eventDetails[stat.eventName].registrations.map(
                              (reg, regIndex) => (
                                <div
                                  key={reg._id}
                                  className="border rounded-lg p-3 sm:p-4 bg-gray-50"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                                          {reg.isTeam ? (
                                            <>🏆 Team: {reg.teamName}</>
                                          ) : (
                                            <>👤 Individual</>
                                          )}
                                        </span>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 sm:py-1 rounded">
                                          {reg.participants.length} participant
                                          {reg.participants.length !== 1
                                            ? "s"
                                            : ""}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {new Date(
                                          reg.createdAt
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleDeleteRegistration(
                                          reg._id,
                                          stat.eventName
                                        )
                                      }
                                      className="px-2 sm:px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition text-xs font-medium self-start"
                                    >
                                      🗑️ Delete
                                    </button>
                                  </div>

                                  {/* Participants Table - Mobile Cards / Desktop Table */}
                                  <div className="hidden sm:block overflow-x-auto">
                                    <table className="w-full text-sm min-w-[600px]">
                                      <thead className="bg-gray-200">
                                        <tr>
                                          <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 text-xs sm:text-sm">
                                            Name
                                          </th>
                                          <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 text-xs sm:text-sm">
                                            Email
                                          </th>
                                          <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 text-xs sm:text-sm">
                                            Roll No
                                          </th>
                                          <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 text-xs sm:text-sm">
                                            Contact
                                          </th>
                                          <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 text-xs sm:text-sm">
                                            Gender
                                          </th>
                                          <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 text-xs sm:text-sm">
                                            Role
                                          </th>
                                          <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 text-xs sm:text-sm">
                                            Action
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white">
                                        {reg.participants.map(
                                          (participant, pIndex) => (
                                            <tr
                                              key={participant._id}
                                              className="border-t hover:bg-gray-50"
                                            >
                                              <td className="px-3 py-2 text-gray-900">
                                                {participant.name}
                                              </td>
                                              <td className="px-3 py-2 text-gray-700">
                                                {participant.email}
                                              </td>
                                              <td className="px-3 py-2 text-gray-700">
                                                {participant.rollNumber}
                                              </td>
                                              <td className="px-3 py-2 text-gray-700">
                                                {participant.contactNumber}
                                              </td>
                                              <td className="px-3 py-2 text-gray-700">
                                                {participant.gender}
                                              </td>
                                              <td className="px-3 py-2">
                                                {participant.isLeader ? (
                                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-medium">
                                                    Leader
                                                  </span>
                                                ) : (
                                                  <span className="text-gray-500 text-xs">
                                                    Member
                                                  </span>
                                                )}
                                              </td>
                                              <td className="px-2 sm:px-3 py-2">
                                                {!participant.isLeader &&
                                                reg.isTeam &&
                                                reg.participants.length > 2 ? (
                                                  <button
                                                    onClick={() =>
                                                      handleDeleteParticipant(
                                                        participant._id,
                                                        stat.eventName
                                                      )
                                                    }
                                                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                                                  >
                                                    Remove
                                                  </button>
                                                ) : (
                                                  <span className="text-gray-400 text-xs">
                                                    -
                                                  </span>
                                                )}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Mobile Cards View */}
                                  <div className="sm:hidden space-y-2">
                                    {reg.participants.map((participant) => (
                                      <div
                                        key={participant._id}
                                        className="bg-white border rounded-lg p-3 text-xs"
                                      >
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <p className="font-semibold text-gray-900">
                                              {participant.name}
                                            </p>
                                            <p className="text-gray-500">
                                              {participant.rollNumber}
                                            </p>
                                          </div>
                                          {participant.isLeader ? (
                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
                                              Leader
                                            </span>
                                          ) : (
                                            !participant.isLeader &&
                                            reg.isTeam &&
                                            reg.participants.length > 2 && (
                                              <button
                                                onClick={() =>
                                                  handleDeleteParticipant(
                                                    participant._id,
                                                    stat.eventName
                                                  )
                                                }
                                                className="text-red-600 text-xs font-medium"
                                              >
                                                Remove
                                              </button>
                                            )
                                          )}
                                        </div>
                                        <p className="text-gray-600 truncate">
                                          {participant.email}
                                        </p>
                                        <p className="text-gray-600">
                                          {participant.contactNumber} •{" "}
                                          {participant.gender}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventFormModal
          onClose={() => {
            setShowEventForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

function EventFormModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    date: "",
    maxTeamSize: 4,
    minTeamSize: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Event created successfully!");
        onClose();
      } else {
        toast.error(data.error || "Failed to create event");
        setError(data.error || "Failed to create event");
      }
    } catch {
      toast.error("Network error. Please try again.");
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Add New Event
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl p-1"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              URL: /register/{formData.slug}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Min Team Size
              </label>
              <input
                type="number"
                value={formData.minTeamSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minTeamSize: parseInt(e.target.value),
                  })
                }
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Max Team Size
              </label>
              <input
                type="number"
                value={formData.maxTeamSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxTeamSize: parseInt(e.target.value),
                  })
                }
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#2563eb" }}
              className="flex-1 px-3 sm:px-4 py-2 text-white rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
