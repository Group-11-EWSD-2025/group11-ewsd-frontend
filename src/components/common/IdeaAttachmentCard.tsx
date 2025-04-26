import { File } from "lucide-react";

function IdeaAttachmentCard({ attachment }: { attachment: string }) {
  const fileName = attachment.split("/").pop() || "";
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

  const handlePreview = () => {
    let previewUrl = attachment;

    // Document files
    if (
      ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "rtf"].includes(
        fileExtension,
      )
    ) {
      previewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(attachment)}&embedded=true`;
    }
    // PDF files
    else if (["pdf"].includes(fileExtension)) {
      previewUrl = attachment;
    }
    // Image files
    else if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
        fileExtension,
      )
    ) {
      previewUrl = attachment;
    }
    // Video files
    else if (["mp4", "webm", "ogg", "mov", "avi"].includes(fileExtension)) {
      previewUrl = attachment;
    }
    // Audio files
    else if (["mp3", "wav", "ogg", "m4a", "flac"].includes(fileExtension)) {
      previewUrl = attachment;
    }
    // Code files
    else if (
      [
        "html",
        "htm",
        "css",
        "js",
        "ts",
        "jsx",
        "tsx",
        "json",
        "xml",
        "md",
        "markdown",
      ].includes(fileExtension)
    ) {
      previewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(attachment)}&embedded=true`;
    }
    // Archive files
    else if (["zip", "rar", "7z", "tar", "gz"].includes(fileExtension)) {
      // Archive files can't be previewed directly
      window.open(attachment, "_blank");
      return;
    }

    window.open(previewUrl, "_blank");
  };

  return (
    <div
      className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-slate-100 transition-colors hover:bg-slate-200"
      onClick={handlePreview}
    >
      <File size={24} className="text-slate-500" />
      <p className="text-muted-foreground max-w-[100px] truncate text-sm">
        {fileName}
      </p>
    </div>
  );
}

export default IdeaAttachmentCard;
