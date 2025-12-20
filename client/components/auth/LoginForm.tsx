"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useUserStore } from "@/stores";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/utils";

// const loginSchema = z.object({
//   username: z
//     .string()
//     .min(3, "שם המשתמש חייב להכיל לפחות 3 תווים")
//     .max(20, "שם המשתמש לא יכול להיות ארוך מ-20 תווים")
//     .regex(/^[a-zA-Z0-9_]+$/, "רק אותיות, מספרים וקו תחתון"),
//   password: z.string().min(6, "הסיסמה חייבת להיות לפחות 6 תווים"),
// });

const loginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "רק אותיות, מספרים וקו תחתון"),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const login = useUserStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const toastId = toast.loading("מתחבר...");

    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("שם משתמש או סיסמה שגויים", { id: toastId });
        setIsLoading(false);
        return;
      }

      const session = await getSession();
      if (session?.user) {
        login({
          id: session.user.id,
          first_name: session.user.first_name as string,
          last_name: session.user.last_name as string,
          username: session.user.username as string,
          email: session.user.email as string,
          role: (session.user.role as "user" | "admin") || null,
        });
      }

      toast.success("התחברת בהצלחה!", { id: toastId });
      router.refresh();
    } catch (error: any) {
      console.log(getErrorMessage(error));
      toast.error(error.message || "שגיאה בהתחברות", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username">שם משתמש</Label>
        <Input id="username" type="text" placeholder="הזן שם משתמש" autoComplete="username" disabled={isLoading} {...register("username")} />
        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">סיסמה</Label>
        </div>
        <Input id="password" type="password" placeholder="הזן סיסמה" autoComplete="current-password" disabled={isLoading} {...register("password")} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "מתחבר..." : "התחברות"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        אין לך חשבון?{" "}
        <button type="button" className="text-primary font-medium hover:underline">
          צור משתמש
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
