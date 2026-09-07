import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Download, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { parseCSV, csvRowsToWatches, generateCSVTemplate, WatchImportData } from "@/lib/csv-parser";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminCSVImport() {
  const { isRTL } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<WatchImportData[]>([]);
  const [errors, setErrors] = useState<Array<{ row: number; error: string }>>([]);
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "complete">("upload");
  const [importResults, setImportResults] = useState<{
    imported: number;
    failed: number;
    errors: Array<{ index: number; error: string }>;
  } | null>(null);
  const copy = isRTL
    ? {
        title: "استيراد الساعات بالجملة",
        download: "تنزيل النموذج",
        templateDownloaded: "تم تنزيل النموذج.",
        uploadStep: "الخطوة 1: رفع ملف CSV",
        selectFile: "اختر ملف CSV",
        dropFile: "اسحب ملف CSV وأفلته هنا، أو انقر للاختيار",
        columns: "ملف CSV يحتوي الأعمدة: العلامة، الطراز، الرقم المرجعي، سنة الاقتناء، سعر التجزئة، القيمة السوقية، الحالة، الوصف بالإنجليزية، الوصف بالعربية",
        previewStep: "الخطوة 2: معاينة البيانات",
        validWatches: "الساعات الصالحة",
        errors: "الأخطاء",
        totalRows: "إجمالي الصفوف",
        validWatchesWithCount: (count: number) => `الساعات الصالحة (${count})`,
        reference: "المرجع",
        moreWatches: (count: number) => `... و${count} ساعة أخرى`,
        errorsWithCount: (count: number) => `الأخطاء (${count})`,
        row: "الصف",
        moreErrors: (count: number) => `... و${count} أخطاء أخرى`,
        back: "رجوع",
        importWatches: (count: number) => `استيراد ${count} ساعة`,
        importing: "جارٍ استيراد الساعات...",
        doNotClose: "يرجى عدم إغلاق هذه الصفحة.",
        complete: "اكتمل الاستيراد",
        successfullyImported: "تم الاستيراد بنجاح",
        failed: "فشل",
        failedImports: "عمليات الاستيراد الفاشلة",
        item: "العنصر",
        importMore: "استيراد ساعات أخرى",
        selectCsv: "يرجى اختيار ملف CSV.",
        parseFailed: "تعذر تحليل ملف CSV.",
        noValidWatches: "لا توجد ساعات صالحة للاستيراد.",
        foundErrors: (count: number) => `تم العثور على ${count} أخطاء في CSV.`,
        ready: (count: number) => `الملف جاهز لاستيراد ${count} ساعة.`,
        imported: (count: number) => `تم استيراد ${count} ساعة بنجاح.`,
        importedWithErrors: (count: number, errors: number) => `تم استيراد ${count} ساعة مع ${errors} أخطاء.`,
        importFailed: (message: string) => `فشل الاستيراد: ${message}`,
      }
    : {
        title: "Bulk Watch Import",
        download: "Download Template",
        templateDownloaded: "Template downloaded.",
        uploadStep: "Step 1: Upload CSV File",
        selectFile: "Select CSV File",
        dropFile: "Drag and drop your CSV file here, or click to select",
        columns: "CSV file with columns: Brand, Model, ReferenceNumber, YearAcquired, RetailPrice, MarketValue, Condition, DescriptionEn, DescriptionAr",
        previewStep: "Step 2: Preview Data",
        validWatches: "Valid Watches",
        errors: "Errors",
        totalRows: "Total Rows",
        validWatchesWithCount: (count: number) => `Valid Watches (${count})`,
        reference: "Ref",
        moreWatches: (count: number) => `... and ${count} more watches`,
        errorsWithCount: (count: number) => `Errors (${count})`,
        row: "Row",
        moreErrors: (count: number) => `... and ${count} more errors`,
        back: "Back",
        importWatches: (count: number) => `Import ${count} Watches`,
        importing: "Importing watches...",
        doNotClose: "Please don't close this page.",
        complete: "Import Complete",
        successfullyImported: "Successfully Imported",
        failed: "Failed",
        failedImports: "Failed Imports",
        item: "Item",
        importMore: "Import More Watches",
        selectCsv: "Please select a CSV file.",
        parseFailed: "Failed to parse CSV file.",
        noValidWatches: "No valid watches to import.",
        foundErrors: (count: number) => `Found ${count} errors in CSV.`,
        ready: (count: number) => `Ready to import ${count} watches.`,
        imported: (count: number) => `Successfully imported ${count} watches.`,
        importedWithErrors: (count: number, errors: number) => `Imported ${count} watches with ${errors} errors.`,
        importFailed: (message: string) => `Import failed: ${message}`,
      };

  const importMutation = trpc.csvImport.importWatches.useMutation({
    onSuccess: (result) => {
      setImportResults(result);
      setStep("complete");
      if (result.failed === 0) {
        toast.success(copy.imported(result.imported));
      } else {
        toast.warning(copy.importedWithErrors(result.imported, result.failed));
      }
    },
    onError: (error) => {
      toast.error(copy.importFailed(error.message));
      setStep("preview");
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast.error(copy.selectCsv);
      return;
    }

    setFile(selectedFile);

    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text);
      const { data, errors: parseErrors } = csvRowsToWatches(rows);

      setPreviewData(data);
      setErrors(parseErrors as any);
      setStep("preview");

      if (parseErrors.length > 0) {
        toast.warning(copy.foundErrors(parseErrors.length));
      } else {
        toast.success(copy.ready(data.length));
      }
    } catch (error) {
      toast.error(copy.parseFailed);
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      toast.error(copy.noValidWatches);
      return;
    }

    setStep("importing");
    await importMutation.mutateAsync({
      watches: previewData,
    });
  };

  const downloadTemplate = () => {
    const csv = generateCSVTemplate();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "watch-import-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(copy.templateDownloaded);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">{copy.title}</h2>
        <Button variant="outline" onClick={downloadTemplate} className="border-primary/30">
          <Download className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
          {copy.download}
        </Button>
      </div>

      {/* Upload Step */}
      {step === "upload" && (
        <Card className="border-primary/20 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">{copy.uploadStep}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-primary/30 p-8 text-center transition hover:border-primary">
              <Upload className="mx-auto mb-4 h-12 w-12 text-primary" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {copy.dropFile}
                </p>
                <p className="text-xs text-muted-foreground">
                  {copy.columns}
                </p>
              </div>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Button variant="default" className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  {copy.selectFile}
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Step */}
      {step === "preview" && (
        <div className="space-y-4">
          <Card className="border-primary/20 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">{copy.previewStep}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="status-success-surface rounded-lg border p-4">
                  <div className="status-success-emphasis text-2xl font-bold">{previewData.length}</div>
                  <div className="status-success-text text-sm">{copy.validWatches}</div>
                </div>
                <div className="status-danger-surface rounded-lg border p-4">
                  <div className="status-danger-emphasis text-2xl font-bold">{errors.length}</div>
                  <div className="status-danger-text text-sm">{copy.errors}</div>
                </div>
                <div className="status-info-surface rounded-lg border p-4">
                  <div className="status-info-emphasis text-2xl font-bold">{previewData.length + errors.length}</div>
                  <div className="status-info-text text-sm">{copy.totalRows}</div>
                </div>
              </div>

              {/* Valid Watches Preview */}
              {previewData.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-foreground">{copy.validWatchesWithCount(previewData.length)}</h3>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {previewData.slice(0, 10).map((watch, idx) => (
                      <div key={idx} className="status-success-surface rounded border p-3 text-sm">
                        <div className="status-success-emphasis font-medium">
                          {watch.brand} - {watch.model}
                        </div>
                        <div className="status-success-text text-xs">
                          {copy.reference}: {watch.referenceNumber} | ${watch.marketValue.toLocaleString()}
                        </div>
                      </div>
                    ))}
                    {previewData.length > 10 && (
                      <div className="p-3 text-center text-sm text-primary">
                        {copy.moreWatches(previewData.length - 10)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Errors */}
              {errors.length > 0 && (
                <div>
                  <h3 className="status-danger-emphasis mb-3 flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4" />
                    {copy.errorsWithCount(errors.length)}
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {errors.slice(0, 10).map((error, idx) => (
                      <div key={idx} className="status-danger-surface rounded border p-3 text-sm">
                        <div className="status-danger-emphasis font-medium">{copy.row} {error.row}</div>
                        <div className="status-danger-text text-xs">{error.error}</div>
                      </div>
                    ))}
                    {errors.length > 10 && (
                      <div className="status-danger-text p-3 text-center text-sm">
                        {copy.moreErrors(errors.length - 10)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setStep("upload");
                setFile(null);
                setPreviewData([]);
                setErrors([]);
              }}
              className="border-primary/30"
            >
              {copy.back}
            </Button>
            <Button
              onClick={handleImport}
              disabled={previewData.length === 0 || importMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {importMutation.isPending && <Loader2 className={isRTL ? "ml-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4 animate-spin"} />}
              {copy.importWatches(previewData.length)}
            </Button>
          </div>
        </div>
      )}

      {/* Importing Step */}
      {step === "importing" && (
        <Card className="border-primary/20 bg-card">
          <CardContent className="pt-6 text-center space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="font-medium text-foreground">{copy.importing}</p>
            <p className="text-sm text-muted-foreground">{copy.doNotClose}</p>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {step === "complete" && importResults && (
        <Card className="status-success-surface border">
          <CardHeader>
            <CardTitle className="status-success-emphasis flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              {copy.complete}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="status-success-surface rounded-lg border p-4">
                <div className="status-success-emphasis text-3xl font-bold">{importResults.imported}</div>
                <div className="status-success-text text-sm">{copy.successfullyImported}</div>
              </div>
              <div className="status-danger-surface rounded-lg border p-4">
                <div className="status-danger-emphasis text-3xl font-bold">{importResults.failed}</div>
                <div className="status-danger-text text-sm">{copy.failed}</div>
              </div>
            </div>

            {importResults.errors.length > 0 && (
              <div>
                <h3 className="status-danger-emphasis mb-3 font-semibold">{copy.failedImports}</h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {importResults.errors.map((error, idx) => (
                    <div key={idx} className="status-danger-surface rounded border p-3 text-sm">
                      <div className="status-danger-emphasis font-medium">{copy.item} {error.index + 1}</div>
                      <div className="status-danger-text text-xs">{error.error}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                setStep("upload");
                setFile(null);
                setPreviewData([]);
                setErrors([]);
                setImportResults(null);
              }}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {copy.importMore}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
