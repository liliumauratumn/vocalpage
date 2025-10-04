// components/UploadForm.js
// Chrome/Safari/Firefox完全対応版

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Image from 'next/image'

export default function UploadForm({ trainer, onSuccess }) {
  const [profileImage, setProfileImage] = useState(null)
  const [heroImage, setHeroImage] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [heroPreview, setHeroPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadComplete, setUploadComplete] = useState(false)
  const [dragActive, setDragActive] = useState({ profile: false, hero: false })

  // 【削除】useEffectでのページ全体のpreventDefaultは削除
  // ドロップゾーンのイベントを妨害しないため

  // 【強化】ファイル形式の詳細チェック
  const handleFile = (file, type) => {
    if (!file) {
      setError('ファイルが選択されていません')
      return
    }
    if (!file.type.startsWith('image/') || !['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) {
      setError('PNG、JPEG、GIF、またはWebP形式の画像を選択してください')
      return
    }
    
    // エラーをクリア
    setError('')
    
    const reader = new FileReader()
    reader.onload = (e) => {
      if (type === 'profile') {
        setProfileImage(file)
        setProfilePreview(e.target.result)
      } else {
        setHeroImage(file)
        setHeroPreview(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  // 【修正】dropEffect設定 + デバッグログ
  const handleDrag = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log(`Drag event: ${e.type}, type: ${type}`)
    
    // Chrome/Safari必須
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive({ ...dragActive, [type]: true })
    } else if (e.type === 'dragleave') {
      setDragActive({ ...dragActive, [type]: false })
    }
  }

  // 【修正】デバッグログ追加
  const handleDrop = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(`Drop event: type: ${type}, files:`, e.dataTransfer.files, 'items:', e.dataTransfer.items)
    
    setDragActive({ ...dragActive, [type]: false })

    let file = null
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file') {
          file = e.dataTransfer.items[i].getAsFile()
          console.log('Dropped file from items:', file)
          break
        }
      }
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      file = e.dataTransfer.files[0]
      console.log('Dropped file from files:', file)
    }

    if (file) {
      handleFile(file, type)
    } else {
      setError('有効な画像ファイルを選択してください')
    }
  }

  const deleteOldFiles = async (slug, type) => {
    const { data: files } = await supabase.storage
      .from('trainer-photos')
      .list()
    
    if (files) {
      const oldFiles = files.filter(file => 
        file.name.startsWith(`${slug}-${type}`)
      )
      
      if (oldFiles.length > 0) {
        const filePaths = oldFiles.map(file => file.name)
        await supabase.storage
          .from('trainer-photos')
          .remove(filePaths)
      }
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    if (!profileImage) {
      setError('プロフィール画像は必須です')
      return
    }

    setUploading(true)
    setError('')

    try {
      const limitCheck = await fetch('/api/check-upload-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const limitData = await limitCheck.json()

      if (!limitCheck.ok) {
        setError(limitData.error)
        setUploading(false)
        return
      }

      const { data: currentTrainer } = await supabase
        .from('trainers')
        .select('status')
        .eq('slug', trainer.slug)
        .single()
      
      const wasActive = currentTrainer?.status === 'active'

      await deleteOldFiles(trainer.slug, 'profile')
      if (heroImage) {
        await deleteOldFiles(trainer.slug, 'hero')
      }

      const profileExt = profileImage.name.split('.').pop()
      const profilePath = `${trainer.slug}-profile.${profileExt}`
      
      const { error: profileError } = await supabase.storage
        .from('trainer-photos')
        .upload(profilePath, profileImage, { upsert: true })

      if (profileError) throw profileError

      let heroPath = null
      if (heroImage) {
        const heroExt = heroImage.name.split('.').pop()
        heroPath = `${trainer.slug}-hero.${heroExt}`
        
        const { error: heroError } = await supabase.storage
          .from('trainer-photos')
          .upload(heroPath, heroImage, { upsert: true })

        if (heroError) throw heroError
      }

      const timestamp = Date.now()
      
      const { data: profileUrl } = supabase.storage
        .from('trainer-photos')
        .getPublicUrl(profilePath)

      const { data: heroUrl } = heroImage ? supabase.storage
        .from('trainer-photos')
        .getPublicUrl(heroPath) : { data: null }

      const profileUrlWithCache = `${profileUrl.publicUrl}?v=${timestamp}`
      const heroUrlWithCache = heroUrl ? `${heroUrl.publicUrl}?v=${timestamp}` : null

      const { error: updateError } = await supabase
        .from('trainers')
        .update({
          photo_url: profileUrlWithCache,
          hero_image: heroUrlWithCache,
          status: 'pending'
        })
        .eq('slug', trainer.slug)

      if (updateError) throw updateError

      setUploading(false)
      setUploadComplete(true)
      
      setTimeout(() => {
        onSuccess(wasActive)
      }, 2000)

    } catch (error) {
      setError(`エラー: ${error.message}`)
      setUploading(false)
    }
  }

  const DropZone = ({ type, preview, label }) => (
    <div
      onDragEnter={(e) => handleDrag(e, type)}
      onDragLeave={(e) => handleDrag(e, type)}
      onDragOver={(e) => handleDrag(e, type)}
      onDrop={(e) => handleDrop(e, type)}
      onClick={() => document.getElementById(`${type}-file-input`).click()}
      style={{
        border: `2px dashed ${dragActive[type] ? '#00d4ff' : 'rgba(255,255,255,0.3)'}`,
        borderRadius: '10px',
        padding: '40px',
        textAlign: 'center',
        background: dragActive[type] ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.3s',
        cursor: 'pointer',
        position: 'relative',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {preview ? (
        <div style={{ position: 'relative', width: '100%', height: '200px', pointerEvents: 'none' }}>
          <Image
            src={preview}
            alt="Preview"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      ) : (
        <>
          {type === 'profile' ? (
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ marginBottom: '20px', opacity: 0.4, pointerEvents: 'none' }}>
              <circle cx="60" cy="60" r="55" fill="none" stroke="#00d4ff" strokeWidth="2" strokeDasharray="5,5" />
              <circle cx="60" cy="45" r="15" fill="rgba(0,212,255,0.3)" />
              <path d="M 35 85 Q 35 65 60 65 Q 85 65 85 85" fill="rgba(0,212,255,0.3)" />
            </svg>
          ) : (
            <svg width="200" height="140" viewBox="0 0 200 140" style={{ marginBottom: '20px', opacity: 0.4, pointerEvents: 'none' }}>
              <rect x="40" y="10" width="120" height="100" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" rx="3" />
              <rect x="40" y="10" width="120" height="35" fill="rgba(0,212,255,0.3)" stroke="#00d4ff" strokeWidth="2" rx="3" />
              <text x="100" y="125" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12">ページ上部に表示</text>
            </svg>
          )}
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '10px', fontSize: '15px', pointerEvents: 'none' }}>
            ドラッグ&ドロップ または クリックして選択
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', pointerEvents: 'none' }}>
            {label}
          </p>
        </>
      )}
      <input
        id={`${type}-file-input`}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files[0], type)}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          opacity: 0,
          cursor: 'pointer',
          pointerEvents: 'none'
        }}
      />
    </div>
  )

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Inter", -apple-system, sans-serif'
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'rgba(255,255,255,0.05)',
        padding: '40px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
          画像アップロード
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px' }}>
          {trainer.name} 様
        </p>

        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '15px',
              color: '#00d4ff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              プロフィール画像（必須）
            </label>
            <DropZone type="profile" preview={profilePreview} label="顔写真推奨" />
          </div>

          <div style={{ marginBottom: '40px' }}>
            <label style={{
              display: 'block',
              marginBottom: '15px',
              color: '#00d4ff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              トップ背景画像（任意）
            </label>
            <DropZone type="hero" preview={heroPreview} label="未選択の場合、プロフィール画像を使用" />
          </div>

          <button
            type="submit"
            disabled={uploading || uploadComplete}
            style={{
              width: '100%',
              padding: '15px',
              background: uploadComplete 
                ? '#4caf50' 
                : uploading 
                  ? '#666' 
                  : 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe, #00f2fe, #667eea)',
              backgroundSize: '300% 100%',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (uploading || uploadComplete) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              animation: (uploading || uploadComplete) ? 'none' : 'colorShift 3s ease-in-out infinite alternate'
            }}
          >
            {uploadComplete ? '✅ アップロード成功!' : uploading ? 'アップロード中...' : 'アップロード'}
          </button>

          <style jsx>{`
            @keyframes colorShift {
              0% { background-position: 0% 50%; }
              100% { background-position: 100% 50%; }
            }
          `}</style>

          {error && (
            <p style={{
              marginTop: '20px',
              padding: '10px',
              background: 'rgba(255,0,0,0.2)',
              borderRadius: '5px',
              textAlign: 'center',
              color: '#ff6b6b'
            }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}