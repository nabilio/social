import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Download, Share2, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
}

export function QRCodeModal({ isOpen, onClose, url, title }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generateQRCode()
    }
  }, [isOpen, url])

  const generateQRCode = async () => {
    if (!canvasRef.current || !url) return

    try {
      const canvas = canvasRef.current
      
      await QRCode.toCanvas(canvas, url, {
        width: 400,
        margin: 4,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      })
      
      console.log('✅ QR Code generated for modal')
    } catch (err) {
      console.error('❌ Error generating QR code:', err)
      toast.error('Failed to generate QR code')
    }
  }

  const downloadQRCode = () => {
    if (!canvasRef.current) return

    try {
      const link = document.createElement('a')
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr_code.png`
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
      
      toast.success('QR code téléchargé !')
    } catch (error) {
      console.error('Error downloading QR code:', error)
      toast.error('Erreur lors du téléchargement')
    }
  }

  const shareQRCode = async () => {
    if (!canvasRef.current) return

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return

        const file = new File([blob], `${title}_qr_code.png`, { type: 'image/png' })
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${title} - QR Code`,
            text: `Scannez ce QR code pour visiter ${title}`,
            files: [file],
          })
          toast.success('QR code partagé !')
        } else {
          await navigator.clipboard.writeText(url)
          toast.success('URL copiée dans le presse-papiers !')
        }
      }, 'image/png')
    } catch (error) {
      console.error('Error sharing QR code:', error)
      toast.error('Erreur lors du partage')
    }
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('URL copiée dans le presse-papiers !')
    } catch (error) {
      toast.error('Erreur lors de la copie')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Scanner QR Code">
      <div className="text-center">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Utilisez l'appareil photo de votre téléphone pour scanner ce QR code
          </p>
          
          {/* Large QR Code */}
          <div className="bg-white p-6 rounded-xl shadow-inner mb-4 inline-block">
            <canvas
              ref={canvasRef}
              className="mx-auto"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
        
        {/* Instructions */}
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">1</span>
            <span>Ouvrez l'appareil photo de votre téléphone</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">2</span>
            <span>Pointez vers le QR code</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">3</span>
            <span>Appuyez sur le lien qui apparaît</span>
          </div>
        </div>
        
        {/* URL display */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ou visitez directement :</p>
          <p className="text-sm font-mono text-blue-600 dark:text-blue-400 break-all">
            {url}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-center space-x-3">
          <Button size="sm" variant="outline" onClick={copyUrl}>
            <Copy className="w-4 h-4 mr-2" />
            Copier le lien
          </Button>
          <Button size="sm" variant="outline" onClick={downloadQRCode}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
          <Button size="sm" variant="outline" onClick={shareQRCode}>
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>
    </Modal>
  )
}