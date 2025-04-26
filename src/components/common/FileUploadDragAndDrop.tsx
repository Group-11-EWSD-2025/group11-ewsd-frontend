import { Button } from "@/components/ui/button";
import { File, FilePlus, ImageIcon, XIcon } from "lucide-react";
import React, { createContext, useCallback, useContext, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

// Constants
const FILE_SIZE_LIMIT = 3 * 1024 * 1024; // 3MB
const DEFAULT_MAX_FILES = 10;

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/msword": [".doc"],
  "image/*": [".png", ".jpg", ".jpeg", ".gif"],
} as const;

// Context type
interface FileUploadContextType {
  acceptedFiles: File[];
  errorMessage: string;
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  isFocused: boolean;
  getRootProps: any;
  getInputProps: any;
  handleRemoveFile: (fileName: string) => void;
  openFileDialog: () => void;
}

// Create context
const FileUploadContext = createContext<FileUploadContextType | undefined>(
  undefined,
);

// Context hook
export const useFileUpload = () => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error("FileUpload components must be used within FileUpload");
  }
  return context;
};

// Error message mapping
const getErrorMessage = (code: string): string => {
  const errorMessages: Record<string, string> = {
    "file-invalid-type":
      "Invalid file type. Only PDF, DOC, DOCX, and images are accepted.",
    "file-too-large": `File size exceeds ${FILE_SIZE_LIMIT / 1024 / 1024}MB limit.`,
    "too-many-files": "Too many files selected.",
  };
  return errorMessages[code] || "An error occurred with the file upload.";
};

interface FileUploadProps {
  onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
  onDelete?: () => void;
  maxFiles?: number;
  isMultiple?: boolean;
  children: React.ReactNode;
  CustomFileList?: React.ComponentType;
}

// Main component
const FileUpload = ({
  onDrop,
  onDelete,
  maxFiles,
  isMultiple = false,
  children,
  CustomFileList,
}: FileUploadProps) => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRejectedFiles = useCallback((rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length === 0) {
      setErrorMessage("");
      return;
    }

    const error = rejectedFiles[0].errors[0];
    setErrorMessage(getErrorMessage(error.code));
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused,
    open,
  } = useDropzone({
    onDrop: (accepted: File[], rejected: FileRejection[]) => {
      const newFiles = isMultiple
        ? [...acceptedFiles, ...accepted].filter(
            (file, index, self) =>
              index === self.findIndex((f) => f.name === file.name),
          )
        : accepted;

      setAcceptedFiles(newFiles);
      handleRejectedFiles(rejected);
      onDrop(newFiles, rejected);
    },
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: isMultiple ? maxFiles || DEFAULT_MAX_FILES : 1,
    maxSize: FILE_SIZE_LIMIT,
    noClick: false,
  });

  const handleRemoveFile = useCallback(
    (fileName: string) => {
      const updatedFiles = acceptedFiles.filter(
        (file) => file.name !== fileName,
      );

      setAcceptedFiles(updatedFiles);
      onDrop(updatedFiles, []);
      onDelete?.();
    },
    [acceptedFiles, onDrop, onDelete],
  );

  return (
    <FileUploadContext.Provider
      value={{
        acceptedFiles,
        errorMessage,
        isDragActive,
        isDragAccept,
        isDragReject,
        isFocused,
        getRootProps,
        getInputProps,
        handleRemoveFile,
        openFileDialog: open,
      }}
    >
      <div className="relative">
        <div className="flex items-start gap-4">
          {CustomFileList ? <CustomFileList /> : <FileUpload.FileList />}
          {acceptedFiles.length < (maxFiles || DEFAULT_MAX_FILES) && children}
        </div>
        <FileUpload.ErrorMessage />
      </div>
    </FileUploadContext.Provider>
  );
};

// Add new interface for render props
interface SimpleUploadRenderProps {
  acceptedFiles: File[];
  isFocused: boolean;
  openFileDialog: () => void;
}

interface SimpleUploadProps {
  children?: React.ReactNode;
  className?: string;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  render?: (props: SimpleUploadRenderProps) => React.ReactNode;
  variant?: "default" | "custom";
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

const SimpleUpload = ({
  children,
  className,
  buttonProps,
  render,
  wrapperProps,
}: SimpleUploadProps) => {
  const {
    openFileDialog,
    getInputProps,
    getRootProps,
    acceptedFiles,
    isFocused,
  } = useFileUpload();

  // If children are provided, render custom UI
  if (children) {
    return (
      <div className={className} onClick={openFileDialog} {...wrapperProps}>
        <input {...getInputProps()} />
        {children}
      </div>
    );
  }

  // If render prop is provided, render custom component
  if (render) {
    return (
      <div
        className={className}
        {...getRootProps()}
        onClick={(e) => {
          e.stopPropagation();
          openFileDialog();
        }}
        {...wrapperProps}
      >
        <input {...getInputProps()} />
        {typeof render === "function"
          ? render({
              acceptedFiles,
              isFocused,
              openFileDialog,
            })
          : render}
      </div>
    );
  }

  // Default button UI
  return (
    <div className={`flex items-center gap-2 ${className}`} {...wrapperProps}>
      <input {...getInputProps()} />
      <Button onClick={openFileDialog} {...buttonProps}>
        <FilePlus className="size-5" />
        Choose File
      </Button>
    </div>
  );
};

interface DropZoneRenderProps {
  isDragging: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  acceptedFiles: File[];
  isFocused: boolean;
  openFileDialog: () => void;
}

interface DropZoneProps {
  children?: React.ReactNode;
  className?: string;
  render?: (props: DropZoneRenderProps) => React.ReactNode;
  variant?: "default" | "custom";
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

// Modify DropZone component
const DropZone = ({
  children,
  className,
  render,
  variant = "default",
  wrapperProps,
}: DropZoneProps) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    isFocused,
    openFileDialog,
  } = useFileUpload();

  // If children are provided, render custom UI
  if (children) {
    return (
      <div
        {...getRootProps()}
        className={`cursor-pointer ${className}`}
        {...wrapperProps}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    );
  }

  // If render prop is provided, use custom render function
  if (render) {
    return (
      <div
        {...getRootProps()}
        className={`cursor-pointer ${className}`}
        {...wrapperProps}
      >
        <input {...getInputProps()} />
        {render({
          isDragging: isDragActive,
          isDragAccept,
          isDragReject,
          acceptedFiles,
          isFocused,
          openFileDialog,
        })}
      </div>
    );
  }

  // Custom variant
  if (variant === "custom") {
    return (
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "hover:border-primary/50 border-gray-300"
        } ${className}`}
        {...wrapperProps}
      >
        <input {...getInputProps()} />
        <div className="space-y-4 text-center">
          <div className="bg-primary/10 mx-auto w-fit rounded-full p-4">
            <FilePlus className="text-primary size-8" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-medium">
              {isDragActive ? "Drop files here" : "Drag & Drop files"}
            </p>
            <p className="text-muted-foreground text-sm">
              or click to select files
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      {...getRootProps()}
      className={`border-input cursor-pointer rounded-lg border border-dashed p-10 transition-colors focus:outline-none ${
        isDragActive
          ? "border-blue-500 bg-gray-600"
          : "bg-secondary border-gray-300 hover:bg-gray-600/5"
      } ${className}`}
      {...wrapperProps}
    >
      <input {...getInputProps()} />
      <div className="text-muted-foreground space-y-5 text-center">
        <FilePlus className="mx-auto size-6" />
        <p
          className={`text-sm ${isDragActive ? "text-gray-100" : "text-gray-400"}`}
        >
          {isDragActive ? "Drop the file here..." : "Drag and Drop files here"}
        </p>
        <p
          className={`text-sm ${isDragActive ? "text-gray-100" : "text-gray-400"}`}
        >
          Accepted files: PDF, DOC, DOCX, and images (max{" "}
          {FILE_SIZE_LIMIT / 1024 / 1024}MB)
        </p>
      </div>
    </div>
  );
};

const FileList = () => {
  const { acceptedFiles, handleRemoveFile } = useFileUpload();

  if (acceptedFiles.length === 0) return null;

  return (
    <div>
      <div className="flex gap-3">
        {acceptedFiles.map((file) => (
          <div key={file.name} className="relative">
            <div className="flex aspect-square w-[126px] items-center justify-center rounded-lg bg-gray-50">
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {file.type === "image/*" ? (
                    <ImageIcon className="size-6 text-gray-400" />
                  ) : (
                    <File className="size-6 text-gray-400" />
                  )}
                  <p className="text-muted-foreground max-w-[100px] truncate text-sm">
                    {file.name}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => handleRemoveFile(file.name)}
              className="absolute top-2 right-2 flex size-[28px] cursor-pointer items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
            >
              <XIcon className="size-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ErrorMessage = () => {
  const { errorMessage } = useFileUpload();

  if (!errorMessage) return null;

  return <p className="mt-2 text-sm text-red-500">{errorMessage}</p>;
};

// Update compound components
FileUpload.DropZone = DropZone;
FileUpload.SimpleUpload = SimpleUpload;
FileUpload.FileList = FileList;
FileUpload.ErrorMessage = ErrorMessage;

export type UploadFieldProps = {
  name: string;
  label?: string;
  isMultiple?: boolean;
  maxFiles?: number;
  children?: React.ReactNode;
};

export type FileUploadFieldProps = {
  hookedForm: UseFormReturn;
  field: UploadFieldProps;
  CustomFileList?: React.ComponentType;
};

export const FileUploadField = ({
  hookedForm,
  field: fieldProps,
  CustomFileList,
}: FileUploadFieldProps) => {
  return (
    <FormField
      control={hookedForm.control}
      name={fieldProps.name}
      render={({ field }) => (
        <FormItem>
          {fieldProps.label && <FormLabel>{fieldProps.label}</FormLabel>}
          <FormControl>
            <FileUpload
              onDrop={(acceptedFiles) => {
                field.onChange(
                  fieldProps.isMultiple ? acceptedFiles : acceptedFiles[0],
                );
              }}
              isMultiple={fieldProps.isMultiple}
              maxFiles={fieldProps.maxFiles}
              CustomFileList={CustomFileList}
            >
              {fieldProps.children || <FileUpload.DropZone /> || (
                <FileUpload.SimpleUpload />
              )}
            </FileUpload>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

FileUploadField.SimpleUpload = SimpleUpload;
FileUploadField.DropZone = DropZone;
FileUploadField.FileList = FileList;
FileUploadField.ErrorMessage = ErrorMessage;
