export interface GeneratedTestCase {
  testName: string
  category: string
  percentage: number
  duration: string
  error: string
  author: string
  retryCount: string
}

export interface GeneratedRun {
  testRunId: string
  date: string
  branch: string
  testCases: GeneratedTestCase[]
}

export function generateTestData(numRuns: number, numTests: number, seed = 42): GeneratedRun[] {
  let state = seed >>> 0
  function rnd() {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 0xffffffff
  }
  const categoriesLocal = ["unknown", "bug", "ui-change", "flaky"]
  const branchesLocal = ["devA", "devB", "devC", "staging", "prod"]
  const authors = ["john.doe", "jane.smith", "mike.wilson", "sarah.jones", "amy.lee", "bob.kim"]
  const errors = [
    "Timeout waiting for element",
    "Assertion failed",
    "Network timeout",
    "Database error",
    "Unknown error occurred",
    "Layout changed",
  ]

  const testCaseNames: string[] = [
    "LoginTest.validateCredentials",
    "DashboardTest.renderWidgets",
    "UserProfileTest.updateAvatar",
    "CheckoutTest.processPayment",
    "SearchTest.filterResults",
    "OrdersTest.createOrder",
    "NotificationTest.sendEmail",
    "SettingsTest.savePreferences",
    "BillingTest.applyCoupon",
    "AuthTest.refreshToken",
    "ReportTest.exportCsv",
    "ImportTest.bulkUsers",
    "PaymentTest.refund",
    "ShippingTest.calculateRate",
    "CatalogTest.addProduct",
    "CartTest.updateQuantity",
    "ReviewTest.submit",
    "ProfileTest.changePassword",
    "AnalyticsTest.trackEvent",
    "FeatureFlagTest.toggle",
    "PermissionsTest.roleMatrix",
    "ABTest.variantAllocation",
    "LocalizationTest.translate",
    "AccessibilityTest.focusTrap",
    "FileUploadTest.largeFile",
  ].slice(0, numTests)

  const lastCategory: Record<string, string> = {}

  function formatDate(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const start = new Date(2025, 0, 1)
  const result: GeneratedRun[] = []
  for (let i = 1; i <= numRuns; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + Math.floor((i - 1) / 3))
    const run: GeneratedRun = {
      testRunId: `T${i}`,
      date: formatDate(date),
      branch: branchesLocal[i % branchesLocal.length],
      testCases: [],
    }

    testCaseNames.forEach((name) => {
      const appears = rnd() < 0.7
      if (!appears) return

      const prev = lastCategory[name] ?? categoriesLocal[Math.floor(rnd() * categoriesLocal.length)]
      const stay = rnd() < 0.7
      const cat = stay ? prev : categoriesLocal[Math.floor(rnd() * categoriesLocal.length)]
      lastCategory[name] = cat

      const percentage = Math.floor(10 + rnd() * 80)
      const duration = `${(5 + rnd() * 45).toFixed(1)}s`
      const error = errors[Math.floor(rnd() * errors.length)]
      const author = authors[Math.floor(rnd() * authors.length)]
      const retriesUsed = Math.floor(rnd() * 4)
      const retryCount = `${retriesUsed}/3`

      run.testCases.push({
        testName: name,
        category: cat,
        percentage,
        duration,
        error,
        author,
        retryCount,
      })
    })

    result.push(run)
  }
  return result
}


