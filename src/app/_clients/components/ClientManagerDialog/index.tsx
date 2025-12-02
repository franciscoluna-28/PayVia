"use client";

import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Plus, Trash2, Edit, UserIcon } from "lucide-react";
import { useState } from "react";
import useClientStore from "@/store/ClientStore";

const ClientForm = ({
  clientToEdit,
  onSave,
  onCancel,
}: {
  clientToEdit: Client | null;
  onSave: (client: Omit<Client, "id">, id?: string) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Omit<Client, "id"> | Client>(
    clientToEdit || { fullName: "", address: "", zip: "" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientToEdit) {
      onSave(formData as Client, clientToEdit.id);
    } else {
      onSave(formData as Omit<Client, "id">);
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Company/Full Name</FieldLabel>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </Field>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Field>
        <Field>
          <FieldLabel>Zip Code</FieldLabel>
          <Input
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
          />
        </Field>
      </FieldGroup>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {clientToEdit ? "Save Changes" : "Add Client"}
        </Button>
      </div>
    </form>
  );
};

export function ClientManagerDialog() {
  const { clients, addClient, removeClient, updateClient } = useClientStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleSave = (clientData: Omit<Client, "id">, id?: string) => {
    if (id) {
      updateClient(id, clientData);
    } else {
      addClient(clientData);
    }
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const startAdd = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const startEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <UserIcon size={16} /> Manage Clients
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Client Records ({clients.length})</DialogTitle>
        </DialogHeader>

        {!isFormOpen && (
          <div className="space-y-4">
            <Button onClick={startAdd} className="w-full gap-2">
              <Plus size={16} /> New Client
            </Button>

            <div className="h-[300px] overflow-y-auto border rounded-md">
              {clients.length === 0 ? (
                <p className="p-4 text-center text-gray-500">
                  No clients saved yet.
                </p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {clients.map((client) => (
                    <li
                      key={client.id}
                      className="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{client.fullName}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {client.address}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(client)}
                          aria-label="Edit client"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeClient(client.id)}
                          aria-label="Remove client"
                        >
                          <Trash2
                            size={16}
                            className="text-red-500 hover:text-red-600"
                          />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {isFormOpen && (
          <ClientForm
            clientToEdit={editingClient}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
