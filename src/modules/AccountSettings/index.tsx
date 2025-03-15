import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addMonths, format } from "date-fns";
import { Calendar, Upload } from "lucide-react";
import { useState } from "react";

const AccountSettings = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState("Lisa Chen");
  const [currentName, setCurrentName] = useState("Lisa Chen");

  // Initialize dates
  const today = new Date();
  const [originalSubmissionDate] = useState(today);
  const [originalClosureDate] = useState(addMonths(today, 1));
  const [submissionDate, setSubmissionDate] = useState(today);
  const [closureDate, setClosureDate] = useState(addMonths(today, 1));

  const handleSubmissionDateChange = (date: Date | undefined) => {
    if (date) {
      setSubmissionDate(date);
      // Update closure date to be one month after new submission date
      setClosureDate(addMonths(date, 1));
    }
  };

  const hasDateChanges = () => {
    return (
      submissionDate.getTime() !== originalSubmissionDate.getTime() ||
      closureDate.getTime() !== originalClosureDate.getTime()
    );
  };

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
    <div className="mx-auto max-w-4xl p-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="rounded-lg border border-slate-300 bg-white">
          <TabsTrigger value="profile" className="text-base">
            Profile & Security
          </TabsTrigger>
          <TabsTrigger value="academic" className="text-base">
            Academic Year
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-6">
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
                    <Button
                      variant="outline"
                      onClick={() => setProfileImage(null)}
                    >
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
                    <label className="mb-2 block text-sm font-medium">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      defaultValue="john@gmail.com"
                      disabled
                      className="opacity-70"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Phone
                    </label>
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

              <Button disabled={currentName === originalName}>
                Save Changes
              </Button>
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
        </TabsContent>

        <TabsContent value="academic">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">
              Academic Year Closure Dates
            </h2>
            <p className="mb-8 text-lg text-gray-500">
              Define the start and end dates for the academic year, including
              deadlines for idea submission and commenting.
            </p>

            <div className="mb-8 grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xl font-bold">
                  Idea Submission Deadline
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-lg border-gray-200 text-left font-normal"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      {format(submissionDate, "dd MMMM yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={submissionDate}
                      onSelect={handleSubmissionDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-xl font-bold">Final Closure Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-lg border-gray-200 text-left font-normal"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      {format(closureDate, "dd MMMM yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={closureDate}
                      onSelect={(date) => date && setClosureDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button
              className="bg-black text-white hover:bg-gray-800"
              disabled={!hasDateChanges()}
            >
              Save Changes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
