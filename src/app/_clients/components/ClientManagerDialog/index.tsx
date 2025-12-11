"use client"

import type React from "react"

import type { Client } from "@/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Plus, Trash2, Edit, Users } from "lucide-react"
import { useState } from "react"
import useClientStore from "@/store/ClientStore"

const ClientForm = ({
  clientToEdit,
  onSave,
  onCancel,
}: {
  clientToEdit: Client | null
  onSave: (client: Omit<Client, "id">, id?: string) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<Omit<Client, "id"> | Client>(
    clientToEdit || { fullName: "", address: "", zip: "" },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (clientToEdit) {
      onSave(formData as Client, clientToEdit.id)
    } else {
      onSave(formData as Omit<Client, "id">)
    }
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Company/Full Name</FieldLabel>
          <Input name="fullName" value={formData.fullName} onChange={handleChange} required />
        </Field>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Input name="address" value={formData.address} onChange={handleChange} required />
        </Field>
        <Field>
          <FieldLabel>Zip Code</FieldLabel>
          <Input name="zip" value={formData.zip} onChange={handleChange} required />
        </Field>
      </FieldGroup>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{clientToEdit ? "Save Changes" : "Add Client"}</Button>
      </div>
    </form>
  )
}

export function ClientManagerDialog() {
  const { clients, addClient, removeClient, updateClient } = useClientStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const handleSave = (clientData: Omit<Client, "id">, id?: string) => {
    if (id) {
      updateClient(id, clientData)
    } else {
      addClient(clientData)
    }
    setIsFormOpen(false)
    setEditingClient(null)
  }

  const startAdd = () => {
    setEditingClient(null)
    setIsFormOpen(true)
  }

  const startEdit = (client: Client) => {
    setEditingClient(client)
    setIsFormOpen(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="invisible" className="gap-2 bg-transparent">
          <Users size={16} /> Manage Clients
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Client Records</DialogTitle>
        </DialogHeader>

        {!isFormOpen && (
          <div className="space-y-4">
            <Button variant="outline" onClick={startAdd} className="w-full gap-2">
              <Plus size={16} /> New Client
            </Button>

            <div className="space-y-2">
              {clients.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    No clients saved yet. Create your first client to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {clients.map((client) => (
                    <Item
                      key={client.id}
                      variant="outline"
                      className="hover:bg-accent transition-colors cursor-default"
                    >
                       <ItemMedia>
                          <img className="w-12 h-12 object-cover rounded-full" src={"https://media.vandalsports.com/i/640x360/10-2025/2025101595917_1.jpg"} alt="placeholder" />
                        </ItemMedia>
                      <ItemContent>
                       
                        <ItemTitle className="text-sm font-semibold">{client.fullName}</ItemTitle>
                        
                        <ItemDescription className="text-xs">
                          {client.address} • {client.zip}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button size="sm" variant="ghost" onClick={() => startEdit(client)} aria-label="Edit client">
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeClient(client.id)}
                          aria-label="Remove client"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </ItemActions>
                    </Item>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {isFormOpen && (
          <ClientForm clientToEdit={editingClient} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
