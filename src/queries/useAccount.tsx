import accountApiRequest from '@/apiRequest/account'
import {
  CreateGuestBodyType,
  GetGuestListQueryParamsType,
  UpdateEmployeeAccountBodyType
} from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAccountMe = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: accountApiRequest.me
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePasswordV2
  })
}

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ['accounts-list'],
    queryFn: accountApiRequest.getEmployeeList
  })
}

export const useGetAccount = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['accounts-detail', id],
    queryFn: () => accountApiRequest.getEmployee(id),
    enabled
  })
}

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts-list'] })
    }
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts-list'] })
    }
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts-list'] })
    }
  })
}

export const useGetGuestList = (queryParams: GetGuestListQueryParamsType) => {
  return useQuery({
    queryKey: ['guests-list', queryParams],
    queryFn: () => accountApiRequest.getGuestList(queryParams)
  })
}

export const useCreateGuestMutation = () => {
  return useMutation({
    mutationFn: (body: CreateGuestBodyType) => accountApiRequest.createGuest(body)
  })
}
