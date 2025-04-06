import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ContribuablesService } from "@/services/contribuables.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, FileSpreadsheet, FileWarning, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];

const importFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Le fichier est trop volumineux. Taille maximale: 10MB.")
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), "Format de fichier non supporté. Utilisez .xlsx ou .xls."),
});

type ImportFormValues = z.infer<typeof importFormSchema>;
// Définir un type pour les données d'aperçu Excel
type ExcelPreviewData = (string | number | null | undefined)[][];

const ImportExcel = () => {
  const [preview, setPreview] = useState<ExcelPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ importedCount: number; totalCount: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      file: undefined,
    },
    mode: "onChange",
  });

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    try {
      // Vérifier le type de fichier
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setError("Format de fichier non supporté. Utilisez .xlsx ou .xls.");
        return;
      }

      // Vérifier la taille du fichier
      if (file.size > MAX_FILE_SIZE) {
        setError("Le fichier est trop volumineux. Taille maximale: 10MB.");
        return;
      }

      setError(null);

      // Générer l'aperçu du fichier Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as ExcelPreviewData;
          // Limiter à 10 premières lignes pour l'aperçu
          setPreview(jsonData.slice(0, 10));
        } catch (error) {
          console.error("Erreur lors de la lecture du fichier Excel:", error);
          setError("Impossible de lire le fichier Excel. Vérifiez le format du fichier.");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Erreur lors du traitement du fichier:", error);
      setError("Une erreur s'est produite lors du traitement du fichier.");
    }
  };

  const onSubmit = async (data: ImportFormValues) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setImportResult(null);

    try {
      // Appel du service d'importation
      console.log("Submitting file:", data.file.name);
      const response = await ContribuablesService.importFile(data.file);

      setIsSuccess(true);
      setImportResult({
        importedCount: response.importedCount,
        totalCount: response.totalCount,
      });

      toast.success("Importation réussie!", {
        description: response.message,
      });

      // Réinitialiser le formulaire après un succès
      resetForm();
    } catch (error: unknown) {
      console.error("Erreur lors de l'importation:", error);

      // Typage plus sûr pour l'erreur
      let errorMessage = "Une erreur s'est produite lors de l'importation du fichier.";
      let errorDetails = "";

      if (error && typeof error === "object") {
        if ("message" in error) {
          errorMessage = (error as { message: string }).message;
        }

        if ("response" in error) {
          const responseError = error as { response?: { data?: { message?: string; error?: string }; status?: number } };
          if (responseError.response?.data?.message) {
            errorMessage = responseError.response.data.message;
          } else if (responseError.response?.data?.error) {
            errorMessage = responseError.response.data.error;
          }

          errorDetails = `Status: ${responseError.response?.status || "Unknown"}`;
        }
      }

      console.error("Error message:", errorMessage);
      console.error("Error details:", errorDetails);

      setError(`${errorMessage}${errorDetails ? ` (${errorDetails})` : ""}`);

      toast.error("Échec de l'importation", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setPreview(null);
    // Réinitialiser le champ de fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Obtenir la valeur actuelle du fichier
  const currentFile = form.watch("file");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Importation Excel</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fichier Excel</FormLabel>
                    <FormControl>
                      <div
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {currentFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileSpreadsheet className="h-10 w-10 text-primary" />

                            <div className="font-medium">{currentFile.name}</div>
                            <div className="text-sm text-muted-foreground">{(currentFile.size / 1024 / 1024).toFixed(2)} MB</div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                resetForm();
                              }}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Supprimer
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <UploadCloud className="h-10 w-10 text-muted-foreground" />

                            <div className="font-medium">Cliquez ou déposez le fichier ici</div>
                            <div className="text-sm text-muted-foreground">XLSX, XLS (Max 10MB)</div>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".xlsx,.xls"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            field.onChange(file);
                            handleFileChange(file);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSuccess && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Succès</AlertTitle>
                  <AlertDescription>
                    {importResult
                      ? `Import réussi : ${importResult.importedCount}/${importResult.totalCount} enregistrements effectués.`
                      : "Le fichier a été importé avec succès."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading || !currentFile}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading || !currentFile}>
                  {isLoading ? "Importation en cours..." : "Importer le fichier"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Aperçu du fichier */}
      {preview && preview.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Aperçu du fichier</h2>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    {preview[0]?.map((header, index) => (
                      <th key={index}>{String(header || `Colonne ${index + 1}`)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row?.map((cell, cellIndex) => (
                        <td key={cellIndex}>{String(cell || "-")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-sm text-muted-foreground mt-4">* Affichage limité aux 10 premières lignes</div>
          </CardContent>
        </Card>
      )}

      {/* Guide d'utilisation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 text-primary rounded-md">
              <FileWarning size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Format de fichier attendu</h2>
              <p className="text-muted-foreground mb-4">
                Le fichier Excel doit contenir les colonnes suivantes dans cet ordre précis :
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>NIF (Numéro d'Identification Fiscale)</li>
                <li>Nom du contribuable</li>
                <li>Centre gestionnaire</li>
                <li>Date d'arrivée (format JJ/MM/AAAA)</li>
                <li>Date de livraison (optionnel, format JJ/MM/AAAA)</li>
                <li>Observation (optionnel)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportExcel;
