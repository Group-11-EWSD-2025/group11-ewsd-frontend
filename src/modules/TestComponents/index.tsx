import CustomForm from "@/components/common/CustomForm";
import ProfileCard from "@/components/common/ProfileCard";
import Stepper, { StepperNavigation } from "@/components/common/Stepper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxeIcon, CheckCheck, EyeIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PROFILE_LISTS = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    organization: "Personal AI Workspace",
    role: "Admin",
  },
  {
    name: "James Bond",
    email: "james.bond@example.com",
    organization: "NUOS Magicko",
    role: "Member",
  },
  {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    organization: "Personal AI Workspace",
    role: "Admin",
  },
  {
    name: "John Doe",
    email: "john.doe@example.com",
    organization: "Personal AI Workspace",
    role: "Admin",
  },
];

const INVITED_LISTS = [
  {
    email: "test@test.com",
    role: "member",
    status: "Sent",
    color: "#E5A863",
  },
  {
    email: "test2@test.com",
    role: "billing member",
    status: "Sent",
    color: "#2563EB",
  },
  {
    email: "test3@test.com",
    role: "member",
    status: "Sent",
    color: "#9333EA",
  },
];

const ROLES_OPTIONS = [
  {
    label: "Member",
    value: "member",
  },
  {
    label: "Billing Member",
    value: "billing member",
  },
  {
    label: "Admin",
    value: "admin",
  },
];

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type PasswordFormInputs = z.infer<typeof passwordSchema>;

const emailInviteSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["member", "admin"]),
});

export type EmailInviteFormInputs = z.infer<typeof emailInviteSchema>;

const TestComponents = () => {
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmitPassword = (data: PasswordFormInputs) => {
    console.log("Submitted password", data);
  };

  const emailInviteForm = useForm<z.infer<typeof emailInviteSchema>>({
    resolver: zodResolver(emailInviteSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const onSendInviteEmail = (data: EmailInviteFormInputs) => {
    console.log("Submitted email invite", data);
  };

  const KEYCLOAK_SERVER_URL = "https://keycloak.globalmagick.com";
  const KEYCLOAK_REALM = "dev-gmi-auth";
  const KEYCLOAK_CLIENT_ID = "public-client";
  const REDIRECT_URI = "http://localhost:5173/redirect"; // Update for your local setup

  function loginWithGoogle() {
    window.location.href =
      `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?` +
      `client_id=${KEYCLOAK_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=openid email profile` +
      `&kc_idp_hint=google`;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-primary">Test Components</h1>
      <div className="flex w-[40rem] items-center">
        <CustomForm
          formMethods={passwordForm}
          onSubmit={onSubmitPassword}
          className="w-full"
        >
          <CustomForm.PasswordField
            strengthBar
            field={{
              name: "password",
              placeholder: "Enter your password",
            }}
          />
          <div className="flex justify-end">
            <CustomForm.Button type="submit">Submit</CustomForm.Button>
          </div>
        </CustomForm>
      </div>
      <Button onClick={loginWithGoogle}>Login with Google</Button>

      {/* email invite compoent */}
      <div className="w-[40rem] shrink-0">
        <div className="w-full">
          <p className="mb-2">Enter Email</p>
          <CustomForm
            formMethods={emailInviteForm}
            onSubmit={onSendInviteEmail}
            className="grid w-full grid-cols-12 gap-x-4"
          >
            <div className="col-span-7 mb-0 h-full">
              <div className="h-full">
                <CustomForm.InputField
                  field={{
                    name: "email",

                    placeholder: "example@email.com",
                  }}
                />
              </div>
            </div>
            <div className="col-span-3 mb-0 h-full">
              <CustomForm.SelectField
                field={{
                  name: "role",
                  placeholder: "Select role",
                  options: ROLES_OPTIONS,
                }}
                className="space-y-0"
              />
            </div>
            <div className="col-span-2 h-full">
              <CustomForm.Button type="submit">Send Invite</CustomForm.Button>
            </div>
          </CustomForm>
        </div>

        {/* invited list component */}
        <div className="mt-4">
          <div className="border-border rounded-md border text-sm font-medium">
            {INVITED_LISTS.map((item, index) => (
              <div
                key={item.email}
                className={cn(
                  "grid grid-cols-12 items-center gap-x-4 p-2",
                  index !== INVITED_LISTS.length - 1 && "border-b",
                )}
              >
                <div className="col-span-7">
                  <p>{item.email}</p>
                </div>
                <div className="col-span-3">
                  <div
                    className="border-l-2 pl-2"
                    style={{ borderColor: item.color }}
                  >
                    <p>
                      {item.role
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center justify-end gap-2">
                    <p className="text-[#16A34A]">
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </p>
                    <CheckCheck className="w-4 shrink-0 text-[#16A34A]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* profile component */}

          {PROFILE_LISTS.map((profile, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedProfile(index);
              }}
            >
              <ProfileCard
                profile={profile}
                isSelected={selectedProfile === index}
                onClick={() => {}}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-10">
        <Stepper
          stepperClassName="flex items-center justify-center"
          containerClassName="py-[71px] w-[782px] mx-auto"
          steps={[
            {
              icon: <AxeIcon />,
              label: "Organization setup",
              content: <div>Step 1</div>,
            },
            {
              icon: <EyeIcon />,
              label: "Group creation",
              content: ({ onNext, onPrevious, isFirstStep, isLastStep }) => (
                <div className="flex max-w-96 flex-col gap-4">
                  <div>Step 2</div>

                  <StepperNavigation
                    onNext={onNext}
                    onPrevious={onPrevious}
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                    className="mt-8"
                  />
                </div>
              ),
            },
            {
              icon: <UsersIcon />,
              label: "Invite members",
              content: <div>Step 3</div>,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TestComponents;
