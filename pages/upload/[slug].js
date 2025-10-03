import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function UploadPage({ trainer }) {
  const router = useRouter()
  const [profileImage, setProfileImage] = useState(null)
  const [heroImage, setHeroImage] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [heroPreview, setHeroPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [dragActive, setDragActive] = useState({ profile: false, hero: false })

  const handleFile = (file, type) => {
    if (!file || !file.type.startsWith('image/')) return

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

  const handleDrag = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive({ ...dragActive, [type]: true })
    } else if (e.type === 'dragleave') {
      setDragActive({ ...dragActive, [type]: false })
    }
  }

  const handleDrop = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive({ ...dragActive, [type]: false })

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], type)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    if (!profileImage) {
      setMessage('プロフィール画像を選択してください')
      return
    }

    setUploading(true)
    setMessage('アップロード中...')

    try {
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

      const { data: profileUrl } = supabase.storage
        .from('trainer-photos')
        .getPublicUrl(profilePath)

      const { data: heroUrl } = heroImage ? supabase.storage
        .from('trainer-photos')
        .getPublicUrl(heroPath) : { data: null }

      const { error: updateError } = await supabase
        .from('trainers')
        .update({
          photo_url: profileUrl.publicUrl,
          hero_image: heroUrl ? heroUrl.publicUrl : null
        })
        .eq('slug', trainer.slug)

      if (updateError) throw updateError

      setMessage('アップロード完了！')
      setTimeout(() => {
        router.push(`/${trainer.slug}`)
      }, 2000)

    } catch (error) {
      setMessage(`エラー: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const DropZone = ({ type, preview, label }) => (
    <div
      onDragEnter={(e) => handleDrag(e, type)}
      onDragLeave={(e) => handleDrag(e, type)}
      onDragOver={(e) => handleDrag(e, type)}
      onDrop={(e) => handleDrop(e, type)}
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
          <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>📸</div>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
            ドラッグ&ドロップ または クリックして選択
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            {label}
          </p>
        </>
      )}
      <input
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
          cursor: 'pointer'
        }}
      />
    </div>
  )

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
            <DropZone type="profile" preview={profilePreview} label="顔写真・バストアップ推奨" />
          </div>

          <div style={{ marginBottom: '40px' }}>
            <label style={{
              display: 'block',
              marginBottom: '15px',
              color: '#00d4ff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              ヒーロー画像（任意）
            </label>
            <DropZone type="hero" preview={heroPreview} label="未選択の場合、プロフィール画像を使用" />
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{
              width: '100%',
              padding: '15px',
              background: uploading ? '#666' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: uploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {uploading ? 'アップロード中...' : 'アップロード'}
          </button>

          {message && (
            <p style={{
              marginTop: '20px',
              padding: '10px',
              background: message.includes('エラー') ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.2)',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const { data: trainer } = await supabase
    .from('trainers')
    .select('slug, name')
    .eq('slug', params.slug)
    .single()

  if (!trainer) {
    return { notFound: true }
  }

  return { props: { trainer } }
}
