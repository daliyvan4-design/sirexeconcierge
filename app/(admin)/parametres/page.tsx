"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/admin/topbar";
import { useToast } from "@/components/admin/toast";
import { useSession } from "next-auth/react";
import { Trash2, Plus } from "lucide-react";

export default function ParametresPage() {
  const { data: session } = useSession();
  const { show } = useToast();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserNom, setNewUserNom] = useState("");
  const [newUserPw, setNewUserPw] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setNom(session.user.name || "");
      setEmail(session.user.email || "");
    }
    fetch("/api/admin/users").then((r) => r.json()).then(setUsers);
  }, [session]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, email }),
    });
    show("Profil mis à jour");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (newPw !== confirmPw) { setPwError("Les mots de passe ne correspondent pas"); return; }
    if (newPw.length < 6) { setPwError("Le mot de passe doit faire au moins 6 caractères"); return; }

    const res = await fetch("/api/admin/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });

    if (!res.ok) {
      const data = await res.json();
      setPwError(data.error);
    } else {
      show("Mot de passe modifié");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    }
  }

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newUserEmail, nom: newUserNom, password: newUserPw }),
    });
    show("Admin ajouté");
    setShowAddUser(false);
    setNewUserEmail(""); setNewUserNom(""); setNewUserPw("");
    fetch("/api/admin/users").then((r) => r.json()).then(setUsers);
  }

  async function deleteUser(id: string) {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    show("Admin supprimé");
    fetch("/api/admin/users").then((r) => r.json()).then(setUsers);
  }

  return (
    <>
      <Topbar title="Paramètres" />
      <div className="p-6 lg:p-10 max-w-2xl space-y-8">
        {/* Profile */}
        <form onSubmit={saveProfile} className="bg-white rounded-2xl border border-line p-6">
          <h3 className="font-serif text-[18px] text-ink mb-4">Profil</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-[0.22em] text-mute mb-1 block">Nom</label>
              <input value={nom} onChange={(e) => setNom(e.target.value)}
                className="w-full bg-cream border border-line rounded-xl px-4 py-2.5 text-[13px]" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.22em] text-mute mb-1 block">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                className="w-full bg-cream border border-line rounded-xl px-4 py-2.5 text-[13px]" />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-ink text-cream rounded-full px-6 py-2.5 text-[13px] font-medium hover:bg-ink2 btn-press">
            Sauvegarder
          </button>
        </form>

        {/* Password */}
        <form onSubmit={changePassword} className="bg-white rounded-2xl border border-line p-6">
          <h3 className="font-serif text-[18px] text-ink mb-4">Mot de passe</h3>
          {pwError && <p className="text-err text-[13px] mb-3">{pwError}</p>}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-[0.22em] text-mute mb-1 block">Mot de passe actuel</label>
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                className="w-full bg-cream border border-line rounded-xl px-4 py-2.5 text-[13px]" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.22em] text-mute mb-1 block">Nouveau mot de passe</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                className="w-full bg-cream border border-line rounded-xl px-4 py-2.5 text-[13px]" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.22em] text-mute mb-1 block">Confirmer</label>
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                className="w-full bg-cream border border-line rounded-xl px-4 py-2.5 text-[13px]" />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-ink text-cream rounded-full px-6 py-2.5 text-[13px] font-medium hover:bg-ink2 btn-press">
            Changer le mot de passe
          </button>
        </form>

        {/* Admin users */}
        <div className="bg-white rounded-2xl border border-line p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-[18px] text-ink">Administrateurs</h3>
            <button onClick={() => setShowAddUser(true)} className="text-[12px] flex items-center gap-1 text-gold hover:text-gold2">
              <Plus size={14} /> Ajouter
            </button>
          </div>
          <div className="divide-y divide-line">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[13px] text-ink font-medium">{u.nom}</p>
                  <p className="text-[12px] text-mute">{u.email}</p>
                </div>
                <button onClick={() => deleteUser(u.id)} className="text-mute hover:text-err">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          {showAddUser && (
            <form onSubmit={addUser} className="mt-4 pt-4 border-t border-line space-y-3">
              <input value={newUserNom} onChange={(e) => setNewUserNom(e.target.value)} placeholder="Nom"
                className="w-full bg-cream border border-line rounded-xl px-4 py-2.5 text-[13px]" required />
              <input value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="Email" type="email"
                className="w-full bg-cream border border-line rounded-xl px-4 py-2.5 text-[13px]" required />
              <input value={newUserPw} onChange={(e) => setNewUserPw(e.target.value)} placeholder="Mot de passe" type="password"
                className="w-full bg-cream border border-line rounded-xl px-4 py-2.5 text-[13px]" required />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAddUser(false)} className="text-[13px] text-mute">Annuler</button>
                <button type="submit" className="bg-ink text-cream rounded-full px-4 py-2 text-[13px] btn-press">Créer</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
