
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

const dossierFormSchema = z.object({
  nif: z.string().min(1, "Le NIF est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  centreGestionnaire: z.string().min(1, "Le centre gestionnaire est requis"),
  dateArrivee: z.date({ required_error: "La date d'arrivée est requise" }),
  dateLivraison: z.date().optional(),
  rejet: z.boolean().default(false),
  motifRejet: z.string().optional(),
  observation: z.string().optional(),
});

type DossierFormValues = z.infer<typeof dossierFormSchema>;

const centres = ["DGE", "CIME EST", "CIME OUEST", "CIME SUD", "CIME NORD"];

const motifsRejet = [
  "Documents incomplets",
  "Informations incorrectes",
  "Doublons",
  "Autre",
];

type DossierFormProps = {
  dossierId?: string;
  onSubmit: (data: DossierFormValues) => void;
  isLoading?: boolean;
};

export const DossierForm = ({
  dossierId,
  onSubmit,
  isLoading = false,
}: DossierFormProps) => {
  const [isLoadingContribuable, setIsLoadingContribuable] = useState(false);
  const [joursTrait, setJoursTrait] = useState(0);

  const form = useForm<DossierFormValues>({
    resolver: zodResolver(dossierFormSchema),
    defaultValues: {
      nif: "",
      nom: "",
      centreGestionnaire: "",
      rejet: false,
      motifRejet: "",
      observation: "",
    },
  });

  // Simuler la recherche du contribuable par NIF
  const handleNifChange = async (nif: string) => {
    if (nif.length < 3) return;
    
    setIsLoadingContribuable(true);
    
    // Simulation de la recherche (à remplacer par un appel API)
    setTimeout(() => {
      // Simulation d'un résultat trouvé
      if (nif.startsWith("123")) {
        form.setValue("nom", "SARL EXEMPLE");
        form.setValue("centreGestionnaire", "DGE");
      }
      
      setIsLoadingContribuable(false);
    }, 800);
  };

  // Calcul du nombre de jours de traitement
  useEffect(() => {
    const dateArrivee = form.watch("dateArrivee");
    const dateLivraison = form.watch("dateLivraison");
    
    if (dateArrivee && dateLivraison) {
      const jours = differenceInDays(dateLivraison, dateArrivee);
      setJoursTrait(jours >= 0 ? jours : 0);
    } else {
      setJoursTrait(0);
    }
  }, [form.watch("dateArrivee"), form.watch("dateLivraison")]);
  
  // Chargement des données d'un dossier existant
  useEffect(() => {
    if (dossierId) {
      // Simulation de chargement de données (à remplacer par un appel API)
      setTimeout(() => {
        const dossierMock = {
          nif: "12345678",
          nom: "SARL EXEMPLE",
          centreGestionnaire: "DGE",
          dateArrivee: new Date("2023-05-10"),
          dateLivraison: new Date("2023-05-15"),
          rejet: false,
          observation: "Dossier traité normalement",
        };
        
        // Remplir le formulaire avec les données
        form.reset(dossierMock);
      }, 500);
    }
  }, [dossierId]);

  const handleFormSubmit = (values: DossierFormValues) => {
    // Si rejet est faux, on s'assure que motifRejet est vide
    if (!values.rejet) {
      values.motifRejet = undefined;
    }
    
    onSubmit(values);
    
    // Simuler une réponse réussie
    toast.success("Dossier enregistré avec succès.");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Numéro d'Identification Fiscale (NIF) <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Saisir le NIF..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleNifChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isLoadingContribuable && (
                      <div className="absolute right-3 top-3">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Saisissez le NIF pour charger automatiquement les informations du contribuable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nom du contribuable <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du contribuable" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="centreGestionnaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Centre gestionnaire <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un centre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {centres.map((centre) => (
                        <SelectItem key={centre} value={centre}>
                          {centre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="dateArrivee"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Date d'arrivée à l'immatriculation <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          {field.value ? (
                            format(field.value, "dd MMMM yyyy", { locale: fr })
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() ||
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateLivraison"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de livraison au service gestionnaire</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          {field.value ? (
                            format(field.value, "dd MMMM yyyy", { locale: fr })
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() ||
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <p className="text-sm font-medium">Jours de traitement:</p>
              <p className="text-2xl font-bold text-blue-700">{joursTrait} jours</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
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
                  <FormLabel>Rejet du dossier</FormLabel>
                  <FormDescription>
                    Cocher cette case si le dossier a été rejeté.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {form.watch("rejet") && (
            <FormField
              control={form.control}
              name="motifRejet"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Motif de rejet</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un motif" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {motifsRejet.map((motif) => (
                        <SelectItem key={motif} value={motif}>
                          {motif}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Saisir vos observations ici..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
