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

interface Startup {
  _id: string;
  name: string;
  slug: string;
  email: string;
  mobileNumber: string;
  incubatedDate: string;
  incubationDetails?: string;
  status: "incubated" | "non-incubated";
  website?: string;
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
  type: "event" | "registration" | "participant" | "startup" | null;
  title: string;
  message: string;
  itemId: string;
  eventName: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [stats, setStats] = useState<EventStats[]>([]);
  const [eventDetails, setEventDetails] = useState<{
    [key: string]: EventDetails;
  }>({});
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showStartupForm, setShowStartupForm] = useState(false);
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);
  const [activeTab, setActiveTab] = useState<"events" | "startups">("events");
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
      const [eventsRes, statsRes, startupsRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/admin/stats"),
        fetch("/api/startups?active=false"),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.data || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data || []);
      }

      if (startupsRes.ok) {
        const startupsData = await startupsRes.json();
        setStartups(startupsData.data || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetails = async (eventName: string) => {
    try {
      const response = await fetch(
        `/api/events/${encodeURIComponent(eventName)}`,
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
    teamName?: string,
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
    participantName: string,
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

  const openDeleteStartupDialog = (startupId: string, startupName: string) => {
    setDeleteDialog({
      isOpen: true,
      type: "startup",
      title: "Delete Startup",
      message: `Are you sure you want to delete "${startupName}"? This action cannot be undone.`,
      itemId: startupId,
      eventName: "",
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
    } else if (type === "startup") {
      await executeDeleteStartup(itemId);
    }
  };

  const executeDeleteEvent = async (eventName: string) => {
    try {
      const response = await fetch(
        `/api/events/${encodeURIComponent(eventName)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
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
    eventName: string,
  ) => {
    try {
      const response = await fetch(
        `/api/admin/registrations/${registrationId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
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
    eventName: string,
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

  const executeDeleteStartup = async (startupId: string) => {
    try {
      const response = await fetch(`/api/admin/startups/${startupId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Startup deleted successfully! 🗑️");
        fetchData();
      } else {
        toast.error(data.error || "Failed to delete startup");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const toggleStartupActive = async (startup: Startup) => {
    try {
      const response = await fetch(`/api/admin/startups/${startup._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !startup.isActive }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(
          `Startup ${
            startup.isActive ? "deactivated" : "activated"
          } successfully!`,
        );
        fetchData();
      } else {
        toast.error(data.error || "Failed to update startup");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-slate-500">
                Manage events and view analytics
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition font-medium text-sm w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h3 className="text-slate-500 text-xs sm:text-sm font-medium">
              Total Events
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              {events.length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h3 className="text-slate-500 text-xs sm:text-sm font-medium">
              Registrations
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-orange-500 mt-2">
              {stats.reduce((sum, s) => sum + s.totalRegistrations, 0)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h3 className="text-slate-500 text-xs sm:text-sm font-medium">
              Participants
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
              {stats.reduce((sum, s) => sum + s.totalParticipants, 0)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h3 className="text-slate-500 text-xs sm:text-sm font-medium">
              Startups
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2">
              {startups.length}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition ${
              activeTab === "events"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Events & Registrations
          </button>
          <button
            onClick={() => setActiveTab("startups")}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition ${
              activeTab === "startups"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Incubated Startups
          </button>
        </div>

        {activeTab === "events" ? (
          <>
            {/* Events Section */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm mb-8">
              <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Events
                </h2>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:opacity-90 transition font-medium text-sm w-full sm:w-auto"
                >
                  + Add New Event
                </button>
              </div>

              <div className="p-5 sm:p-6">
                {events.length === 0 ? (
                  <p className="text-slate-500 text-center py-8 text-sm sm:text-base">
                    No events yet. Create your first event!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => {
                      const eventStat = stats.find(
                        (s) => s.eventName === event.name,
                      );
                      return (
                        <div
                          key={event._id}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 hover:border-slate-300 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                                  {event.name}
                                </h3>
                                <span
                                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                    event.isActive
                                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                      : "bg-slate-200 text-slate-600 border border-slate-300"
                                  }`}
                                >
                                  {event.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mt-2">
                                {event.description}
                              </p>
                              <p className="text-xs text-orange-600 mt-2 flex items-center gap-1.5">
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
                                  <p className="text-xl sm:text-2xl font-bold text-orange-500">
                                    {eventStat.totalRegistrations}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    registrations
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {eventStat.individualCount} solo |{" "}
                                    {eventStat.teamCount} teams
                                  </p>
                                </div>
                              )}
                              <button
                                onClick={() =>
                                  openDeleteEventDialog(event.name)
                                }
                                className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition text-xs sm:text-sm font-medium whitespace-nowrap"
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
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="px-5 sm:px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Detailed Registration Data
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Click on an event to view participant details
                  </p>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="space-y-4">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 overflow-hidden"
                      >
                        {/* Event Header - Clickable */}
                        <div
                          onClick={() => toggleEventExpanded(stat.eventName)}
                          className="bg-slate-50 px-4 sm:px-6 py-4 cursor-pointer hover:bg-slate-100 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-lg text-orange-500">
                                {expandedEvents.has(stat.eventName) ? "▼" : "▶"}
                              </span>
                              <h3 className="text-sm sm:text-lg font-semibold text-slate-900">
                                {stat.eventName}
                              </h3>
                            </div>
                            <div className="grid grid-cols-4 gap-3 sm:flex sm:gap-6 text-xs sm:text-sm ml-7 sm:ml-0">
                              <div className="text-center">
                                <p className="text-slate-500 text-xs">Regs</p>
                                <p className="font-bold text-blue-600">
                                  {stat.totalRegistrations}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-slate-500 text-xs">Total</p>
                                <p className="font-bold text-orange-500">
                                  {stat.totalParticipants}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-slate-500 text-xs">Solo</p>
                                <p className="font-bold text-emerald-600">
                                  {stat.individualCount}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-slate-500 text-xs">Teams</p>
                                <p className="font-bold text-purple-600">
                                  {stat.teamCount}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedEvents.has(stat.eventName) && (
                          <div className="p-4 sm:p-6 bg-slate-50">
                            {!eventDetails[stat.eventName] ? (
                              <div className="text-center py-8 text-slate-500 text-sm">
                                Loading details...
                              </div>
                            ) : eventDetails[stat.eventName].registrations
                                .length === 0 ? (
                              <div className="text-center py-8 text-slate-500">
                                No registrations yet
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {eventDetails[stat.eventName].registrations.map(
                                  (reg, regIndex) => (
                                    <div
                                      key={reg._id}
                                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                                        <div>
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-semibold text-slate-900 text-sm sm:text-base">
                                              {reg.isTeam ? (
                                                <>🏆 Team: {reg.teamName}</>
                                              ) : (
                                                <>👤 Individual</>
                                              )}
                                            </span>
                                            <span className="text-xs bg-blue-100 text-blue-600 border border-blue-200 px-2 py-1 rounded-full">
                                              {reg.participants.length}{" "}
                                              participant
                                              {reg.participants.length !== 1
                                                ? "s"
                                                : ""}
                                            </span>
                                          </div>
                                          <p className="text-xs text-slate-500 mt-1">
                                            {new Date(
                                              reg.createdAt,
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() =>
                                            openDeleteRegistrationDialog(
                                              reg._id,
                                              stat.eventName,
                                              reg.teamName,
                                            )
                                          }
                                          className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition text-xs font-medium self-start"
                                        >
                                          🗑️ Delete
                                        </button>
                                      </div>

                                      {/* Participants Table - Mobile Cards / Desktop Table */}
                                      <div className="hidden sm:block overflow-x-auto">
                                        <table className="w-full text-sm min-w-[600px]">
                                          <thead className="bg-slate-50">
                                            <tr>
                                              <th className="px-3 py-2.5 text-left font-medium text-slate-500 text-xs">
                                                Name
                                              </th>
                                              <th className="px-3 py-2.5 text-left font-medium text-slate-500 text-xs">
                                                Email
                                              </th>
                                              <th className="px-3 py-2.5 text-left font-medium text-slate-500 text-xs">
                                                Roll No
                                              </th>
                                              <th className="px-3 py-2.5 text-left font-medium text-slate-500 text-xs">
                                                Contact
                                              </th>
                                              <th className="px-3 py-2.5 text-left font-medium text-slate-500 text-xs">
                                                Gender
                                              </th>
                                              <th className="px-3 py-2.5 text-left font-medium text-slate-500 text-xs">
                                                Role
                                              </th>
                                              <th className="px-3 py-2.5 text-left font-medium text-slate-500 text-xs">
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="bg-white">
                                            {reg.participants.map(
                                              (participant, pIndex) => (
                                                <tr
                                                  key={participant._id}
                                                  className="border-t border-slate-200 hover:bg-slate-50"
                                                >
                                                  <td className="px-3 py-2.5 text-slate-900">
                                                    {participant.name}
                                                  </td>
                                                  <td className="px-3 py-2.5 text-slate-600">
                                                    {participant.email}
                                                  </td>
                                                  <td className="px-3 py-2.5 text-slate-600">
                                                    {participant.rollNumber}
                                                  </td>
                                                  <td className="px-3 py-2.5 text-slate-600">
                                                    {participant.contactNumber}
                                                  </td>
                                                  <td className="px-3 py-2.5 text-slate-600">
                                                    {participant.gender}
                                                  </td>
                                                  <td className="px-3 py-2.5">
                                                    {participant.isLeader ? (
                                                      <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs px-2 py-1 rounded-full font-medium">
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
                                                    reg.participants.length >
                                                      2 ? (
                                                      <button
                                                        onClick={() =>
                                                          openDeleteParticipantDialog(
                                                            participant._id,
                                                            stat.eventName,
                                                            participant.name,
                                                          )
                                                        }
                                                        className="text-red-500 hover:text-red-700 text-xs font-medium"
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
                                              ),
                                            )}
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* Mobile Cards View */}
                                      <div className="sm:hidden space-y-2">
                                        {reg.participants.map((participant) => (
                                          <div
                                            key={participant._id}
                                            className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs"
                                          >
                                            <div className="flex justify-between items-start mb-2">
                                              <div>
                                                <p className="font-semibold text-slate-900">
                                                  {participant.name}
                                                </p>
                                                <p className="text-slate-500">
                                                  {participant.rollNumber}
                                                </p>
                                              </div>
                                              {participant.isLeader ? (
                                                <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-medium">
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
                                                        participant.name,
                                                      )
                                                    }
                                                    className="text-red-500 text-xs font-medium"
                                                  >
                                                    Remove
                                                  </button>
                                                )
                                              )}
                                            </div>
                                            <p className="text-slate-600 truncate">
                                              {participant.email}
                                            </p>
                                            <p className="text-slate-600">
                                              {participant.contactNumber} •{" "}
                                              {participant.gender}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ),
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
          </>
        ) : (
          /* Startups Section */
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Incubated Startups
              </h2>
              <button
                onClick={() => {
                  setEditingStartup(null);
                  setShowStartupForm(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:opacity-90 transition font-medium text-sm w-full sm:w-auto"
              >
                + Add New Startup
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {startups.length === 0 ? (
                <p className="text-slate-500 text-center py-8 text-sm sm:text-base">
                  No startups yet. Add your first startup!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {startups.map((startup) => (
                    <div
                      key={startup._id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-slate-300 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🚀</span>
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {startup.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              📧 {startup.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            startup.isActive
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-slate-200 text-slate-600 border border-slate-300"
                          }`}
                        >
                          {startup.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            startup.status === "incubated"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {startup.status === "incubated"
                            ? "Incubated"
                            : "Non-Incubated"}
                        </span>
                        <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                          📱 {startup.mobileNumber}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          📅{" "}
                          {startup.incubatedDate
                            ? new Date(
                                startup.incubatedDate,
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {startup.incubationDetails || (
                          <span className="text-slate-400 italic">
                            Add Incubation Details
                          </span>
                        )}
                      </p>

                      {startup.website && (
                        <a
                          href={startup.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-orange-600 hover:text-orange-700 mb-3 block truncate"
                        >
                          🌐 {startup.website}
                        </a>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setEditingStartup(startup);
                            setShowStartupForm(true);
                          }}
                          className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => toggleStartupActive(startup)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                            startup.isActive
                              ? "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {startup.isActive ? "🔒 Deactivate" : "✅ Activate"}
                        </button>
                        <button
                          onClick={() =>
                            openDeleteStartupDialog(startup._id, startup.name)
                          }
                          className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Startup Form Modal */}
      {showStartupForm && (
        <StartupFormModal
          startup={editingStartup}
          onClose={() => {
            setShowStartupForm(false);
            setEditingStartup(null);
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
        variant={
          deleteDialog.type === "event" || deleteDialog.type === "startup"
            ? "danger"
            : "warning"
        }
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Add New Event</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl p-1 transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="Enter event name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="event-url-slug"
              required
            />
            <p className="text-xs text-slate-500 mt-2">
              URL: /register/{formData.slug || "event-slug"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
              rows={3}
              placeholder="Describe your event..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Event Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
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
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition font-medium"
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

function StartupFormModal({
  startup,
  onClose,
}: {
  startup: Startup | null;
  onClose: () => void;
}) {
  const isEditing = !!startup;
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    email: string;
    mobileNumber: string;
    incubatedDate: string;
    incubationDetails: string;
    status: "incubated" | "non-incubated";
    website: string;
  }>({
    name: startup?.name || "",
    slug: startup?.slug || "",
    email: startup?.email || "",
    mobileNumber: startup?.mobileNumber || "",
    incubatedDate: startup?.incubatedDate
      ? new Date(startup.incubatedDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    incubationDetails: startup?.incubationDetails || "",
    status: startup?.status || "non-incubated",
    website: startup?.website || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/admin/startups/${startup._id}`
        : "/api/startups";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          isEditing
            ? "Startup updated successfully!"
            : "Startup created successfully!",
        );
        onClose();
      } else {
        toast.error(data.error || "Failed to save startup");
        setError(data.error || "Failed to save startup");
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? "Edit Startup" : "Add New Startup"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl p-1 transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Startup Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: isEditing
                      ? formData.slug
                      : generateSlug(e.target.value),
                  });
                }}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="Enter startup name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="startup-slug"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="contact@startup.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="10 digit number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Incubated Date *
              </label>
              <input
                type="date"
                value={formData.incubatedDate}
                onChange={(e) =>
                  setFormData({ ...formData, incubatedDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "incubated" | "non-incubated",
                  })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                required
              >
                <option value="non-incubated">Non-Incubated</option>
                <option value="incubated">Incubated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Incubation Details (Optional)
            </label>
            <textarea
              value={formData.incubationDetails}
              onChange={(e) =>
                setFormData({ ...formData, incubationDetails: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
              rows={3}
              placeholder="Add incubation details (optional)..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Website (Optional)
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="https://example.com"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:opacity-90 transition font-medium disabled:opacity-50"
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Startup"
                  : "Create Startup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
