import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

export default function AdminLoginMvp() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isRTL } = useLanguage();
  const adminLogin = trpc.admin.login.useMutation();
  const copy = isRTL
    ? {
        title: "لوحة الإدارة",
        description: "إدارة معرض ساعات الشيخ عمار",
        username: "اسم المستخدم",
        usernamePlaceholder: "أدخل اسم المستخدم",
        password: "كلمة المرور",
        passwordPlaceholder: "أدخل كلمة المرور",
        submit: "تسجيل الدخول",
        submitting: "جارٍ تسجيل الدخول...",
        missing: "يرجى إدخال اسم المستخدم وكلمة المرور.",
        invalid: "اسم المستخدم أو كلمة المرور غير صحيحين.",
        failure: "تعذر تسجيل الدخول. يرجى المحاولة مرة أخرى.",
        success: "تم تسجيل الدخول بنجاح.",
      }
    : {
        title: "Admin Dashboard",
        description: "Sheikh Ammar Horology Gallery Management",
        username: "Username",
        usernamePlaceholder: "Enter username",
        password: "Password",
        passwordPlaceholder: "Enter password",
        submit: "Login",
        submitting: "Logging in...",
        missing: "Enter both a username and password.",
        invalid: "The username or password is incorrect.",
        failure: "Unable to sign in. Please try again.",
        success: "Login successful.",
      };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error(copy.missing);
      return;
    }
    setIsLoading(true);

    try {
      await adminLogin.mutateAsync({ username: username.trim(), password });
      toast.success(copy.success);
      setLocation("/admin/dashboard-mvp");
    } catch {
      toast.error(copy.invalid);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md border-primary/30 bg-card shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="admin-username" className="text-sm font-medium">{copy.username}</label>
              <Input
                id="admin-username"
                type="text"
                placeholder={copy.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
                className="border-border focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium">{copy.password}</label>
              <Input
                id="admin-password"
                type="password"
                placeholder={copy.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                className="border-border focus-visible:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {copy.submitting}
                </>
              ) : (
                copy.submit
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
