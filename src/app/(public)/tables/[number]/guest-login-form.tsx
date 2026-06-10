"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/src/schemaValidations/guest.schema";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useGuestLoginMutation } from "@/src/queries/useGuest";
import { useAppStore } from "@/src/components/app-provider";
import { generateSocketInstance, handleErrorApi } from "@/src/lib/utils";

export default function GuestLoginForm() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const guestLoginMutation = useGuestLoginMutation();
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);

  const tableNumber = Number(params.number);
  const token = searchParams.get("token");

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      token: token ?? "",
      tableNumber,
    },
  });

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  const onSubmit = async (values: GuestLoginBodyType) => {
    if (guestLoginMutation.isPending) return;
    try {
      const result = await guestLoginMutation.mutateAsync(values);
      setRole(result.payload.data.guest.role);
      setSocket(generateSocketInstance(result.payload.data.accessToken));
      router.push("/guest/menu");
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-150 shrink-0 w-full"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
            noValidate
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Tên khách hàng</Label>
                      <Input id="name" type="text" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
