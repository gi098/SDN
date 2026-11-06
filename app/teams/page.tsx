"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Users, FolderKanban, Search, Sparkles, Loader2, ArrowRight, Lock, LayoutGrid, X, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/lib/languageContext";

export default function TeamsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Team Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTeams();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  async function fetchTeams() {
    try {
      const res = await fetch("/api/teams");
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      } else {
        toast.error("Failed to load teams");
      }
    } catch {
      toast.error("Error loading teams");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeamName, description: newTeamDesc }),
      });

      if (res.ok) {
        toast.success("Team created successfully!");
        setNewTeamName("");
        setNewTeamDesc("");
        setIsCreateModalOpen(false);
        fetchTeams();
      } else {
        toast.error("Failed to create team");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl text-center max-w-lg w-full">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl mx-auto flex items-center justify-center mb-6 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">{t("signInRequired")}</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {t("signInDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="px-6 py-3 rounded-xl theme-gradient-btn text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all">
              {t("btnSignInNow")}
            </Link>
            <Link href="/register" className="px-6 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-slate-200 font-bold hover:bg-slate-700 text-sm transition-all">
              {t("btnCreateAccount")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 md:py-12 space-y-8 animate-in fade-in duration-500">
      
      {/* Modern High-Tech Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-8 md:p-12 text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-transparent blur-[90px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-violet-600/20 to-cyan-500/10 blur-[80px] rounded-full translate-y-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col items-start gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black tracking-widest uppercase">{t("cmdCenter")}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {t("welcomeBack")}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">{session?.user?.name?.split(" ")[0] || "User"}</span>
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base font-medium max-w-2xl leading-relaxed">
              {t("teamsHeroDesc")}
            </p>
          </div>

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 rounded-xl theme-gradient-btn text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            {t("createNewTeam")}
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="space-y-6 relative z-10">
        
        {/* Search & Header Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <LayoutGrid className="w-6 h-6 text-cyan-400" />
            {t("myWorkspaces")}
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Filter teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* Grid of Teams in Modern Dark Cards */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 rounded-3xl border border-dashed border-white/10 backdrop-blur-md">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-cyan-500/20 text-cyan-400">
              <FolderKanban className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{t("noWorkspacesFound")}</h3>
            <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">{t("noWorkspacesDesc")}</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-2.5 rounded-xl theme-gradient-btn text-white font-bold text-xs shadow-md transition-all"
            >
              {t("createFirstTeam")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => {
              const isOwner = team.ownerId === (session?.user as any)?.id;
              
              return (
                <div 
                  key={team.id} 
                  className="group relative bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-[0_10px_35px_-5px_rgba(6,182,212,0.25)] transition-all duration-300 flex flex-col h-[290px] overflow-hidden hover:-translate-y-1"
                >
                  <div className="flex-1 relative z-10 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/30 border border-cyan-500/40 shadow-sm flex items-center justify-center text-lg font-black text-cyan-400 group-hover:scale-110 transition-transform">
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      {isOwner ? (
                        <div className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-amber-500/20">
                          <Sparkles className="w-3 h-3 text-amber-400" /> {t("ownerLabel")}
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 bg-slate-800 text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/5">
                          <Users className="w-3 h-3" /> {t("memberLabel")}
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors mb-2 leading-snug line-clamp-1">
                      {team.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {team.description || t("noDescProvided")}
                    </p>
                  </div>

                  {/* Footer Stats & Button */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-slate-400 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-white/5 text-xs font-semibold">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{team.members ? team.members.filter((m: any) => m.userId !== team.ownerId).length + 1 : 1}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-white/5 text-xs font-semibold">
                        <FolderKanban className="w-3.5 h-3.5 text-violet-400" />
                        <span>{team._count?.tasks || 0} tasks</span>
                      </div>
                    </div>

                    <Link 
                      href={`/teams/${team.id}`}
                      className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shadow-sm group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:-rotate-45"
                    >
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0c1222] rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-black text-white flex items-center gap-2.5 mb-5">
              <FolderKanban className="w-6 h-6 text-cyan-400" />
              {t("createWorkspace")}
            </h2>
            
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
                  {t("teamName")} <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/70 focus:outline-none focus:border-cyan-400 text-sm font-semibold text-white placeholder:text-slate-500"
                  placeholder={t("teamNamePlaceholder")}
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
                  {t("descOptional")}
                </label>
                <textarea
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/70 focus:outline-none focus:border-cyan-400 text-sm font-semibold text-white placeholder:text-slate-500 min-h-[90px] resize-none"
                  placeholder={t("teamDescPlaceholder")}
                />
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full mt-2 py-3 rounded-xl theme-gradient-btn text-white text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("btnCreating")}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[3]" />
                    {t("btnCreateTeam")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
