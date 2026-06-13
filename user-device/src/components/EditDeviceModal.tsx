"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateDeviceStatus, deleteDevice } from "@/actions/device"

interface EditDeviceProps {
  device: {
    id: string
    name: string
    isAvailable: boolean
    type: string
  }
}

export function EditDeviceModal({ device }: EditDeviceProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [inputName, setInputName] = useState(device.name)
  const isCurrentlyRusak = device.type.toLowerCase().includes("[rusak]")
  const [statusSelect, setStatusSelect] = useState(
    isCurrentlyRusak ? "rusak" : device.isAvailable ? "tersedia" : "dipakai"
  )

  const handleSave = async (formData: FormData) => {
    setLoading(true)
    const res = await updateDeviceStatus(device.id, formData)
    setLoading(false)
    if (res.success) {
      setOpen(false)
    } else {
      alert(res.error)
    }
  }

  const handleDelete = async () => {
    if (confirm(`Apakah Anda yakin ingin menghapus device ${device.name}?`)) {
      setLoading(true)
      const res = await deleteDevice(device.id)
      setLoading(false)
      if (res.success) {
        setOpen(false)
      } else {
        alert(res.error)
      }
    }
  }

  // Fungsi pengondisian reset state internal ketika modal ditutup/dibuka kembali
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setInputName(device.name)
      setStatusSelect(isCurrentlyRusak ? "rusak" : device.isAvailable ? "tersedia" : "dipakai")
    }
  }

  return (
    // Trik key di bawah ini menjamin data form langsung ter-reset otomatis tanpa bantuan useEffect
    <Dialog open={open} onOpenChange={handleOpenChange} key={`${device.id}-${open}`}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between pt-2">
          <DialogTitle>Ubah Data Device</DialogTitle>
          
          <Button 
            type="button" 
            size="sm" 
            className="h-7 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white mr-4 shadow-none"
            onClick={handleDelete}
            disabled={loading}
          >
            Hapus Device
          </Button>
        </DialogHeader>
        <form action={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama Device</label>
            <Input 
              name="name" 
              value={inputName} 
              onChange={(e) => setInputName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select
              name="statusSelect"
              value={statusSelect}
              onChange={(e) => setStatusSelect(e.target.value)}
              className="w-full p-2 border rounded-md bg-background text-sm focus:outline-none"
            >
              <option value="tersedia">Tersedia</option>
              <option value="dipakai">Dipakai / Dipinjam</option>
              <option value="rusak">Rusak</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}