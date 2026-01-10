"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import ConfirmDialog from "@/components/ConfirmDialog";

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

interface DeleteDialogState {
  isOpen: boolean;
  type: "event" | "registration" | "participant" | null;
  title: string;
  message: string;
  itemId: string;
  eventName: string;
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
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
    itemId: "",
    eventName: "",
  });

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

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      type: null,
      title: "",
      message: "",
      itemId: "",
      eventName: "",
    });
  };

  const openDeleteEventDialog = (eventName: string) => {
    setDeleteDialog({
      isOpen: true,
      type: "event",
      title: "Delete Event",
      message: `Are you sure you want to delete "${eventName}"? This will permanently remove the event and all its registrations. This action cannot be undone.`,
      itemId: eventName,
      eventName: eventName,
    });
  };

  const openDeleteRegistrationDialog = (
    registrationId: string,
    eventName: string,
    teamName?: string
  ) => {
    setDeleteDialog({
      isOpen: true,
      type: "registration",
      title: "Delete Registration",
      message: teamName
        ? `Are you sure you want to delete team "${teamName}"? All team members will be removed.`
        : "Are you sure you want to delete this individual registration?",
      itemId: registrationId,
      eventName: eventName,
    });
  };

  const openDeleteParticipantDialog = (
    participantId: string,
    eventName: string,
    participantName: string
  ) => {
    setDeleteDialog({
      isOpen: true,
      type: "participant",
      title: "Remove Team Member",
      message: `Are you sure you want to remove "${participantName}" from the team?`,
      itemId: participantId,
      eventName: eventName,
    });
  };

  const handleConfirmDelete = async () => {
    const { type, itemId, eventName } = deleteDialog;
    closeDeleteDialog();

    if (type === "event") {
      await executeDeleteEvent(itemId);
    } else if (type === "registration") {
      await executeDeleteRegistration(itemId, eventName);
    } else if (type === "participant") {
      await executeDeleteParticipant(itemId, eventName);
    }
  };

  const executeDeleteEvent = async (eventName: string) => {
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
        toast.success(data.message || "Event deleted successfully! 🗑️");
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

  const executeDeleteRegistration = async (
    registrationId: string,
    eventName: string
  ) => {
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
        toast.success(data.message || "Registration deleted successfully! 🗑️");
        fetchEventDetails(eventName);
        fetchData();
      } else {
        toast.error(data.error || "Failed to delete registration");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const executeDeleteParticipant = async (
    participantId: string,
    eventName: string
  ) => {
    try {
      const response = await fetch(`/api/admin/participants/${participantId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Participant removed successfully! 🗑️");
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-slate-400">
                Manage events and view analytics
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition font-medium text-sm w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5 sm:p-6">
            <h3 className="text-slate-400 text-xs sm:text-sm font-medium">
              Total Events
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
              {events.length}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5 sm:p-6">
            <h3 className="text-slate-400 text-xs sm:text-sm font-medium">
              Registrations
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-orange-400 mt-2">
              {stats.reduce((sum, s) => sum + s.totalRegistrations, 0)}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5 sm:p-6 col-span-2 sm:col-span-1">
            <h3 className="text-slate-400 text-xs sm:text-sm font-medium">
              Participants
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-400 mt-2">
              {stats.reduce((sum, s) => sum + s.totalParticipants, 0)}
            </p>
          </div>
        </div>

        {/* Events Section */}
        <div className="rounded-xl border border-white/10 bg-slate-900/50 mb-8">
          <div className="px-5 sm:px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">Events</h2>
            <button
              onClick={() => setShowEventForm(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:opacity-90 transition font-medium text-sm w-full sm:w-auto"
            >
              + Add New Event
            </button>
          </div>

          <div className="p-5 sm:p-6">
            {events.length === 0 ? (
              <p className="text-slate-400 text-center py-8 text-sm sm:text-base">
                No events yet. Create your first event!
              </p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const eventStat = stats.find(
                    (s) => s.eventName === event.name
                  );
                  return (
                    <div
                      key={event._id}
                      className="rounded-xl border border-white/10 bg-slate-800/30 p-4 sm:p-5 hover:border-white/20 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <h3 className="text-base sm:text-lg font-semibold text-white">
                              {event.name}
                            </h3>
                            <span
                              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                event.isActive
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                              }`}
                            >
                              {event.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mt-2">
                            {event.description}
                          </p>
                          <p className="text-xs text-orange-400 mt-2 flex items-center gap-1.5">
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {event.date}
                          </p>
                        </div>
                        <div className="flex items-center sm:items-start justify-between sm:justify-end gap-4">
                          {eventStat && (
                            <div className="text-left sm:text-right">
                              <p className="text-xl sm:text-2xl font-bold text-orange-400">
                                {eventStat.totalRegistrations}
                              </p>
                              <p className="text-xs text-slate-500">
                                registrations
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                {eventStat.individualCount} solo |{" "}
                                {eventStat.teamCount} teams
                              </p>
                            </div>
                          )}
                          <button
                            onClick={() => openDeleteEventDialog(event.name)}
                            className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition text-xs sm:text-sm font-medium whitespace-nowrap"
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
          <div className="rounded-xl border border-white/10 bg-slate-900/50">
            <div className="px-5 sm:px-6 py-4 border-b border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Detailed Registration Data
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Click on an event to view participant details
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 overflow-hidden"
                  >
                    {/* Event Header - Clickable */}
                    <div
                      onClick={() => toggleEventExpanded(stat.eventName)}
                      className="bg-slate-800/50 px-4 sm:px-6 py-4 cursor-pointer hover:bg-slate-800/70 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg text-orange-400">
                            {expandedEvents.has(stat.eventName) ? "▼" : "▶"}
                          </span>
                          <h3 className="text-sm sm:text-lg font-semibold text-white">
                            {stat.eventName}
                          </h3>
                        </div>
                        <div className="grid grid-cols-4 gap-3 sm:flex sm:gap-6 text-xs sm:text-sm ml-7 sm:ml-0">
                          <div className="text-center">
                            <p className="text-slate-500 text-xs">Regs</p>
                            <p className="font-bold text-blue-400">
                              {stat.totalRegistrations}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-500 text-xs">Total</p>
                            <p className="font-bold text-orange-400">
                              {stat.totalParticipants}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-500 text-xs">Solo</p>
                            <p className="font-bold text-emerald-400">
                              {stat.individualCount}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-500 text-xs">Teams</p>
                            <p className="font-bold text-purple-400">
                              {stat.teamCount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedEvents.has(stat.eventName) && (
                      <div className="p-4 sm:p-6 bg-slate-900/30">
                        {!eventDetails[stat.eventName] ? (
                          <div className="text-center py-8 text-slate-400 text-sm">
                            Loading details...
                          </div>
                        ) : eventDetails[stat.eventName].registrations
                            .length === 0 ? (
                          <div className="text-center py-8 text-slate-400">
                            No registrations yet
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {eventDetails[stat.eventName].registrations.map(
                              (reg, regIndex) => (
                                <div
                                  key={reg._id}
                                  className="rounded-xl border border-white/10 bg-slate-800/50 p-4"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold text-white text-sm sm:text-base">
                                          {reg.isTeam ? (
                                            <>🏆 Team: {reg.teamName}</>
                                          ) : (
                                            <>👤 Individual</>
                                          )}
                                        </span>
                                        <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-full">
                                          {reg.participants.length} participant
                                          {reg.participants.length !== 1
                                            ? "s"
                                            : ""}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-500 mt-1">
                                        {new Date(
                                          reg.createdAt
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        openDeleteRegistrationDialog(
                                          reg._id,
                                          stat.eventName,
                                          reg.teamName
                                        )
                                      }
                                      className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition text-xs font-medium self-start"
                                    >
                                      🗑️ Delete
                                    </button>
                                  </div>

                                  {/* Participants Table - Mobile Cards / Desktop Table */}
                                  <div className="hidden sm:block overflow-x-auto">
                                    <table className="w-full text-sm min-w-[600px]">
                                      <thead className="bg-slate-700/50">
                                        <tr>
                                          <th className="px-3 py-2.5 text-left font-medium text-slate-300 text-xs">
                                            Name
                                          </th>
                                          <th className="px-3 py-2.5 text-left font-medium text-slate-300 text-xs">
                                            Email
                                          </th>
                                          <th className="px-3 py-2.5 text-left font-medium text-slate-300 text-xs">
                                            Roll No
                                          </th>
                                          <th className="px-3 py-2.5 text-left font-medium text-slate-300 text-xs">
                                            Contact
                                          </th>
                                          <th className="px-3 py-2.5 text-left font-medium text-slate-300 text-xs">
                                            Gender
                                          </th>
                                          <th className="px-3 py-2.5 text-left font-medium text-slate-300 text-xs">
                                            Role
                                          </th>
                                          <th className="px-3 py-2.5 text-left font-medium text-slate-300 text-xs">
                                            Action
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-slate-800/30">
                                        {reg.participants.map(
                                          (participant, pIndex) => (
                                            <tr
                                              key={participant._id}
                                              className="border-t border-white/5 hover:bg-white/5"
                                            >
                                              <td className="px-3 py-2.5 text-white">
                                                {participant.name}
                                              </td>
                                              <td className="px-3 py-2.5 text-slate-400">
                                                {participant.email}
                                              </td>
                                              <td className="px-3 py-2.5 text-slate-400">
                                                {participant.rollNumber}
                                              </td>
                                              <td className="px-3 py-2.5 text-slate-400">
                                                {participant.contactNumber}
                                              </td>
                                              <td className="px-3 py-2.5 text-slate-400">
                                                {participant.gender}
                                              </td>
                                              <td className="px-3 py-2.5">
                                                {participant.isLeader ? (
                                                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2 py-1 rounded-full font-medium">
                                                    Leader
                                                  </span>
                                                ) : (
                                                  <span className="text-slate-500 text-xs">
                                                    Member
                                                  </span>
                                                )}
                                              </td>
                                              <td className="px-3 py-2.5">
                                                {!participant.isLeader &&
                                                reg.isTeam &&
                                                reg.participants.length > 2 ? (
                                                  <button
                                                    onClick={() =>
                                                      openDeleteParticipantDialog(
                                                        participant._id,
                                                        stat.eventName,
                                                        participant.name
                                                      )
                                                    }
                                                    className="text-red-400 hover:text-red-300 text-xs font-medium"
                                                  >
                                                    Remove
                                                  </button>
                                                ) : (
                                                  <span className="text-slate-600 text-xs">
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
                                        className="bg-slate-800/70 border border-white/5 rounded-lg p-3 text-xs"
                                      >
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <p className="font-semibold text-white">
                                              {participant.name}
                                            </p>
                                            <p className="text-slate-500">
                                              {participant.rollNumber}
                                            </p>
                                          </div>
                                          {participant.isLeader ? (
                                            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-xs font-medium">
                                              Leader
                                            </span>
                                          ) : (
                                            !participant.isLeader &&
                                            reg.isTeam &&
                                            reg.participants.length > 2 && (
                                              <button
                                                onClick={() =>
                                                  openDeleteParticipantDialog(
                                                    participant._id,
                                                    stat.eventName,
                                                    participant.name
                                                  )
                                                }
                                                className="text-red-400 text-xs font-medium"
                                              >
                                                Remove
                                              </button>
                                            )
                                          )}
                                        </div>
                                        <p className="text-slate-400 truncate">
                                          {participant.email}
                                        </p>
                                        <p className="text-slate-400">
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.title}
        message={deleteDialog.message}
        confirmText={deleteDialog.type === "participant" ? "Remove" : "Delete"}
        variant={deleteDialog.type === "event" ? "danger" : "warning"}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteDialog}
      />
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add New Event</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl p-1 transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
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
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="Enter event name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="event-url-slug"
              required
            />
            <p className="text-xs text-slate-500 mt-2">
              URL: /register/{formData.slug || "event-slug"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
              rows={3}
              placeholder="Describe your event..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Event Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
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
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
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
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/10 text-slate-300 rounded-xl hover:bg-white/5 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:opacity-90 transition font-medium disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
