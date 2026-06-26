import tableApiRequest from "@/apiRequest/table";
import { UpdateTableBodyType } from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTableList = () => {
  return useQuery({
    queryKey: ["tables-list"],
    queryFn: tableApiRequest.getTableList,
  });
};

export const useGetTable = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["tables-detail", id],
    queryFn: () => tableApiRequest.getTable(id),
    enabled,
  });
};

export const useAddTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableApiRequest.addTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables-list"] });
    },
  });
};

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) =>
      tableApiRequest.updateTable(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables-list"] });
    },
  });
};

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableApiRequest.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables-list"] });
    },
  });
};
