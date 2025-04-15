import {
  CheckboxProps,
  CheckboxField as CustomCheckboxField,
} from "@/components/common/CheckboxField";
import {
  CustomFieldProps,
  CustomFormField,
} from "@/components/common/CustomFormField";
import {
  FileUploadField as CustomFileUploadField,
  UploadFieldProps,
} from "@/components/common/FileUploadDragAndDrop";
import {
  InputField as CustomInputField,
  InputProps,
} from "@/components/common/InputField";
import {
  MultiSelectField as CustomMultiSelectField,
  CustomMultiSelectProps,
} from "@/components/common/MultiSelectField";
import {
  PasswordField as CustomPasswordField,
  PasswordFieldProps,
} from "@/components/common/PasswordField";
import {
  RadioField as CustomRadioField,
  RadioProps,
} from "@/components/common/RadioField";
import {
  SelectField as CustomSelectField,
  SelectProps,
} from "@/components/common/SelectField";
import {
  TextareaField as CustomTextareaField,
  TextareaProps,
} from "@/components/common/TextareaField";
import { Button as CustomButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import React, { createContext, useContext } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

type CustomFormProps<T extends FieldValues> = {
  formMethods: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  className?: string;
  children: React.ReactNode;
};

const FormMethodsContext = createContext<UseFormReturn<any> | null>(null);

function CustomForm<T extends FieldValues>({
  formMethods,
  onSubmit,
  className,
  children,
}: CustomFormProps<T>) {
  return (
    <FormMethodsContext.Provider value={formMethods}>
      <Form {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className={cn("space-y-2", className)}
        >
          {children}
        </form>
      </Form>
    </FormMethodsContext.Provider>
  );
}

CustomForm.InputField = function InputField({ field }: { field: InputProps }) {
  const formMethods = useContext(FormMethodsContext);
  if (!formMethods) {
    throw new Error("InputField must be used within a CustomForm");
  }
  return <CustomInputField hookedForm={formMethods} field={field} />;
};

CustomForm.SelectField = function SelectField({
  field,
  className,
  description,
}: {
  field: SelectProps;
  className?: string;
  description?: string;
}) {
  const formMethods = useContext(FormMethodsContext);
  if (!formMethods) {
    throw new Error("SelectField must be used within a CustomForm");
  }
  return (
    <CustomSelectField
      hookedForm={formMethods}
      field={field}
      className={className}
      description={description}
    />
  );
};

CustomForm.MultiSelectField = function MultiSelectField({
  field,
  className,
}: {
  field: CustomMultiSelectProps;
  className?: string;
}) {
  const formMethods = useContext(FormMethodsContext);
  if (!formMethods) {
    throw new Error("MultiSelectField must be used within a CustomForm");
  }
  return (
    <CustomMultiSelectField
      hookedForm={formMethods}
      field={field}
      className={className}
    />
  );
};

CustomForm.CheckboxField = function CheckboxField({
  field,
}: {
  field: CheckboxProps;
}) {
  const formMethods = useContext(FormMethodsContext);
  if (!formMethods) {
    throw new Error("CheckboxField must be used within a CustomForm");
  }
  return <CustomCheckboxField hookedForm={formMethods} field={field} />;
};

CustomForm.Button = function Button({
  children,
  state = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  state?: "loading" | "default";
}) {
  const formMethods = useContext(FormMethodsContext);
  if (!formMethods) {
    throw new Error("Button must be used within a CustomForm");
  }
  return (
    <CustomButton {...props} state={state}>
      {children}
    </CustomButton>
  );
};

CustomForm.PasswordField = function PasswordField({
  className,
  field,
  strengthBar,
}: {
  className?: string;
  field: PasswordFieldProps;
  strengthBar?: boolean;
}) {
  const formMethods = useContext(FormMethodsContext);
  if (!formMethods) {
    throw new Error("PasswordField must be used within a CustomForm");
  }
  return (
    <CustomPasswordField
      strengthBar={strengthBar}
      hookedForm={formMethods}
      className={className}
      field={field}
    />
  );
};

type FileUploadFieldProps = {
  field: UploadFieldProps;
  CustomFileList?: React.ComponentType;
};

CustomForm.FileUploadField = function FileUploadField({
  field,
  CustomFileList,
}: FileUploadFieldProps) {
  const formMethods = useContext(FormMethodsContext);
  if (!formMethods) {
    throw new Error("FileUploadField must be used within a CustomForm");
  }
  console.log(field, CustomFileList);
  return (
    <CustomFileUploadField
      hookedForm={formMethods}
      field={field}
      CustomFileList={CustomFileList}
    />
  );
};

CustomForm.CustomField = function CustomField({
  field,
}: {
  field: CustomFieldProps;
}) {
  const formMethods = useContext(FormMethodsContext);
  if (!formMethods) {
    throw new Error("CustomField must be used within a CustomForm");
  }
  return <CustomFormField hookedForm={formMethods} field={field} />;
};

CustomForm.RadioField = function RadioField({ field }: { field: RadioProps }) {
  const formMethods = useContext(FormMethodsContext);
  if (!formMethods) {
    throw new Error("RadioField must be used within a CustomForm");
  }
  return <CustomRadioField hookedForm={formMethods} field={field} />;
};
export default CustomForm;

CustomForm.TextareaField = function TextareaField({
  field,
}: {
  field: TextareaProps;
}) {
  const formMethods = useContext(FormMethodsContext);
  if (!formMethods) {
    throw new Error("TextareaField must be used within a CustomForm");
  }
  return <CustomTextareaField hookedForm={formMethods} field={field} />;
};
