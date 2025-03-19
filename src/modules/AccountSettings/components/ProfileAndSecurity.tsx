import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useState } from "react";

const ProfileAndSecurity = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [originalName] = useState("Lisa Chen");
  const [currentName, setCurrentName] = useState("Lisa Chen");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">Profile</h2>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage || ""} />
              <AvatarFallback className="bg-muted">PP</AvatarFallback>
            </Avatar>
            <div className="space-x-2">
              <Button variant="default" className="relative">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
                <input
                  type="file"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              {profileImage && (
                <Button variant="outline" onClick={() => setProfileImage(null)}>
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Name</label>
              <Input
                placeholder="Enter your name"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  defaultValue="john@gmail.com"
                  disabled
                  className="opacity-70"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Phone</label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  defaultValue="0062342332"
                  disabled
                  className="opacity-70"
                />
              </div>
            </div>
          </div>

          <Button disabled={currentName === originalName}>Save Changes</Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Password</h2>
        <p className="text-muted-foreground mb-4">
          For security reasons, only administrators can reset passwords. If
          you&apos;ve forgotten your password, please contact your system
          administrator to request a reset.
        </p>
        <Button variant="outline">Request Password Reset</Button>
      </div>
    </div>
  );
};

export default ProfileAndSecurity;
