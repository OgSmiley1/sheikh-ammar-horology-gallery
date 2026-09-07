/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals and performance metrics
 */

export interface VitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  timestamp: number;
}

export interface PerformanceData {
  metrics: VitalMetric[];
  navigation: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
  };
  resources: {
    totalCount: number;
    totalSize: number;
    avgDuration: number;
  };
}

/**
 * Get Core Web Vitals thresholds
 */
const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 }, // First Input Delay
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  TTFB: { good: 600, poor: 1800 }, // Time to First Byte
};

/**
 * Rate a metric based on thresholds
 */
function rateMetric(
  name: string,
  value: number
): "good" | "needs-improvement" | "poor" {
  const threshold = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS];
  if (!threshold) return "needs-improvement";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

/**
 * Collect Web Vitals metrics
 */
export async function collectWebVitals(): Promise<PerformanceData> {
  const metrics: VitalMetric[] = [];

  // Get navigation timing
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  const navigationData = {
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
    loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
  };

  // Get paint entries
  const paintEntries = performance.getEntriesByType("paint");
  paintEntries.forEach((entry) => {
    if (entry.name === "first-paint") {
      navigationData.firstPaint = entry.startTime;
    } else if (entry.name === "first-contentful-paint") {
      navigationData.firstContentfulPaint = entry.startTime;
    }
  });

  // Add paint metrics
  if (navigationData.firstPaint > 0) {
    metrics.push({
      name: "FP",
      value: navigationData.firstPaint,
      rating: rateMetric("TTFB", navigationData.firstPaint),
      timestamp: Date.now(),
    });
  }

  if (navigationData.firstContentfulPaint > 0) {
    metrics.push({
      name: "FCP",
      value: navigationData.firstContentfulPaint,
      rating: rateMetric("TTFB", navigationData.firstContentfulPaint),
      timestamp: Date.now(),
    });
  }

  // Get Largest Contentful Paint
  const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
  if (lcpEntries.length > 0) {
    const lcp = lcpEntries[lcpEntries.length - 1] as PerformanceEntry & { renderTime?: number };
    const lcpValue = (lcp.renderTime || lcp.startTime) as number;
    metrics.push({
      name: "LCP",
      value: lcpValue,
      rating: rateMetric("LCP", lcpValue),
      timestamp: Date.now(),
    });
  }

  // Get Cumulative Layout Shift
  let cls = 0;
  const clsEntries = performance.getEntriesByType("layout-shift");
  clsEntries.forEach((entry) => {
    if (!(entry as any).hadRecentInput) {
      cls += (entry as any).value;
    }
  });
  if (cls > 0) {
    metrics.push({
      name: "CLS",
      value: cls,
      rating: rateMetric("CLS", cls),
      timestamp: Date.now(),
    });
  }

  // Get resource timing
  const resources = performance.getEntriesByType("resource");
  let totalSize = 0;
  let totalDuration = 0;

  resources.forEach((resource) => {
    totalDuration += resource.duration;
    if ("transferSize" in resource) {
      totalSize += (resource as any).transferSize || 0;
    }
  });

  const resourceData = {
    totalCount: resources.length,
    totalSize,
    avgDuration: resources.length > 0 ? totalDuration / resources.length : 0,
  };

  return {
    metrics,
    navigation: navigationData,
    resources: resourceData,
  };
}

/**
 * Track page view with performance metrics
 */
export async function trackPageView(pageName: string) {
  try {
    const vitals = await collectWebVitals();

    // Send to analytics endpoint
    const analyticsEndpoint = (window as any).__ANALYTICS_ENDPOINT__;
    const websiteId = (window as any).__ANALYTICS_WEBSITE_ID__;

    if (analyticsEndpoint && websiteId) {
      // Track custom event with vitals
      fetch(`${analyticsEndpoint}/api/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "event",
          payload: {
            website: websiteId,
            hostname: window.location.hostname,
            pathname: window.location.pathname,
            referrer: document.referrer,
            title: pageName,
            url: window.location.href,
            data: {
              vitals: vitals.metrics,
              navigation: vitals.navigation,
            },
          },
        }),
      }).catch(() => {
        // Silently fail
      });
    }

    // Store metrics in session storage for debugging
    try {
      sessionStorage.setItem(
        `vitals_${pageName}`,
        JSON.stringify(vitals)
      );
    } catch {
      // Silently fail
    }
  } catch (error) {
    // Silently fail
  }
}

/**
 * Performance observer for continuous monitoring
 */
export function setupPerformanceObserver() {
  if (!("PerformanceObserver" in window)) {
    return;
  }

  try {
    // Observe long tasks
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // Log tasks longer than 50ms
            try {
              const longTasks = JSON.parse(
                sessionStorage.getItem("long_tasks") || "[]"
              );
              longTasks.push({
                name: entry.name,
                duration: entry.duration,
                startTime: entry.startTime,
                timestamp: Date.now(),
              });
              if (longTasks.length > 50) longTasks.shift();
              sessionStorage.setItem("long_tasks", JSON.stringify(longTasks));
            } catch {
              // Silently fail
            }
          }
        }
      });

      try {
        observer.observe({ entryTypes: ["longtask"] });
      } catch {
        // Longtask not supported
      }
    }
  } catch {
    // Silently fail
  }
}

/**
 * Get performance summary
 */
export function getPerformanceSummary(): {
  good: number;
  needsImprovement: number;
  poor: number;
} {
  try {
    const errors = JSON.parse(
      sessionStorage.getItem("component_errors") || "[]"
    );
    const vitalsData = Object.entries(sessionStorage)
      .filter(([key]) => key.startsWith("vitals_"))
      .map(([, value]) => JSON.parse(value as string));

    let good = 0;
    let needsImprovement = 0;
    let poor = 0;

    vitalsData.forEach((data: PerformanceData) => {
      data.metrics.forEach((metric) => {
        if (metric.rating === "good") good++;
        else if (metric.rating === "needs-improvement")
          needsImprovement++;
        else poor++;
      });
    });

    return { good, needsImprovement, poor };
  } catch {
    return { good: 0, needsImprovement: 0, poor: 0 };
  }
}
