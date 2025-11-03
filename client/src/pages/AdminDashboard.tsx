import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Crown,
  LogOut,
  Eye,
  TrendingUp,
  Users,
  Watch,
  Plus,
  Edit,
  Image as ImageIcon,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [adminSession, setAdminSession] = useState<any>(null);

  // Check admin authentication
  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    if (!session) {
      toast.error("Please login to access admin panel");
      setLocation("/admin/login");
      return;
    }
    try {
      const parsed = JSON.parse(session);
      setAdminSession(parsed);
    } catch (error) {
      toast.error("Invalid session");
      setLocation("/admin/login");
    }
  }, []);

  // Fetch analytics data
  const { data: stats } = trpc.analytics.getStats.useQuery(undefined, {
    enabled: !!adminSession,
  });

  const { data: topWatches } = trpc.analytics.getTopWatches.useQuery(
    { limit: 10 },
    { enabled: !!adminSession }
  );

  const { data: recentViews } = trpc.analytics.getRecentPageViews.useQuery(
    { limit: 20 },
    { enabled: !!adminSession }
  );

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    toast.success("Logged out successfully");
    setLocation("/admin/login");
  };

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-500 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-black border-b border-gold-500/30 px-6 py-4">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Crown className="w-8 h-8 text-gold-500" />
              <div>
                <h1 className="text-2xl font-bold text-gold-500">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Sheikh Ammar Horology Gallery</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-300">Welcome back,</p>
              <p className="text-gold-500 font-medium">{adminSession.username}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-500/20 rounded-lg">
                  <Eye className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Views</p>
                  <p className="text-3xl font-bold text-gold-500">
                    {stats?.totalViews?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Unique Visitors</p>
                  <p className="text-3xl font-bold text-gold-500">
                    {stats?.uniqueVisitors?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-500/20 rounded-lg">
                  <Watch className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Watches</p>
                  <p className="text-3xl font-bold text-gold-500">
                    34+
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Collection Value</p>
                  <p className="text-2xl font-bold text-gold-500">
                    $10M+
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gold-500 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setLocation("/admin/watches/new")}
              className="bg-gold-500 hover:bg-gold-600 text-black font-bold py-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gold-500/50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Watch
            </Button>

            <Button
              onClick={() => setLocation("/admin/watches")}
              variant="outline"
              className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 py-6"
            >
              <Edit className="w-5 h-5 mr-2" />
              Manage Watches
            </Button>

            <Button
              onClick={() => setLocation("/admin/media")}
              variant="outline"
              className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 py-6"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Manage Media
            </Button>
          </div>
        </div>

        {/* Top Watches */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-gold-500" />
            <h2 className="text-2xl font-bold text-gold-500">Most Viewed Watches</h2>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/30 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gold-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Watch</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Brand</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-500/10">
                  {topWatches && topWatches.length > 0 ? (
                    topWatches.map((watch: any, index: number) => (
                      <tr key={watch.watchId} className="hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-gold-500/20 rounded-full">
                            <span className="text-gold-500 font-bold text-sm">{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-200 font-medium">{watch.watchName}</p>
                          <p className="text-gray-500 text-sm">{watch.referenceNumber}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-300">{watch.brandName}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Eye className="w-4 h-4 text-gold-500" />
                            <span className="text-gold-500 font-bold">{watch.viewCount}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No data available yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-gold-500 mb-4">Recent Page Views</h2>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/30 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gold-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Page</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Watch/Brand</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Session</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-500/10">
                  {recentViews && recentViews.length > 0 ? (
                    recentViews.map((view: any) => (
                      <tr key={view.id} className="hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-gray-400 text-sm">
                            {new Date(view.viewedAt).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-300">{view.pageType}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 text-sm">{view.pagePath}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-500 text-xs font-mono">
                            {view.sessionId?.substring(0, 8)}...
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No recent activity
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
