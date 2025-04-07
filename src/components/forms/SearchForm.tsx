import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  nif: z.string().optional(),
  centreGestionnaire: z.string().optional(),
  dateDebut: z.string().optional(),
  dateFin: z.string().optional(),
});

interface SearchFormProps {
  onSearch: (values: z.infer<typeof formSchema>) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nif: "",
      centreGestionnaire: "",
      dateDebut: "",
      dateFin: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSearch(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded-md border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="nif"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIF</FormLabel>
                <FormControl>
                  <Input placeholder="Numéro d'Identification Fiscale" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="centreGestionnaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Centre Gestionnaire</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les centres" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Tous les centres</SelectItem>
                    <SelectItem value="Direction des Grandes Entreprises">Direction des Grandes Entreprises</SelectItem>
                    <SelectItem value="CIME EST">CIME EST</SelectItem>
                    <SelectItem value="CIME OUEST">CIME OUEST</SelectItem>
                    <SelectItem value="CIME SUD">CIME SUD</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateDebut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date début</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateFin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date fin</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Rechercher</Button>
        </div>
      </form>
    </Form>
  );
}
