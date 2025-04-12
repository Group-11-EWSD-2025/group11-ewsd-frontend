import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomForm from "@/components/common/CustomForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useUpdateUserDetail } from "../api/mutateUpdateUserDetail";

// Types
type UserInfo = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  profile: string | null;
};

interface ProfileAndSecurityProps {
  userInfo: UserInfo;
  isUserDetailLoading: boolean;
}

// Schema
const userInfoSchema = z.object({
  id: z.number().min(1, { message: "ID is required" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.string().min(1, { message: "Role is required" }),
  phone: z.string().min(3, { message: "Phone number is required" }),
  profile: z.instanceof(File).nullable(),
  profilePreview: z.string().nullable(),
});

export type UserDetailFormInputs = z.infer<typeof userInfoSchema>;

const ProfileAndSecurity = ({
  userInfo,
  isUserDetailLoading,
}: ProfileAndSecurityProps) => {
  // State
  const [currentImagePreview, setCurrentImagePreview] = useState<string | null>(
    null,
  );
  const queryClient = useQueryClient();
  const { authState, setAuthState } = useAuth();

  // Form setup
  const userDetailForm = useForm<UserDetailFormInputs>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      id: userInfo?.id || 0,
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      role: userInfo?.role || "",
      phone: userInfo?.phone || "",
      profile: null,
      profilePreview: userInfo?.profile || null,
    },
  });

  // Mutations
  const updateUserDetailMutation = useUpdateUserDetail({
    mutationConfig: {
      onSuccess: (res) => {
        toast({
          title: "Profile updated successfully",
        });

        queryClient.invalidateQueries({ queryKey: ["me"] });
        queryClient.invalidateQueries({
          queryKey: ["getUserDetail", authState.userData.id],
        });
        setAuthState((prev) => ({
          ...prev,
          userData: {
            ...prev.userData,
            id: String(res.data.body.id),
            email: res.data.body.email,
            name: res.data.body.name,
            role: res.data.body.role,
            phone: res.data.body.phone,
            profile: res.data.body.profile,
          },
        }));
      },
      onError: (error) => {
        toast({
          title: "Failed to update profile",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      userDetailForm.setValue("profile", file);
      userDetailForm.setValue("profilePreview", imageUrl);
      setCurrentImagePreview(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    userDetailForm.setValue("profile", null);
    userDetailForm.setValue("profilePreview", null);
    setCurrentImagePreview(null);
  };

  const onSubmit = (data: UserDetailFormInputs) => {
    updateUserDetailMutation.mutate(data);
  };

  useEffect(() => {
    if (userInfo && !updateUserDetailMutation.isPending) {
      setCurrentImagePreview(userInfo.profile);
      userDetailForm.reset({
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role,
        phone: userInfo.phone,
        profile: null,
        profilePreview: userInfo.profile,
      });
    }
  }, [userInfo, updateUserDetailMutation.isPending]);

  // Derived values
  const isUpdating = updateUserDetailMutation.isPending || isUserDetailLoading;
  const isFormDirty =
    userDetailForm.formState.isDirty || userDetailForm.watch("profile");

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">Profile</h2>
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            {!isUpdating ? (
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={currentImagePreview || userInfo?.profile || ""}
                  alt={userInfo?.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted">
                  {userInfo?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Skeleton className="h-24 w-24 rounded-full" />
            )}

            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                className="relative"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (event) => {
                    handleImageUpload(
                      event as unknown as React.ChangeEvent<HTMLInputElement>,
                    );
                  };
                  input.click();
                }}
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
              {userDetailForm.watch("profile") && (
                <Button variant="outline" onClick={handleRemoveImage}>
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Form Section */}
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
                }}
              />
            </div>

            <CustomForm.Button
              type="submit"
              className="mt-4"
              state={isUpdating ? "loading" : "default"}
              disabled={!isFormDirty}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </CustomForm.Button>
          </CustomForm>
        </div>
      </div>
    </div>
  );
};

export default ProfileAndSecurity;
