import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/general/theme-switch";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";

export default function PreferencesPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-8">
      <h1 className="text-2xl font-semibold mb-4">Preferences</h1>
      <div className="mb-6">
        <h2 className="text-base font-medium text-zinc-400 mb-2">Theme</h2>
        <ThemeSwitch />
      </div>
      <div className="mb-6">
        <h2 className="text-base font-medium text-zinc-400 mb-2">Customization</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <Switch />
            <label className="ml-2 text-sm text-zinc-600">Set reminder to complete tracks</label>
          </div>
          <div className="flex items-center">
            <Switch />
            <label className="ml-2 text-sm text-zinc-600">Enable tracks recommendations</label>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-base font-medium text-zinc-400 mb-2">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <Switch />
            <label className="ml-2 text-sm text-zinc-600">Receive email notifications</label>
          </div>
          <div className="flex items-center">
            <Switch />
            <label className="ml-2 text-sm text-zinc-600">Receive notifications within the platform</label>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-base font-medium text-zinc-400 mb-2">Privacy</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <Switch />
            <label className="ml-2 text-sm text-zinc-600">Allow others to see my activity history</label>
          </div>
          <div className="flex items-center">
            <Switch />
            <label className="ml-2 text-sm text-zinc-600">Allow my friends to see my progress</label>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-base font-medium text-zinc-400 mb-2">Privacy</h2>

        <Select>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Portuguese</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-4 pt-2">
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">Save changes</Button>
        <Button type="button" variant="outline" className="border-zinc-700 text-white">Cancel</Button>
      </div>
    </div>
  );
}