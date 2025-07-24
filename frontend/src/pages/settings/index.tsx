import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PencilIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { usePopoverStore } from "@/stores/usePopoverStore";
import { toast } from "sonner";

export default function SettingsProfilePage() {
  const { user, update, isLoading } = useUser();
  const { open, close } = usePopoverStore();

  const [form, setForm] = useState({
    fullName: user?.username || "",
    displayName: user?.nickname || "",
    whatDoYouDo: user?.role || "",
    aboutMe: user?.about || "",
  });

  const [avatarUrl, _] = useState<string | null>(user?.picture || null);
  const [avatarInitials, setAvatarInitials] = useState(user?.nickname?.slice(0, 2) || "");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const changed =
      form.fullName !== user?.username ||
      form.displayName !== user?.nickname ||
      form.whatDoYouDo !== user?.role ||
      form.aboutMe !== user?.about;
    setIsDirty(changed);
  }, [form, user]);

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      setForm({
        fullName: user.username,
        displayName: user.nickname,
        whatDoYouDo: user.role || "",
        aboutMe: user.about || "",
      });
      setAvatarInitials(user.nickname.slice(0, 2));
    }
  }, [user, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    if (!user) return;

    e.preventDefault();

    open({ type: "loading" });

    await update({
      ...user,
      username: form.fullName,
      nickname: form.displayName,
      role: form.whatDoYouDo,
      about: form.aboutMe,
      picture: avatarUrl ?? undefined,
    });
    setIsDirty(false);
    close();
    toast.success("Perfil atualizado com sucesso!");
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-8">
      <h1 className="text-2xl font-semibold mb-4">Personal information</h1>
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <form onSubmit={handleSave} className="flex-1 space-y-6 text-zinc-400">
          <div className="flex gap-8">
            <div className="flex flex-col w-full gap-8">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full name</label>
                <Input
                  id="fullName"
                  className="bg-zinc-900 border-zinc-800"
                  value={form.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium mb-1">Display name</label>
                <Input
                  id="displayName"
                  className="bg-zinc-900 border-zinc-800"
                  value={form.displayName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="relative w-36 h-36 flex items-center justify-center">
              <Avatar className="w-36 h-36 text-white">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Avatar" />
                ) : (
                  <AvatarFallback className="text-2xl font-medium">{avatarInitials}</AvatarFallback>
                )}
              </Avatar>
              <Button
                type="button"
                size="icon"
                className="absolute bottom-1 right-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded-[40%] shadow-lg"
                aria-label="Edit profile picture"
                onClick={() => document.getElementById("avatarInput")?.click()}
              >
                <PencilIcon className="w-5 h-5" />
              </Button>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                className="hidden"
                onClick={() => {
                  open({
                    type: "generic",
                    title: "Feature not available yet",
                    description: "Profile picture editing will be available in a future update.",
                    content: <p>This feature is not available yet. Stay tuned!</p>,
                  })
                }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="whatDoYouDo" className="block text-sm font-medium mb-1">What do you do?</label>
            <Input
              id="whatDoYouDo"
              className="bg-zinc-900 border-zinc-800"
              value={form.whatDoYouDo}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="aboutMe" className="block text-sm font-medium mb-1">About me</label>
            <Textarea
              id="aboutMe"
              className="bg-zinc-900 border-zinc-800 min-h-[96px]"
              value={form.aboutMe}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="submit" disabled={!isDirty} className="bg-orange-500 hover:bg-orange-600 text-white">
              Save changes
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-zinc-700 text-white"
              onClick={() => {
                setForm({
                  fullName: user?.username || "",
                  displayName: user?.nickname || "",
                  whatDoYouDo: user?.role || "",
                  aboutMe: user?.about || "",
                });
                setIsDirty(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
