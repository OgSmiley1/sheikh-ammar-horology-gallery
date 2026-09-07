import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, LogOut, Eye, Users, Watch, Upload, LockKeyhole, Images, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import AdminWatchesMvp from "@/components/admin/AdminWatchesMvp";
import AdminSubscribersMvp from "@/components/admin/AdminSubscribersMvp";
import AdminCSVImport from "./AdminCSVImport";
import AdminGalleryManager from "@/components/admin/AdminGalleryManager";
import AdminCommentModeration from "@/components/admin/AdminCommentModeration";

export default function AdminDashboardMvp() {
  const [, setLocation] = useLocation();
  const { isRTL } = useLanguage();
  const copy = isRTL
    ? {
        title: "لوحة الإدارة",
        subtitle: "إدارة معرض ساعات الشيخ عمار",
        logout: "تسجيل الخروج",
        loggedOut: "تم تسجيل الخروج بنجاح.",
        logoutFailed: "تعذر إنهاء جلسة الإدارة. حاول مرة أخرى.",
        totalBrands: "إجمالي الدور",
        totalWatches: "إجمالي الساعات",
        subscribers: "المشتركون",
        tabs: "أقسام الإدارة",
        watches: "الساعات",
        bulkImport: "استيراد جماعي",
        gallery: "المعرض",
        manageWatches: "إدارة الساعات",
        newsletterSubscribers: "المشتركون في النشرة",
        bulkWatchImport: "استيراد الساعات بالجملة",
        manageGallery: "إدارة صور المعرض",
        comments: "الملاحظات",
        manageComments: "مراجعة ملاحظات الزوار",
      }
    : {
        title: "Admin Dashboard",
        subtitle: "Sheikh Ammar Horology Gallery Management",
        logout: "Logout",
        loggedOut: "Logged out successfully.",
        logoutFailed: "The administrator session could not be closed. Please try again.",
        totalBrands: "Total Brands",
        totalWatches: "Total Watches",
        subscribers: "Subscribers",
        tabs: "Management Tabs",
        watches: "Watches",
        bulkImport: "Bulk Import",
        gallery: "Gallery",
        manageWatches: "Manage Watches",
        newsletterSubscribers: "Newsletter Subscribers",
        bulkWatchImport: "Bulk Watch Import",
        manageGallery: "Gallery photo management",
        comments: "Comments",
        manageComments: "Review visitor notes",
      };

  const { data: stats, isLoading: statsLoading, error: statsError } = trpc.adminMvp.getDashboardStats.useQuery(
    undefined,
  );
  const adminLogout = trpc.admin.logout.useMutation();

  useEffect(() => {
    if (statsError?.data?.code === "UNAUTHORIZED") {
      setLocation("/admin/login-mvp");
    }
  }, [setLocation, statsError]);

  const handleLogout = async () => {
    try {
      await adminLogout.mutateAsync();
      toast.success(copy.loggedOut);
      setLocation("/admin/login-mvp");
    } catch {
      toast.error(copy.logoutFailed);
    }
  };

  if (statsLoading || statsError?.data?.code === "UNAUTHORIZED") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="sticky top-24 z-10 border-b-4 border-primary bg-card shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-4xl font-bold text-foreground">
              <LockKeyhole className="h-8 w-8" aria-hidden="true" />
              {copy.title}
            </h1>
            <p className="text-lg font-semibold text-muted-foreground">{copy.subtitle}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="flex h-auto items-center gap-2 px-6 py-3 text-base font-bold"
            disabled={adminLogout.isPending}
          >
            <LogOut className="h-5 w-5" />
            {copy.logout}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-primary/20 bg-card shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Eye className="h-6 w-6" />
                {copy.totalBrands}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="text-4xl font-bold text-primary">{stats?.totalBrands || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-card shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Watch className="h-6 w-6" />
                {copy.totalWatches}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="text-4xl font-bold text-primary">{stats?.totalWatches || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-card shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Users className="h-6 w-6" />
                {copy.subscribers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="text-4xl font-bold text-primary">
                  {stats?.totalSubscribers || 0}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* LARGE VISIBLE TABS */}
        <Card className="border-4 border-primary/30 bg-card shadow-xl">
          <CardHeader className="border-b-4 border-primary/30 bg-muted/50">
            <CardTitle className="text-3xl font-bold text-foreground">{copy.tabs}</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <Tabs defaultValue="watches" className="space-y-6 w-full">
              {/* TAB LIST - LARGE AND VISIBLE */}
              <TabsList className="grid h-auto grid-cols-1 gap-4 rounded-xl border-4 border-primary/30 bg-muted p-4 sm:grid-cols-2 xl:grid-cols-5">
                <TabsTrigger 
                  value="watches" 
                  className="rounded-lg border-2 border-primary/30 px-6 py-4 text-lg font-bold text-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:text-2xl"
                >
                  <Watch className={isRTL ? "ml-3 h-6 w-6" : "mr-3 h-6 w-6"} />
                  {copy.watches}
                </TabsTrigger>
                <TabsTrigger 
                  value="subscribers" 
                  className="rounded-lg border-2 border-primary/30 px-6 py-4 text-lg font-bold text-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:text-2xl"
                >
                  <Users className={isRTL ? "ml-3 h-6 w-6" : "mr-3 h-6 w-6"} />
                  {copy.subscribers}
                </TabsTrigger>
                <TabsTrigger 
                  value="csv-import" 
                  className="rounded-lg border-2 border-primary/30 px-6 py-4 text-lg font-bold text-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:text-2xl"
                >
                  <Upload className={isRTL ? "ml-3 h-6 w-6" : "mr-3 h-6 w-6"} />
                  {copy.bulkImport}
                </TabsTrigger>
                <TabsTrigger 
                  value="gallery" 
                  className="rounded-lg border-2 border-primary/30 px-6 py-4 text-lg font-bold text-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:text-2xl"
                >
                  <Images className={isRTL ? "ml-3 h-6 w-6" : "mr-3 h-6 w-6"} />
                  {copy.gallery}
                </TabsTrigger>
                <TabsTrigger 
                  value="comments" 
                  className="rounded-lg border-2 border-primary/30 px-6 py-4 text-lg font-bold text-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:text-2xl"
                >
                  <MessageSquare className={isRTL ? "ml-3 h-6 w-6" : "mr-3 h-6 w-6"} />
                  {copy.comments}
                </TabsTrigger>
              </TabsList>

              {/* TAB CONTENTS */}
              <TabsContent value="watches" className="mt-8">
                <div className="rounded-lg border-2 border-primary/20 bg-card p-6">
                  <h3 className="mb-6 text-2xl font-bold text-foreground">{copy.manageWatches}</h3>
                  <AdminWatchesMvp />
                </div>
              </TabsContent>

              <TabsContent value="subscribers" className="mt-8">
                <div className="rounded-lg border-2 border-primary/20 bg-card p-6">
                  <h3 className="mb-6 text-2xl font-bold text-foreground">{copy.newsletterSubscribers}</h3>
                  <AdminSubscribersMvp />
                </div>
              </TabsContent>

              <TabsContent value="csv-import" className="mt-8">
                <div className="rounded-lg border-2 border-primary/20 bg-card p-6">
                  <h3 className="mb-6 text-2xl font-bold text-foreground">{copy.bulkWatchImport}</h3>
                  <AdminCSVImport />
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-8">
                <div className="rounded-lg border-2 border-primary/20 bg-card p-6">
                  <h3 className="mb-6 text-2xl font-bold text-foreground">{copy.manageGallery}</h3>
                  <AdminGalleryManager />
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-8">
                <div className="rounded-lg border-2 border-primary/20 bg-card p-6">
                  <h3 className="mb-6 text-2xl font-bold text-foreground">{copy.manageComments}</h3>
                  <AdminCommentModeration />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
