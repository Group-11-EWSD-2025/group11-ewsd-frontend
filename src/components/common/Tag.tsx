import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

type Props = {
  variant?: "default";
  content: string;
};

const tagVariants = cva("rounded-full px-3 py-1 text-sm", {
  variants: {
    variant: {
      default: "bg-purple-100 text-purple-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Tag = ({ variant = "default", content }: Props) => {
  return <div className={cn(tagVariants({ variant }))}>{content}</div>;
};

export default Tag;
