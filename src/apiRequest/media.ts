import http from "@/src/lib/http";
import { UploadImageResType } from "@/src/schemaValidations/media.schema";

export const mediaApiRequest = {
  upload: (formData: FormData) =>
    http.post<UploadImageResType>("/media/upload", formData),
};
