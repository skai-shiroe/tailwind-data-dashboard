
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
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
import { CalendarIcon, Search as SearchIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const searchFormSchema = z.object({
  dateType: z.string().optional(),
  dateDebut: z.date().optional(),
  dateFin: z.date().optional(),
  nif: z.string().optional(),
  centreGestionnaire: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const centres = [
  "Tous les centres",
  "DGE",
  "CIME EST",
  "CIME OUEST",
  "CIME SUD",
  "CIME NORD",
];

type SearchFormProps = {
  onSearch: (data: SearchFormValues) => void;
};

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      dateType: "arrivee",
      centreGestionnaire: "Tous les centres",
      nif: "",
    },
  });

  const handleSubmit = (values: SearchFormValues) => {
    onSearch(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 bg-white p-6 rounded-lg border"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="nif"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro d'Identification Fiscale (NIF)</FormLabel>
                <FormControl>
                  <Input placeholder="Rechercher par NIF..." {...field} />
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
                <FormLabel>Centre Gestionnaire</FormLabel>
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

          <FormField
            control={form.control}
            name="dateType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de date</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="arrivee">Date d'arrivée</SelectItem>
                    <SelectItem value="livraison">Date de livraison</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isAdvancedOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dateDebut"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de début</FormLabel>
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
              name="dateFin"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de fin</FormLabel>
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
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          >
            {isAdvancedOpen ? "Masquer les filtres avancés" : "Afficher les filtres avancés"}
          </Button>
          
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => form.reset()}
            >
              Réinitialiser
            </Button>
            <Button type="submit">
              <SearchIcon size={16} className="mr-2" /> Rechercher
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
