import { apiRequest } from "@/utils/apiRequest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


//  GET data hook
export const useFetchData = (key, endpoint, params = {}, options = {}) => {
  return useQuery({
    queryKey: [key, params],
    queryFn: () => apiRequest(endpoint, "GET", {}, params),
    enabled: options.enabled !== undefined ? options.enabled : true, 
    ...options, 
  });
};


//  POST data hook
export const usePostData = (endpoint, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => apiRequest(endpoint, "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries(); // Refresh data
      options?.onSuccess && options.onSuccess();
    },
    onError: options?.onError,
  });
};

//  PUT / PATCH data hook
export const useUpdateData = (endpoint, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`${endpoint}/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries();
      options?.onSuccess && options.onSuccess();
    },
    onError: options?.onError,
  });
};

//  DELETE hook
export const useDeleteData = (endpoint, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => apiRequest(`${endpoint}/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries();
      options?.onSuccess && options.onSuccess();
    },
    onError: options?.onError,
  });
};
