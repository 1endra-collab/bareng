"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createDevice } from "@/actions/device"

export function AddDeviceModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const clientAction = async (formData: FormData) => {
    setLoading(true)
    const res = await createDevice(formData)
    setLoading(false)
    if (res.success) {
      setOpen(false)
    } else {
      alert(res.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + Tambah Device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Device Baru</DialogTitle>
        </DialogHeader>
        <form action={clientAction} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama Device</label>
            <Input name="name" placeholder="Contoh: lab1-pc25 atau laptop3" required />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Tipe / Deskripsi</label>
            <Input name="type" placeholder="Contoh: PC Desktop atau Laptop ASUS" required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Device"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}