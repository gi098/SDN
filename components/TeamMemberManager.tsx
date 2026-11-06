"use client";

import { useState } from "react";
import { UsersRound, Plus, Crown, Shield, User, Mail, Trash2, LogOut, Loader2, Sparkles, AlertCircle, Info, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/lib/languageContext";

interface TeamMemberManagerProps {
  team: any;
  currentUserId: string;
  onRefresh: () => void;
}

export default function TeamMemberManager({ team, currentUserId, onRefresh }: TeamMemberManagerProps) {
  const { t } = useLanguage();
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("MEMBER");
  const [isInviting, setIsInviting] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const isOwner = team.ownerId === currentUserId;
  const currentMembership = team.members.find((m: any) => m.userId === currentUserId);
  const currentUserRole = isOwner ? "OWNER" : currentMembership?.role || "MEMBER";
  const canManageMembers = isOwner || currentUserRole === "ADMIN";

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || isInviting) return;

    setIsInviting(true);
    try {
      const res = await fetch(`/api/teams/${team.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim(), role: newRole }),
      });

      if (res.ok) {
        toast.success("Member added successfully!");
        setNewEmail("");
        setNewRole("MEMBER");
        onRefresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add member");
      }
    } catch {
      toast.error("Network error adding member");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (targetUserId: string, updatedRole: string) => {
    setUpdatingUserId(targetUserId);
    try {
      const res = await fetch(`/api/teams/${team.id}/members/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: updatedRole }),
      });

      if (res.ok) {
        toast.success(`Role updated to ${updatedRole}`);
        onRefresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update role");
      }
    } catch {
      toast.error("Error updating role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRemoveMember = async (targetUserId: string, targetName: string) => {
    const isSelf = targetUserId === currentUserId;
    const confirmMsg = isSelf
      ? "Are you sure you want to leave this team?"
      : `Remove ${targetName} from this team?`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/teams/${team.id}/members/${targetUserId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(isSelf ? "You left the team" : "Member removed");
        onRefresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to remove member");
      }
    } catch {
      toast.error("Error removing member");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "OWNER":
        return (
          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-xs min-w-[90px]">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            OWNER
          </span>
        );
      case "ADMIN":
        return (
          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs min-w-[90px]">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            ADMIN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-white/10 shadow-xs min-w-[90px]">
            <User className="w-3.5 h-3.5 text-slate-400" />
            MEMBER
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Permissions Summary Banner */}
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 shadow-xl">
        <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400" />
          {t("rbacMatrix")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-amber-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-amber-300">{t("roleOwner")}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t("rbacOwnerDesc")}
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-300">{t("roleAdmin")}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t("rbacAdminDesc")}
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-slate-200">{t("roleMember")}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t("rbacMemberDesc")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Members List (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UsersRound className="w-5 h-5 text-emerald-400" />
                {t("teamRoster")} ({1 + team.members.filter((m: any) => m.userId !== team.ownerId).length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t("yourCurrentRole")} <span className="font-bold text-emerald-400">{currentUserRole}</span>
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {/* Team Owner Row */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/20 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/30 shrink-0">
                  {team.owner.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate flex items-center gap-2 text-sm">
                    {team.owner.name}
                    {team.owner.id === currentUserId && (
                      <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> {team.owner.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="w-24 flex justify-end items-center">
                  {getRoleBadge("OWNER")}
                </div>
                <div className="w-8 h-8 shrink-0" aria-hidden="true" />
              </div>
            </div>

            {/* Other Members */}
            {team.members
              .filter((m: any) => m.userId !== team.ownerId)
              .map((member: any) => {
                const isTargetSelf = member.userId === currentUserId;
                const canModifyRole =
                  isOwner || (currentUserRole === "ADMIN" && member.role !== "ADMIN");
                const canRemove =
                  isOwner || isTargetSelf || (currentUserRole === "ADMIN" && member.role === "MEMBER");

                return (
                  <div
                    key={member.id}
                    className="p-4 bg-slate-950/80 rounded-2xl border border-white/10 hover:border-emerald-500/30 flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-slate-300 font-bold flex items-center justify-center text-sm border border-white/10 shrink-0">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate flex items-center gap-2 text-sm">
                          {member.user.name}
                          {isTargetSelf && (
                            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" /> {member.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 flex justify-end items-center">
                        {canModifyRole ? (
                          <div className="relative">
                            <select
                              value={member.role}
                              disabled={updatingUserId === member.userId}
                              onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                              className="px-2.5 py-1 rounded-lg border border-white/10 bg-slate-900 text-xs font-bold text-slate-200 cursor-pointer focus:outline-none focus:border-emerald-400"
                            >
                              <option value="MEMBER">Member</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </div>
                        ) : (
                          getRoleBadge(member.role)
                        )}
                      </div>

                      {canRemove && (
                        <button
                          onClick={() => handleRemoveMember(member.userId, member.user.name)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title={isTargetSelf ? "Leave Team" : "Remove Member"}
                        >
                          {isTargetSelf ? <LogOut className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Invite Member Box (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl h-fit">
          <div className="pb-4 border-b border-white/10 mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              {t("inviteTeammate")}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t("inviteTeammateDesc")}
            </p>
          </div>

          {canManageMembers ? (
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                  {t("emailAddress")}
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                  {t("initialRole")}
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-xs font-bold text-slate-200 cursor-pointer focus:outline-none"
                >
                  <option value="MEMBER">Member (Standard Access)</option>
                  <option value="ADMIN">Admin (Can Manage Tasks & Members)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isInviting || !newEmail.trim()}
                className="w-full py-2.5 rounded-xl theme-gradient-btn text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {isInviting ? t("btnInviting") : t("btnSendInvite")}
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-center text-xs text-slate-500">
              Only workspace Owners and Admins can invite new members.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
