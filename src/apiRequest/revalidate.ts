import http from "@/src/lib/http";

const revalidateApiRequest = (tag: string) => {
  http.get(`/api/revalidate?tag=${tag}`, { baseURL: "" });
};

export default revalidateApiRequest;
