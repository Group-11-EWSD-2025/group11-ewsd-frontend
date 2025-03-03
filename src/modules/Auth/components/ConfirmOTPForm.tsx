import CustomForm from "@/components/common/CustomForm";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function ConfirmOTPForm() {
  const formSchema = z.object({
    otp: z.string().min(6, { message: "OTP Code is required." }),
  });

  type FormInputs = z.infer<typeof formSchema>;

  const sampleForm = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  function onSubmit(data: FormInputs) {
    console.log(data);
  }

  return (
    <CustomForm
      formMethods={sampleForm}
      onSubmit={onSubmit}
      className="pace-y-5 w-full"
    >
      <CustomForm.OTPField
        field={{
          name: "otp",
          slotCount: 6,
          className: "w-[76px] h-[70px] my-4",
        }}
      />

      <CustomForm.Button type="submit" className="w-full">
        Enter
      </CustomForm.Button>

      <p className="text-muted-foreground text-center">
        Do not receive OTP code?{" "}
        <Button
          variant="link"
          type="button"
          className="text-chart-3 text-md p-0 underline"
        >
          Resend Now
        </Button>
      </p>
    </CustomForm>
  );
}
