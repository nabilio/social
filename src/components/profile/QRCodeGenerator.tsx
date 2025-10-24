import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Button } from '../ui/Button'
import { Download, Share2, RefreshCw, Maximize2, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface QRCodeGeneratorProps {
  url: string
  title: string
  size?: number
  showScanButton?: boolean
}

export function QRCodeGenerator({ url, title, size = 200, showScanButton = true }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modalCanvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showScanModal, setShowScanModal] = useState(false)

  useEffect(() => {
    generateQRCode()
  }, [url, size])

  useEffect(() => {
    if (showScanModal) {
      generateModalQRCode()
    }
  }, [showScanModal, url])

  const generateQRCode = async () => {
    if (!canvasRef.current || !url) return

    setLoading(true)
    setError(null)

    try {
      const canvas = canvasRef.current
      
      // Generate real QR code using qrcode library
      await QRCode.toCanvas(canvas, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      
      console.log('✅ QR Code generated successfully for URL:', url)
    } catch (err) {
      console.error('❌ Error generating QR code:', err)
      setError('Failed to generate QR code')
      toast.error('Failed to generate QR code')
    } finally {
      setLoading(false)
    }
  }

  const generateModalQRCode = async () => {
    if (!modalCanvasRef.current || !url) return

    try {
      const canvas = modalCanvasRef.current
      
      // Generate larger QR code for scanning
      await QRCode.toCanvas(canvas, url, {
        width: 400,
        margin: 4,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H' // Higher error correction for better scanning
      })
      
      console.log('✅ Modal QR Code generated successfully')
    } catch (err) {
      console.error('❌ Error generating modal QR code:', err)
      toast.error('Failed to generate scan QR code')
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
          // Fallback to copying URL
          await navigator.clipboard.writeText(url)
          toast.success('URL du profil copiée dans le presse-papiers !')
        }
      }, 'image/png')
    } catch (error) {
      console.error('Error sharing QR code:', error)
      toast.error('Erreur lors du partage')
    }
  }

  const retryGeneration = () => {
    generateQRCode()
  }

  const openScanModal = () => {
    setShowScanModal(true)
  }

  const closeScanModal = () => {
    setShowScanModal(false)
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-2xl">⚠️</span>
        </div>
        <p className="text-red-600 dark:text-red-400 mb-4">
          Erreur lors de la génération du QR code
        </p>
        <Button size="sm" variant="outline" onClick={retryGeneration}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="text-center">
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            className="border border-gray-200 dark:border-gray-600 rounded-lg mx-auto mb-4 bg-white"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-2 mb-3">
          <Button size="sm" variant="outline" onClick={downloadQRCode} disabled={loading}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
          <Button size="sm" variant="outline" onClick={shareQRCode} disabled={loading}>
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
          {showScanButton && (
            <Button size="sm" variant="outline" onClick={openScanModal} disabled={loading}>
              <Maximize2 className="w-4 h-4 mr-2" />
              Scanner
            </Button>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            📱 Scannez pour visiter
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-mono break-all">
            {url}
          </p>
        </div>
        
        <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-700 dark:text-green-300">
            ✅ QR code scannable généré avec succès
          </p>
        </div>
      </div>

      {/* Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative max-w-lg w-full mx-4">
            {/* Close button */}
            <button
              onClick={closeScanModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* Modal content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  📱 Scannez le QR Code
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Utilisez l'appareil photo de votre téléphone pour scanner
                </p>
              </div>
              
              {/* Large QR Code */}
              <div className="bg-white p-6 rounded-xl shadow-inner mb-6 inline-block">
                <canvas
                  ref={modalCanvasRef}
                  className="mx-auto"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(url)
                    toast.success('URL copiée !')
                  }}
                >
                  Copier le lien
                </Button>
                <Button size="sm" onClick={closeScanModal}>
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}