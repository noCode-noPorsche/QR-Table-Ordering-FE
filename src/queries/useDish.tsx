import dishApiRequest from "@/src/apiRequest/dish";
import { UpdateDishBodyType } from "@/src/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDishList = () => {
  return useQuery({
    queryKey: ["dishes-list"],
    queryFn: dishApiRequest.getDishList,
  });
};

export const useGetDish = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["dishes-detail", id],
    queryFn: () => dishApiRequest.getDish(id),
    enabled,
  });
};

export const useAddDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishApiRequest.addDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes-list"] });
    },
  });
};

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      dishApiRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes-list"] });
    },
  });
};

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishApiRequest.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes-list"] });
    },
  });
};
