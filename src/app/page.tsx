"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function UserTestPage() {
  const { login, logout, isAuthenticated, principal } = useAuth();
  const { user, register, fetchUser, update, clearUser } = useUser();

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    nickname: "",
    about: "",
    role: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname,
        about: user.about || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleCreateUser = async () => {
    setCreating(true);
    try {
      await register({
        username: `user-${Math.floor(Math.random() * 1000)}`,
        nickname: "Usuário de Teste",
        about: "Usuário criado via teste",
        role: "Dev",
      });
      await fetchUser();
    } catch (e) {
      console.error(e);
      alert("Erro ao criar usuário");
    } finally {
      setCreating(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await update({
        ...user,
        nickname: formData.nickname,
        about: formData.about,
        role: formData.role,
      });
      setEditing(false);
      alert("Usuário atualizado com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao atualizar o usuário");
    }
  };

  function handleLogin() {
    login();
  }

  if (!isAuthenticated) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-8">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg border border-border bg-popover">
          <h1 className="text-3xl font-bold text-center mb-4 text-foreground">Teste de Usuário</h1>
          <p className="text-muted-foreground text-center mb-8">
            Faça login para testar o sistema de usuários.
          </p>
          <Button onClick={handleLogin} className="w-full text-lg py-6">
            Login (Modo Dev)
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Painel de Teste do Usuário</h1>

      <div className="mb-6 p-4 rounded-lg border border-border bg-muted/20">
        <h2 className="text-lg font-semibold mb-2">Dados Autenticados</h2>
        <p><strong>Principal:</strong> {principal?.toText()}</p>
      </div>

      {user ? (
        <>
          <div className="mb-6 p-4 rounded-lg border border-border bg-muted/20">
            <h2 className="text-lg font-semibold mb-4">Perfil</h2>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Nickname</label>
                  <input
                    value={formData.nickname}
                    onChange={(e) => handleChange("nickname", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">About</label>
                  <textarea
                    value={formData.about}
                    onChange={(e) => handleChange("about", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Role</label>
                  <input
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="flex gap-4 mt-4">
                  <Button onClick={handleSave}>Salvar</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p><strong>Nickname:</strong> {user.nickname}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>About:</strong> {user.about}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Followers:</strong> {user.followers.length}</p>
                <p><strong>Following:</strong> {user.following.length}</p>
                <p><strong>Tracks Criadas:</strong> {user.createdTracks.length}</p>

                <Button onClick={() => setEditing(true)} className="mt-4">Editar Perfil</Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="mb-6 p-4 rounded-lg border border-border bg-muted/20">
          <p className="mb-4">Nenhum usuário encontrado para este principal.</p>
          <Button onClick={handleCreateUser} disabled={creating}>
            {creating ? "Criando..." : "Criar Usuário de Teste"}
          </Button>
        </div>
      )}

      <Button onClick={logout} variant="outline">Desconectar</Button>
    </main>
  );
}
