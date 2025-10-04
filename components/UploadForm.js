// components/UploadForm.js
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
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

  // プロフィール画像用
  const onDropProfile = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setProfileImage(file)
      setError('')
      const reader = new FileReader()
      reader.onload = (e) => setProfilePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }, [])

  const onDropRejectedProfile = useCallback((rejectedFiles) => {
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach(({ code }) => {
        if (code === 'file-too-large') {
          setError(`${file.name} のファイルサイズが大きすぎます。5MB以下の画像を選択してください。`)
        } else if (code === 'file-invalid-type') {
          setError(`${file.name} は画像ファイルではありません。PNG、JPEG、GIF、WebPを選択してください。`)
        }
      })
    })
  }, [])

  const profileDropzone = useDropzone({
    onDrop: onDropProfile,
    onDropRejected: onDropRejectedProfile,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': []
    },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
    multiple: false,
    noClick: false,
    noKeyboard: false
  })

  // ヒーロー画像用
  const onDropHero = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setHeroImage(file)
      setError('')
      const reader = new FileReader()
      reader.onload = (e) => setHeroPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }, [])

  const onDropRejectedHero = useCallback((rejectedFiles) => {
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach(({ code }) => {
        if (code === 'file-too-large') {
          setError(`${file.name} のファイルサイズが大きすぎます。5MB以下の画像を選択してください。`)
        } else if (code === 'file-invalid-type') {
          setError(`${file.name} は画像ファイルではありません。PNG、JPEG、GIF、WebPを選択してください。`)
        }
      })
    })
  }, [])

  const heroDropzone = useDropzone({
    onDrop: onDropHero,
    onDropRejected: onDropRejectedHero,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': []
    },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
    multiple: false,
    noClick: false,
    noKeyboard: false
  })

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

  const DropZone = ({ dropzone, preview, label, type }) => {
    const getBorderColor = () => {
      if (dropzone.isDragReject) return '#ff6b6b'
      if (dropzone.isDragAccept) return '#4caf50'
      if (dropzone.isDragActive) return '#00d4ff'
      return 'rgba(255,255,255,0.3)'
    }

    const getBackgroundColor = () => {
      if (dropzone.isDragReject) return 'rgba(255,107,107,0.1)'
      if (dropzone.isDragAccept) return 'rgba(76,175,80,0.1)'
      if (dropzone.isDragActive) return 'rgba(0,212,255,0.1)'
      return 'rgba(255,255,255,0.02)'
    }

    return (
      <div
        {...dropzone.getRootProps()}
        style={{
          border: `2px dashed ${getBorderColor()}`,
          borderRadius: '10px',
          padding: '40px',
          textAlign: 'center',
          background: getBackgroundColor(),
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
        <input {...dropzone.getInputProps()} />
        {preview ? (
          <div style={{ position: 'relative', width: '100%', height: '200px' }}>
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
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ marginBottom: '20px', opacity: 0.4 }}>
                <circle cx="60" cy="60" r="55" fill="none" stroke="#00d4ff" strokeWidth="2" strokeDasharray="5,5" />
                <circle cx="60" cy="45" r="15" fill="rgba(0,212,255,0.3)" />
                <path d="M 35 85 Q 35 65 60 65 Q 85 65 85 85" fill="rgba(0,212,255,0.3)" />
              </svg>
            ) : (
              <svg width="200" height="140" viewBox="0 0 200 140" style={{ marginBottom: '20px', opacity: 0.4 }}>
                <rect x="40" y="10" width="120" height="100" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" rx="3" />
                <rect x="40" y="10" width="120" height="35" fill="rgba(0,212,255,0.3)" stroke="#00d4ff" strokeWidth="2" rx="3" />
                <text x="100" y="125" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12">ページ上部に表示</text>
              </svg>
            )}
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '10px', fontSize: '15px' }}>
              {dropzone.isDragReject 
                ? 'このファイル形式は使用できません' 
                : dropzone.isDragAccept 
                  ? 'ドロップしてアップロード' 
                  : 'ドラッグ&ドロップ または クリックして選択'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
              {label}
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Inter", -apple-system, sans-serif'
    }}>
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

        {/* ドロップゾーンをformの外に配置 */}
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
          <DropZone 
            dropzone={profileDropzone} 
            preview={profilePreview} 
            label="顔写真推奨（5MB以下）" 
            type="profile" 
          />
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
          <DropZone 
            dropzone={heroDropzone} 
            preview={heroPreview} 
            label="未選択の場合、プロフィール画像を使用（5MB以下）" 
            type="hero" 
          />
        </div>

        {/* アップロードボタンだけformに */}
        <form onSubmit={handleUpload}>
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