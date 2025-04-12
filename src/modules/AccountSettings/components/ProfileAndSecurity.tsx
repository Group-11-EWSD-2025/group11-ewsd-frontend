import CustomForm from "@/components/common/CustomForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userInfoSchema = z.object({
  id: z.number().min(1, { message: "ID is required" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.string().min(1, { message: "Role is required" }),
  phone: z.string().min(3, { message: "Phone number is required" }),
  profile: z.instanceof(File).nullable(),
});

export type UserDetailFormInputs = z.infer<typeof userInfoSchema>;

interface ProfileAndSecurityProps {
  userInfo: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    profile: string | null;
  };
  onUpdateUserDetail: (data: UserDetailFormInputs) => void;
}

const ProfileAndSecurity = ({
  userInfo,
  onUpdateUserDetail,
}: ProfileAndSecurityProps) => {
  const userDetailForm = useForm<UserDetailFormInputs>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      id: userInfo?.id || 0,
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      role: userInfo?.role || "",
      phone: userInfo?.phone || "",
      profile: null,
    },
  });

  useEffect(() => {
    if (userInfo) {
      userDetailForm.reset({
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role,
        phone: userInfo.phone,
        profile: null,
      });
    }
  }, [userInfo]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        userDetailForm.setValue("profile", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: UserDetailFormInputs) => {
    onUpdateUserDetail(data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">Profile</h2>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userInfo?.profile || ""} alt={userInfo?.name} />
              <AvatarFallback className="bg-muted">
                {userInfo?.name?.charAt(0) || "U"}
              </AvatarFallback>
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
              {userDetailForm.watch("profile") && (
                <Button
                  variant="outline"
                  onClick={() => userDetailForm.setValue("profile", null)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          <CustomForm
            formMethods={userDetailForm}
            onSubmit={onSubmit}
            className="space-y-4"
          >
            <CustomForm.InputField
              field={{
                type: "hidden",
                name: "id",
              }}
            />
            <CustomForm.InputField
              field={{
                type: "hidden",
                name: "role",
                value: userInfo.role,
              }}
            />
            <CustomForm.InputField
              field={{
                label: "Name",
                name: "name",
                type: "text",
                placeholder: "Enter your name",
                required: true,
              }}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomForm.InputField
                field={{
                  label: "Email",
                  name: "email",
                  type: "email",
                  placeholder: "Enter your email",
                  required: true,
                  disabled: true,
                  className: "opacity-70",
                }}
              />
              <CustomForm.InputField
                field={{
                  label: "Phone",
                  name: "phone",
                  type: "tel",
                  placeholder: "Enter your phone number",
                  required: true,
                  disabled: true,
                  className: "opacity-70",
                }}
              />
            </div>

            <CustomForm.Button
              type="submit"
              className="mt-4"
              disabled={!userDetailForm.formState.isDirty}
            >
              Save Changes
            </CustomForm.Button>
          </CustomForm>
        </div>
      </div>
    </div>
  );
};

export default ProfileAndSecurity;
