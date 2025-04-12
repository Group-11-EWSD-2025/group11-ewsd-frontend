import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { FEATURES, useAuthorize } from "@/hooks/useAuthorize";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateAcademicYear } from "./api/mutateCreateAcademicYear";
import { useDeleteAcademicYear } from "./api/mutateDeleteAcademicYear";
import { useUpdateAcademicYear } from "./api/mutateUpdateAcademicYear";
import { useUpdateUserDetail } from "./api/mutateUpdateUserDetail";
import { useGetAcademicYearList } from "./api/queryGetAcademicYearList";
import { useGetUserDetail } from "./api/queryGetUserDetail";
import Academic from "./components/Academic";
import ProfileAndSecurity from "./components/ProfileAndSecurity";

import {
  AcademicCreateFormInputs,
  AcademicEditFormInputs,
} from "./components/Academic";
import { UserDetailFormInputs } from "./components/ProfileAndSecurity";

const AccountSettings = () => {
  const { authState, setAuthState } = useAuth();
  const queryClient = useQueryClient();
  const { checkFeatureAvailability } = useAuthorize();

  const getUserDetail = useGetUserDetail({
    id: authState.userData.id,
    queryConfig: {
      enabled: !!authState.userData.id,
    },
  });

  const getAcademicYearList = useGetAcademicYearList({});

  const userInfo = {
    id: getUserDetail.data?.data.body.id || "",
    name: getUserDetail.data?.data.body.name || "",
    email: getUserDetail.data?.data.body.email || "",
    phone: getUserDetail.data?.data.body.phone || "",
    profile: getUserDetail.data?.data.body.profile || "",
    role: getUserDetail.data?.data.body.role || "",
  };

  const updateUserDetailMutation = useUpdateUserDetail({
    mutationConfig: {
      onSuccess: (res) => {
        toast({
          title: "Profile updated successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["getUserDetail", authState.userData.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["me"],
        });
        setAuthState((prev) => ({
          ...prev,
          userData: {
            id: res.data.body.id,
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

  const createAcademicYearMutation = useCreateAcademicYear({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: "Academic year is created successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["academic-year-list"],
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to create academic year dates",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const updateAcademicYearMutation = useUpdateAcademicYear({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: "Academic year dates updated successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["academic-year-list"],
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to update academic year dates",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const deleteAcademicYearMutation = useDeleteAcademicYear({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: "Academic year dates is deleted successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["academic-year-list"],
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to delete academic year.",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const handleUpdateUserDetail = (data: UserDetailFormInputs) => {
    updateUserDetailMutation.mutate(data);
  };

  const handleAcademicYearDelete = (id: number) => {
    deleteAcademicYearMutation.mutate(id);
  };

  const handleUpdateAcademicYearUpdate = (data: AcademicEditFormInputs) => {
    updateAcademicYearMutation.mutate(data);
  };

  const handleAcademicYearCreate = (data: AcademicCreateFormInputs) => {
    createAcademicYearMutation.mutate(data);
  };

  const academicYears = getAcademicYearList.data?.data.body || [];

  const tabs = [
    {
      label: "Profile & Security",
      value: "profile",
      content: (
        <ProfileAndSecurity
          userInfo={userInfo}
          onUpdateUserDetail={handleUpdateUserDetail}
          isLoading={
            updateUserDetailMutation.isPending || getUserDetail.isLoading
          }
        />
      ),
    },
    {
      label: "Academic Year",
      value: "academic",
      content: (
        <Academic
          academicYears={academicYears}
          onCreateAcademicYear={handleAcademicYearCreate}
          onDeleteAcademicYear={handleAcademicYearDelete}
          onUpdateAcademicYear={handleUpdateAcademicYearUpdate}
        />
      ),
    },
  ];

  return (
    <div className="mx-auto w-full py-4 lg:max-w-[var(--content-width)] lg:py-6">
      {checkFeatureAvailability(FEATURES.ACADEMIC_YEAR_SETTING) ? (
        <Tabs defaultValue="profile" className="w-full space-y-2">
          <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <TabsList className="bg-background flex">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-slate-100"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <ProfileAndSecurity
          userInfo={userInfo}
          onUpdateUserDetail={handleUpdateUserDetail}
          isLoading={
            updateUserDetailMutation.isPending || getUserDetail.isLoading
          }
        />
      )}
    </div>
  );
};

export default AccountSettings;
