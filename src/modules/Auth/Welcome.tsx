import GoogleIcon from "@/assets/google.svg?react";
import CustomForm from "@/components/common/CustomForm";
import { Button } from "@/components/ui/button";
import { PublicPageEndPoints } from "@/ecosystem/PageEndpoints/Public";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const welcomeSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least 3 characters" }),
});

export type WelcomeFormInputs = z.infer<typeof welcomeSchema>;

function Welcome() {
  const navigate = useNavigate();

  const welcomeForm = useForm<WelcomeFormInputs>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: WelcomeFormInputs) => {
    navigate(PublicPageEndPoints.register.getHref({ email: data.email }));
  };

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center gap-y-8">
      <div className="flex flex-col items-center gap-y-2">
        <h3>👋 Welcome to</h3>
        <h1 className="text-primary-gradient">Magick Workforce</h1>
      </div>
      <CustomForm
        formMethods={welcomeForm}
        onSubmit={onSubmit}
        className="border-border-input space-y-6 rounded-lg border p-8 shadow-sm"
      >
        <CustomForm.InputField
          field={{
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "Enter email",
            className: "w-[545px]",
          }}
        />
        <CustomForm.Button type="submit" className="w-full">
          Continue
        </CustomForm.Button>
      </CustomForm>

      <Button
        variant="ghost"
        className="bg-background border-border-input flex items-center gap-x-4 rounded-lg border px-8 py-3 shadow-sm"
      >
        <p>Continue with Google</p>
        <GoogleIcon />
      </Button>
    </div>
  );
}

export default Welcome;
