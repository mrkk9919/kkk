import { useRef } from 'react'
import { toPng } from 'html-to-image'
import './KhqrPoster.css'

interface KhqrPosterProps {
  wingAccount: string
  realName?: string
  qrImage: string
  onClose?: () => void
}

export default function KhqrPoster({
  wingAccount,
  realName,
  qrImage,
  onClose,
}: KhqrPosterProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  async function download() {
    if (!cardRef.current) return
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `khqr-${wingAccount}.png`
    a.click()
  }

  const name = realName || wingAccount

  return (
    <div className="qr-modal">
      <div className="poster-toolbar">
        <button onClick={download}>下载 PNG</button>
        {onClose && <button onClick={onClose}>关闭</button>}
      </div>
      <div className="poster-card" ref={cardRef}>
        <div className="poster-banner">
          <span className="poster-khqr">KHQR</span>
        </div>
        <div className="poster-name">{name}</div>
        <div className="poster-divider"></div>
        <div className="poster-qr-wrap">
          <img src={qrImage} alt="KHQR" />
          <div className="poster-center-logo"></div>
        </div>
        <div className="poster-foot">Member of KHQR · Accepted here</div>
      </div>
    </div>
  )
}
