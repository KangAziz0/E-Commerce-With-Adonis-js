import httpClient from "@/lib/httpClient";

export interface UpdateProfilePayload {
  name: string;
}

const profileService = {
  updateProfile: (data: UpdateProfilePayload) =>
    httpClient.put("/profile", data),

  uploadAvatar: (formData: FormData) =>
    httpClient.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default profileService;
