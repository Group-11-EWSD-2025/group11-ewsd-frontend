import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialog as ShadcnAlertDialog,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog as ShadcnDialog,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { dialogState } from "@/recoil/common";
import { Dialog as DialogProps } from "@/types/common";
import { cva } from "class-variance-authority";
import { useRecoilState } from "recoil";

const classes = cva(
  "fixed z-[1000] bg-white w-full rounded-lg max-h-[80vh] overflow-auto",
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-2xl",
        xl: "max-w-3xl",
        "2xl": "max-w-4xl",
      },
    },
  },
);

const Dialog = () => {
  const [dialog, setDialog] = useRecoilState<DialogProps | undefined>(
    dialogState,
  );
  const {
    isAlert,
    size = "md",
    title,
    description,
    descriptionClassName,
    className,
    titleClassName,
    onClose,
    children,
    action,
    cancel,
  } = dialog || {};

  const handleAction = async () => {
    action?.onClick?.();
    setDialog(undefined);
  };

  const handleCancel = async () => {
    cancel?.onClick?.();
    setDialog(undefined);
  };

  const renderDialogFooter = () => {
    return (
      <div className="flex justify-end space-x-2">
        {cancel && (
          <Button
            variant={cancel.variant ?? "outline"}
            {...cancel}
            onClick={handleCancel}
          >
            {cancel.label ?? "Cancel"}
          </Button>
        )}
        {action && (
          <Button
            variant={action.variant ?? "default"}
            {...action}
            onClick={handleAction}
            state={action?.state ?? "default"}
          >
            {action.label ?? "Confirm"}
          </Button>
        )}
      </div>
    );
  };

  const dialogContent = (
    <>{typeof children === "function" ? children() : children}</>
  );

  if (!dialog) return null;

  if (isAlert) {
    return (
      <ShadcnAlertDialog
        open={true}
        onOpenChange={(isOpen) => {
          !isOpen && setDialog(undefined);
          onClose?.();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={titleClassName}>
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className={descriptionClassName}>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {dialogContent}
          {(!!action || !!cancel) && (
            <AlertDialogFooter>{renderDialogFooter()}</AlertDialogFooter>
          )}
        </AlertDialogContent>
      </ShadcnAlertDialog>
    );
  }

  return (
    <ShadcnDialog
      open={true}
      onOpenChange={(isOpen) => {
        !isOpen && setDialog(undefined);
        onClose?.();
      }}
    >
      <DialogContent className={classes({ size, className })}>
        <DialogHeader>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          {description && (
            <DialogDescription
              className={cn("mt-5 text-base", descriptionClassName)}
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {dialogContent}
        {(!!action || !!cancel) && (
          <DialogFooter>{renderDialogFooter()}</DialogFooter>
        )}
      </DialogContent>
    </ShadcnDialog>
  );
};

export default Dialog;
