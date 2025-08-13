import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const ProfileLeft = () => {
	return (
		<aside className="w-full max-w-sm text-white rounded-xl shadow-lg p-6 flex flex-col items-start">
			{/* Avatar, Name & Username Row */}
			<div className="flex items-center w-full mb-4">
				<Avatar className="w-20 h-20 mr-4">
					<AvatarImage src="/assets/profile-placeholder.png" alt="Profile" />
					<AvatarFallback className="text-xl font-semibold">JL</AvatarFallback>
				</Avatar>
				<div className="flex flex-col justify-center">
					<h2 className="text-2xl font-semibold text-left">José Lima</h2>
					<span className="text-base text-zinc-400">@jlimaz</span>
				</div>
			</div>
			<Separator className="my-4 bg-zinc-800" />
			{/* Social Icons */}
			<div className="flex gap-3 mb-3">
				<a href="https://github.com/jlimaz" target="_blank" rel="noopener noreferrer">
					<svg className="" width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path fill="white" d="M10.007 2C5.579 2 2 5.606 2 10.066a8.06 8.06 0 005.475 7.652c.397.08.543-.174.543-.387 0-.187-.013-.828-.013-1.496-2.227.481-2.691-.961-2.691-.961-.358-.935-.888-1.176-.888-1.176-.73-.494.053-.494.053-.494.808.054 1.233.828 1.233.828.715 1.229 1.869.882 2.333.668.066-.52.278-.881.504-1.082-1.777-.187-3.646-.881-3.646-3.98 0-.88.318-1.602.822-2.163-.08-.2-.358-1.028.08-2.136 0 0 .676-.214 2.2.828a7.698 7.698 0 012.002-.268 7.7 7.7 0 012.001.268c1.525-1.042 2.2-.828 2.2-.828.438 1.108.16 1.936.08 2.136.517.561.822 1.282.822 2.164 0 3.098-1.869 3.779-3.659 3.98.292.253.544.734.544 1.495 0 1.082-.013 1.95-.013 2.217 0 .213.146.467.543.387A8.06 8.06 0 0018 10.066C18.013 5.606 14.42 2 10.007 2z"></path>
					</svg>
				</a>
				<a href="https://linkedin.com/in/jlimaz" target="_blank" rel="noopener noreferrer">
					<svg className="" width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path fill="white" d="M3.181 2h13.635C17.468 2 18 2.517 18 3.153v13.692C18 17.483 17.47 18 16.817 18H3.18C2.53 18 2 17.483 2 16.845V3.153C2 2.517 2.53 2 3.181 2zm3.57 5.994H4.372v7.635H6.75V7.994zm.184-2.425a1.376 1.376 0 0 0-2.752 0A1.38 1.38 0 0 0 5.56 6.945c.758 0 1.375-.618 1.375-1.376zm1.303 2.425h-.003l.003-.002v.002zm0 0v7.634h2.371V11.85c0-.996.19-1.96 1.425-1.96 1.217 0 1.233 1.14 1.233 2.024v3.715h2.372V11.44c0-2.055-.444-3.637-2.846-3.637-1.16 0-1.934.633-2.25 1.233h-.032V7.994H8.238z"></path>
					</svg>
				</a>
			</div>
			{/* Bio */}
			<p className="text-sm text-zinc-300 text-left w-full">
				Lorem ipsum dolor sit amet 🐮, consectetur adipiscing elit. Vestibulum leo nibh, finibus et mattis in, rutrum et ante. Mauris aliquam sodales magna quis convallis. Pellentesque dictum erat quis est vestibulum
			</p>
			<Separator className="my-4 bg-zinc-800" />
			{/* Followers & Following */}
			<div className="flex gap-4 mb-4 w-full">
				<span className="font-semibold font-base text-left">12 <span className="text-zinc-400 font-normal">Followers</span></span>
				<span className="font-semibold font-base text-left">12 <span className="text-zinc-400 font-normal">Following</span></span>
			</div>
			{/* Buttons */}
			<div className="flex gap-3 w-full">
				<Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">Follow</Button>
				<Button variant="outline" className="flex-1 border-zinc-700 text-white">Message</Button>
			</div>
			<Separator className="my-4 bg-zinc-800" />
			{/* Badges */}
			<div className="w-full">
				<h3 className="text-sm font-semibold mb-2 text-left">Badges</h3>
				<div className="flex gap-3">
					<span className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-red-400 text-white font-bold text-sm">PRO</span>
					<span className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold text-sm">OG</span>
				</div>
			</div>
		</aside>
	);
};

export default ProfileLeft;
