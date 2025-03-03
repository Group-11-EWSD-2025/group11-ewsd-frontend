import { Button } from "@/components/ui/button";
import { useState } from "react";
import IllustrationOne from "/public/assets/images/illustration1.png";
import IllustrationTwo from "/public/assets/images/illustration2.png";

function AccountType() {
  const [accountType, setAccountType] = useState<string | null>(null);

  const AccountType = [
    {
      id: 1,
      type: "personal",
      description: "For personal purpose",
      image: IllustrationOne,
      isDisabled: false,
    },
    {
      id: 2,
      type: "organization",
      description: "For setting up as an organization",
      image: IllustrationTwo,
      isDisabled: false,
    },
    {
      id: 3,
      type: "team",
      description: "For setting up as a Team",
      image: IllustrationTwo,
      isDisabled: true,
    },
  ];

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center gap-y-7">
      <div className="flex flex-col items-center gap-y-2">
        <h1 className="text-primary-gradient">Magick Workforce</h1>
        <h3 className="font-semibold text-[#334155]">
          ✨ May we know which purpose you use Magick Workforce for?
        </h3>
      </div>

      <div className="flex gap-x-4">
        {AccountType.map((acc) => (
          <div
            key={acc.type}
            className={`w-[300px] rounded-[6px] border border-[#CBD5E1] px-5 pt-[35px] pb-5 transition-colors ${
              acc.isDisabled
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : accountType === acc.type
                  ? "border-primary"
                  : "hover:border-primary cursor-pointer"
            }`}
            onClick={() => setAccountType(acc.type)}
          >
            <div className="mb-4">
              <img
                src={acc.image}
                alt={acc.type}
                className="h-[153px] w-full object-contain"
              />
            </div>

            <p
              className={`text-center font-bold ${
                acc.isDisabled
                  ? "text-foreground"
                  : acc.type === "personal"
                    ? "text-[#D97706]"
                    : "text-[#2563EB]"
              }`}
            >
              {acc.description}
              {acc.isDisabled && <span className="block">(coming soon)</span>}
            </p>
          </div>
        ))}
      </div>

      <Button className="min-w-lg" disabled={!accountType}>
        Continue
      </Button>
    </div>
  );
}

export default AccountType;
