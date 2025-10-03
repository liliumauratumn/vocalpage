import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'

export default function UploadPage({ trainer }) {
  const router = useRouter()
  const [profileImage, setProfileImage] = useState(null)
  const [heroImage, setHeroImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async (e) => {
    e.preventDefault()
    
    if (!profileImage) {
      setMessage('プロフィール画像を選択してください')
      return
    }

    setUploading(true)
    setMessage('アップロード中...')

    try {
      // プロフィール画像をアップロード
      const profileExt = profileImage.name.split('.').pop()
      const profilePath = `${trainer.slug}-profile.${profileExt}`
      
      const { error: profileError } = await supabase.storage
        .from('trainer-photos')
        .upload(profilePath, profileImage, { upsert: true })

      if (profileError) throw profileError

      // ヒーロー画像をアップロード（ある場合）
      let heroPath = null
      if (heroImage) {
        const heroExt = heroImage.name.split('.').pop()
        heroPath = `${trainer.slug}-hero.${heroExt}`
        
        const { error: heroError } = await supabase.storage
          .from('trainer-photos')
          .upload(heroPath, heroImage, { upsert: true })

        if (heroError) throw heroError
      }

      // 公開URLを取得
      const { data: profileUrl } = supabase.storage
        .from('trainer-photos')
        .getPublicUrl(profilePath)

      const { data: heroUrl } = heroImage ? supabase.storage
        .from('trainer-photos')
        .getPublicUrl(heroPath) : { data: null }

      // DBを更新
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
        maxWidth: '500px',
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
          {/* プロフィール画像 */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: '#00d4ff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              プロフィール画像（必須）
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '5px',
                color: '#fff'
              }}
            />
            {profileImage && (
              <p style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                選択中: {profileImage.name}
              </p>
            )}
          </div>

          {/* ヒーロー画像 */}
          <div style={{ marginBottom: '40px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: '#00d4ff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              ヒーロー画像（任意）
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHeroImage(e.target.files[0])}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '5px',
                color: '#fff'
              }}
            />
            <p style={{ marginTop: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              未選択の場合、プロフィール画像を使用します
            </p>
            {heroImage && (
              <p style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                選択中: {heroImage.name}
              </p>
            )}
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
              cursor: uploading ? 'not-allowed' : 'pointer'
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
