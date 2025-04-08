import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileSearch, ArrowLeft, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import axios from "@/utils/axios-instance";

// Définition du schéma de validation avec Zod
const formSchema = z.object({
  nif: z.string().min(1, "Le NIF est requis"),
  raisonSociale: z.string().min(1, "La raison sociale est requise"),
  centreGestionnaire: z.string().min(1, "Le centre gestionnaire est requis"),
  documents: z.string().optional(),
  aJour: z.boolean().default(false),
  rejet: z.boolean().default(false),
  quantite: z.number().min(0, "La quantité doit être positive").default(0),
  dateDepot: z.date().optional().nullable(),
  dateArriveeImmat: z.date().optional().nullable(),
  dateLivraisonSG: z.date().optional().nullable(),
  dateRejet: z.date().optional().nullable(),
  motifRejet: z.string().optional(),
  observation: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditionDossier = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<FormValues | null>(null);

  // Initialiser le formulaire avec React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nif: "",
      raisonSociale: "",
      centreGestionnaire: "",
      documents: "",
      aJour: false,
      rejet: false,
      quantite: 0,
      dateDepot: null,
      dateArriveeImmat: null,
      dateLivraisonSG: null,
      dateRejet: null,
      motifRejet: "",
      observation: "",
    },
  });

  // Charger les données du contribuable
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`/api/contribuables/${id}`)
        .then((response) => {
          if (response.data.success) {
            const contribuable = response.data.data;

            // Convertir les dates de string à Date
            const formattedData = {
              ...contribuable,
              dateDepot: contribuable.dateDepot ? new Date(contribuable.dateDepot) : null,
              dateArriveeImmat: contribuable.dateArriveeImmat ? new Date(contribuable.dateArriveeImmat) : null,
              dateLivraisonSG: contribuable.dateLivraisonSG ? new Date(contribuable.dateLivraisonSG) : null,
              dateRejet: contribuable.dateRejet ? new Date(contribuable.dateRejet) : null,
              // Convertir les chaînes "Oui"/"Non" en booléens
              aJour: contribuable.aJour === "Oui" || contribuable.aJour === true,
              rejet: contribuable.rejet === "Oui" || contribuable.rejet === true,
              // Assurer que quantite est un nombre
              quantite: typeof contribuable.quantite === 'string'
                ? parseInt(contribuable.quantite, 10)
                : contribuable.quantite,
            };

            setInitialData(formattedData);
            form.reset(formattedData);
          } else {
            toast({
              title: "Erreur",
              description: "Impossible de charger les données du contribuable",
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          console.error("Erreur lors du chargement:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les données du contribuable",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, form]);

  // Gérer la soumission du formulaire
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // Préparer les données pour l'API
      const formattedData = {
        ...data,
        // Formater les dates pour l'API (YYYY-MM-DD)
        dateDepot: data.dateDepot ? format(data.dateDepot, 'yyyy-MM-dd') : undefined,
        dateArriveeImmat: data.dateArriveeImmat ? format(data.dateArriveeImmat, 'yyyy-MM-dd') : undefined,
        dateLivraisonSG: data.dateLivraisonSG ? format(data.dateLivraisonSG, 'yyyy-MM-dd') : undefined,
        dateRejet: data.dateRejet ? format(data.dateRejet, 'yyyy-MM-dd') : undefined,
      };

      // Appel API pour mettre à jour le contribuable
      const response = await axios.put(`/api/contribuables/${id}`, formattedData);

      if (response.data.success) {
        toast({
          title: "Succès",
          description: "Le dossier a été mis à jour avec succès",
        });

        // Redirection vers la page de consultation
        navigate("/consultation");
      } else {
        throw new Error(response.data.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);

      toast({
        title: "Échec de la mise à jour",
        description: error instanceof Error ? error.message : "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">
            {id ? "Modifier un dossier" : "Nouveau dossier"}
          </h1>
        </div>

        {id && (
          <Button
            variant="outline"
            onClick={() => navigate(`/consultation/${id}`)}
          >
            <FileSearch size={16} className="mr-2" />
            Voir les détails
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du contribuable</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !initialData ? (
            <div className="flex justify-center items-center h-64">
              <p>Chargement des données...</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NIF */}
                  <FormField
                    control={form.control}
                    name="nif"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIF</FormLabel>
                        <FormControl>
                          <Input placeholder="Numéro d'identification fiscale" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Raison Sociale */}
                  <FormField
                    control={form.control}
                    name="raisonSociale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Raison Sociale</FormLabel>
                        <FormControl>
                          <Input placeholder="Raison sociale" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Centre Gestionnaire */}
                  <FormField
                    control={form.control}
                    name="centreGestionnaire"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Centre Gestionnaire</FormLabel>
                        <FormControl>
                          <Input placeholder="Centre gestionnaire" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Documents */}
                  <FormField
                    control={form.control}
                    name="documents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Documents</FormLabel>
                        <FormControl>
                          <Input placeholder="Liste des documents" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantité */}
                  <FormField
                    control={form.control}
                    name="quantite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantité</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Quantité"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date de Dépôt */}
                  <FormField
                    control={form.control}
                    name="dateDepot"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de Dépôt</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Sélectionner une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date arrivée Immatriculation */}
                  <FormField
                    control={form.control}
                    name="dateArriveeImmat"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date arrivée Immatriculation</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Sélectionner une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date livraison */}
                  <FormField
                    control={form.control}
                    name="dateLivraisonSG"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date livraison</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Sélectionner une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date rejet */}
                  <FormField
                    control={form.control}
                    name="dateRejet"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de rejet</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Sélectionner une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* À jour */}
                  <FormField
                    control={form.control}
                    name="aJour"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>À jour</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Rejet */}
                  <FormField
                    control={form.control}
                    name="rejet"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Rejet</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Motif de rejet - affiché conditionnellement si rejet est true */}
                {form.watch("rejet") && (
                  <FormField
                    control={form.control}
                    name="motifRejet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motif de rejet</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Motif du rejet"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Observation */}
                <FormField
                  control={form.control}
                  name="observation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observation</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observations"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EditionDossier