import CustomForm from "@/components/common/CustomForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicPageEndPoints } from "@/ecosystem/PageEndpoints/Public";
import { showDialog } from "@/lib/utils";
import { loginState } from "@/recoil/auth";
import { resetRecoil } from "@/recoil/recoil-portal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    resetRecoil(loginState);
    navigate(PublicPageEndPoints.login.path);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <p className="text-xl">Home</p>

      <Button onClick={handleLogout}>Logout</Button>
      <Button
        onClick={() =>
          showDialog({
            size: "sm",
            title: "Hello",
            description: "This is a test dialog",
            // cancel: {
            //   label: "Cancel",
            //   onClick: () => {
            //     console.log("cancel");
            //   },
            // },
            // action: {
            //   label: "Submit",
            //   onClick: () => {
            //     // console.log("submit");
            //     hideDialog();
            //   },
            // },
            children: <SampleForm />,
          })
        }
      >
        Show Dialog
      </Button>
    </div>
  );
}

const SampleForm = () => {
  const sampleSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters" }),
    lastName: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters" }),
    otp: z.string().min(4, { message: "OTP Code is required." }),
    pin: z.string().min(4, { message: "Pin Code is required." }),
  });

  type SampleFormInputs = z.infer<typeof sampleSchema>;

  const sampleForm = useForm<SampleFormInputs>({
    resolver: zodResolver(sampleSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      otp: "",
      pin: "",
    },
  });

  function onSubmit(data: SampleFormInputs) {
    console.log(data);
  }

  return (
    <CustomForm
      formMethods={sampleForm}
      onSubmit={onSubmit}
      className="w-full space-y-4"
    >
      <CustomForm.CustomField
        field={{
          name: "firstName",
          render: <Input type="text" placeholder="Enter first name" />,
        }}
      />
      <CustomForm.InputField
        field={{
          name: "lastName",
          type: "text",
          placeholder: "Enter last name",
        }}
      />
      <CustomForm.OTPField
        field={{
          name: "otp",
          slotCount: 4,
          className: "w-[50px] h-[50px]",
        }}
      />
      <CustomForm.PinInput
        field={{
          name: "pin",
          slotCount: 4,
          className: "w-[50px] h-[50px]",
        }}
      />
      <CustomForm.Button type="submit" className="w-full">
        Submit
      </CustomForm.Button>
    </CustomForm>
  );
};

export default Home;
