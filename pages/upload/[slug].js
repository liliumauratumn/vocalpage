import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Image from 'next/image'
import UploadSuccess from '../../components/UploadSuccess'

export default function UploadPage({ trainer }) {
  const [profileImage, setProfileImage] = useState(null)
  const [heroImage, setHeroImage] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [heroPreview, setHeroPreview] = useState(null)
  // 編集キー認証用の状態（追加）
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [editKey, setEditKey] = useState('')
  const [authError, setAuthError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState({ profile: false, hero: false })
  
  // 成功画面表示用の状態
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [wasUpdate, setWasUpdate] = useState(false)

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
// 編集キー認証関数（追加）
 const handleVerifyKey = async () => {
  setVerifying(true)
  setAuthError('')

  try {
    const response = await fetch('/api/verify-edit-key', {
      method: 'POST',
      mode: 'cors',
  credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: trainer.slug, editKey: editKey })
    })

    const data = await response.json()

    if (response.ok) {
      setIsAuthenticated(true)
    } else {
      setAuthError(data.error || '認証に失敗しました')
    }
  } catch (error) {
    setAuthError('エラーが発生しました')
  } finally {
    setVerifying(false)
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
    // レート制限チェック
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

      // アップロード成功（ボタンを緑に変更して2秒間表示）
      setUploading(false)
      setUploadComplete(true)
      
      // 2秒後に成功画面を表示
      setTimeout(() => {
        setWasUpdate(wasActive)
        setUploadSuccess(true)
      }, 2000)

    } catch (error) {
      setError(`エラー: ${error.message}`)
      setUploading(false)
    }
  }
// 編集キー認証画面（このブロック全体を置き換え）
  if (!isAuthenticated) {
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
          maxWidth: '400px',
          width: '100%',
          background: 'rgba(255,255,255,0.05)',
          padding: '40px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔐</div>
            <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>編集キー認証</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{trainer.name} 様</p>
          </div>

          <form>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#00d4ff',
                fontSize: '13px',
                textAlign: 'center'
              }}>
                編集キーを入力してください
              </label>
              {trainer.edit_key_hint && (
            <div style={{
              padding: '12px 20px',
              background: 'rgba(255,193,7,0.1)',
              border: '1px solid rgba(255,193,7,0.3)',
              borderRadius: '8px',
              marginTop: '20px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,193,7,0.8)', marginBottom: '5px', letterSpacing: '0.1em' }}>
                💡 ヒント
              </div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                {trainer.edit_key_hint}
              </div>
            </div>
          )}
              <input
                type="text"
                value={editKey}
                onChange={(e) => setEditKey(e.target.value)}
                placeholder="登録時に設定したキーワード"
                required
        style={{
                  width: '100%',
                  padding: '15px',
                  background: 'transparent',
                  border: '2px solid #00d4ff',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>

            {authError && (
              <div style={{
                padding: '10px',
                background: 'rgba(255,0,0,0.2)',
                border: '1px solid rgba(255,0,0,0.4)',
                borderRadius: '5px',
                color: '#ff6b6b',
                fontSize: '13px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={handleVerifyKey}
              disabled={verifying}
              style={{
                width: '100%',
                padding: '15px',
                background: verifying ? '#666' : 'linear-gradient(90deg, #00d4ff, #667eea)',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: verifying ? 'not-allowed' : 'pointer',
                WebkitTapHighlightColor: 'transparent',  // ← 追加
  touchAction: 'manipulation'      
              }}
            >
              {verifying ? '確認中...' : '認証する'}
            </button>
          </form>
        </div>
      </div>
    )
  }
  // 成功画面を表示
  if (uploadSuccess) {
    const pageUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${trainer.slug}`
    return (
      <UploadSuccess 
        trainerName={trainer.name}
        pageUrl={pageUrl}
        themeColor={trainer.theme_color || 'blue'}
        wasUpdate={wasUpdate}
      />
    )
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
            ドラッグ&ドロップ または クリックして選択
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
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
            {uploadComplete ? '✅ アップロード成功！' : uploading ? 'アップロード中...' : 'アップロード'}
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
              textAlign: 'center'
            }}>
              {error}
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
    .select('slug, name, theme_color, edit_key_hint')
    .eq('slug', params.slug)
    .single()

  if (!trainer) {
    return { notFound: true }
  }

  return { props: { trainer } }
}