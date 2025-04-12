import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FEATURES, useAuthorize } from "@/hooks/useAuthorize";
import Academic from "./components/Academic";
import ProfileAndSecurity from "./components/ProfileAndSecurity";

const AccountSettings = () => {
  // Initialize dates
  const { checkFeatureAvailability } = useAuthorize();

  const tabs = [
    {
      label: "Profile & Security",
      value: "profile",
      content: <ProfileAndSecurity />,
    },
    {
      label: "Academic Year",
      value: "academic",
      content: <Academic />,
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
        <ProfileAndSecurity />
      )}
    </div>
  );
};

export default AccountSettings;
