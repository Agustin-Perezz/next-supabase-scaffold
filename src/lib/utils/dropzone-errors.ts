import {
  FILE_DROPZONE_ERROR_MESSAGE,
  FileDropzoneError,
} from "@/components/ui/file-dropzone-types";

type DropzoneRejectCode = string;

export function mapDropzoneErrorCode(
  code: DropzoneRejectCode,
): FileDropzoneError {
  if (code === "file-too-large") {
    return FileDropzoneError.FileSizeExceeded;
  }
  if (code === "too-many-files") {
    return FileDropzoneError.TooManyFiles;
  }
  return FileDropzoneError.FileTypeInvalid;
}

export function getDropzoneErrorMessage(code: DropzoneRejectCode): string {
  return FILE_DROPZONE_ERROR_MESSAGE[mapDropzoneErrorCode(code)];
}
