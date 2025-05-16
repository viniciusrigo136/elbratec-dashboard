
"use client"

import React, { useEffect, useState } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Training {
  id: number
  title: string
  description: string
  category: string
  type: string
  duration: string
  instructor: string
  videoUrl?: string
  documents: string[]
  thumbnail?: string
  completionRate?: number
}


import { useToast } from "@/components/ui/use-toast"


import { useToast } from "@/components/ui/use-toast"

export function TrainingCenter() {
  const { toast } = useToast()

  const handleDeleteTraining = (id: number) => {
    fetch("/api/delete-training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then(res => {
        if (res.ok) {
          setTrainings(prev => prev.filter(t => t.id !== id))
          toast({ title: "Removido", description: "Treinamento excluído com sucesso." })
        } else {
          toast({ title: "Erro", description: "Erro ao excluir o treinamento.", variant: "destructive" })
        }
      })
      .catch(() => {
        toast({ title: "Erro", description: "Falha na comunicação com o servidor.", variant: "destructive" })
      })
  }

  const { toast } = useToast()

  const [trainings, setTrainings] = useState<Training[]>([])
  const [newTraining, setNewTraining] = useState<Partial<Training>>({})

  useEffect(() => {
    fetch("/data/trainings.json")
      .then(res => res.json())
      .then(data => setTrainings(data))
      .catch(() => console.error("Erro ao carregar treinamentos"))
  }, [])

  const handleAddTraining = () => {

    if (!newTraining.title || !newTraining.videoUrl) {
      toast({ title: "Campos obrigatórios", description: "Título e URL do YouTube são obrigatórios.", variant: "destructive" });
      return;
    }


    const updated: Training = {
      id: Date.now(),
      title: newTraining.title,
      description: newTraining.description || "",
      category: newTraining.category || "",
      type: newTraining.type || "Vídeo",
      duration: newTraining.duration || "10min",
      instructor: newTraining.instructor || "Equipe Elbratec",
      videoUrl: newTraining.videoUrl,
      thumbnail: `https://img.youtube.com/vi/${(newTraining.videoUrl?.split("v=")[1] || "").split("&")[0]}/0.jpg`,
      documents: [],
      completionRate: 0
    }

    const novos = [...trainings, updated]
    setTrainings(novos)
    setNewTraining({})

    // Atualização local apenas — precisa de backend ou API para persistência real
    fetch("/api/save-training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })
      .then(res => {

        if (res.ok) {
          toast({ title: "Sucesso", description: "Treinamento adicionado com sucesso!" })
        } else {
          toast({ title: "Erro", description: "Erro ao salvar no servidor.", variant: "destructive" })
        }
      })
      .catch(() => {
        toast({ title: "Erro", description: "Falha na comunicação com o servidor.", variant: "destructive" })
      })
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Treinamentos</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">+ Novo Treinamento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Treinamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={newTraining.title || ""} onChange={e => setNewTraining({ ...newTraining, title: e.target.value })} />
              <Label>Descrição</Label>
              <Textarea value={newTraining.description || ""} onChange={e => setNewTraining({ ...newTraining, description: e.target.value })} />
              <Label>Categoria</Label>
              <Input value={newTraining.category || ""} onChange={e => setNewTraining({ ...newTraining, category: e.target.value })} />
              <Label>Duração</Label>
              <Input value={newTraining.duration || ""} onChange={e => setNewTraining({ ...newTraining, duration: e.target.value })} />
              <Label>Instrutor</Label>
              <Input value={newTraining.instructor || ""} onChange={e => setNewTraining({ ...newTraining, instructor: e.target.value })} />
              <Label>URL do YouTube</Label>
              <Input value={newTraining.videoUrl || ""} onChange={e => setNewTraining({ ...newTraining, videoUrl: e.target.value })} />
            </div>
            <DialogFooter>
              <Button onClick={handleAddTraining}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainings.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle>{t.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {t.thumbnail && <img src={t.thumbnail} alt="thumb" className="rounded-md w-full" />}
              <p>{t.description}</p>
              <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                Assistir no YouTube
              </a>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteTraining(t.id)}>
                Excluir
              </Button>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
