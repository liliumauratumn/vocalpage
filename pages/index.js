import { supabase } from '../lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import TextPressure from '../components/ui/TextPressure'
import Prism from '../components/ui/Prism'
import Galaxy from '../components/ui/Galaxy'
import { useState, useEffect } from 'react'
export default function Home({ trainers }) {

  const [backgroundType, setBackgroundType] = useState(null)
   const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // 0か1をランダムに選択（50%ずつ）
    const random = Math.random() < 0.5 ? 'prism' : 'galaxy'
    setBackgroundType(random)
  }, [])
   // モバイル判定
    setIsMobile(window.innerWidth <= 768)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  // まだ背景が決まっていない場合は何も表示しない
  if (!backgroundType) {
    return <div style={{ minHeight: '100vh', background: '#000' }} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      position: 'relative'
    }}>
    {/* 背景：PrismまたはGalaxy */}
<div style={{
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0
}}>
  {backgroundType === 'prism' ? (
    <Prism
      animationType="rotate"
      timeScale={0.5}
      height={3.5}
      baseWidth={5.5}
      scale={3.6}
      hueShift={0}
      colorFrequency={1}
      noise={0.1}
      glow={1}
    />
  ) : (
    <Galaxy
      mouseRepulsion={false}
      mouseInteraction={false}
      density={1.5}
      glowIntensity={0.5}
      saturation={0.8}
      hueShift={240}
    />
  )}
</div>

      {/* メインコンテンツ */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: '100vh',
        fontFamily: '"Inter", -apple-system, sans-serif'
      }}>
        <div style={{
          height: '250px',
          width: '80vw',
          maxWidth: '1200px',
          marginBottom: '20px'
           marginTop: isMobile ? '80px' : '0'  // ← ここが追加
        }}>
          <TextPressure
            text="VocalPage"
            fontFamily="Compressa VF"
            fontUrl="/fonts/CompressaPRO-GX.woff2"
            flex={false}
            stroke={false}
            textColor="#00d4ff"
            strokeColor="#A90082"
            minFontSize={60}
            width={true}
            weight={true}
            italic={true}
          />
        </div>

        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '60px',
          textAlign: 'center'
        }}>
          Voice Trainer Portfolio
        </p>

        {trainers.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>
            公開中のトレーナーはまだいません
          </p>
        ) : (
          <div style={{
            display: 'flex',
            gap: '40px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '800px'
          }}>
            {trainers.map(trainer => (
              <Link
                key={trainer.slug}
                href={`/${trainer.slug}`}
                style={{
                  textDecoration: 'none',
                  color: '#fff',
                  textAlign: 'center',
                  transition: 'transform 0.3s'
                }}
              >
                <div
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #00d4ff',
                    marginBottom: '15px',
                    position: 'relative',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                    e.currentTarget.style.borderColor = '#667eea'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.borderColor = '#00d4ff'
                  }}
                >
                  <Image
                    src={trainer.photo_url}
                    alt={trainer.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '5px'
                }}>
                  {trainer.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)'
                }}>
                  {trainer.area}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const { data: trainers } = await supabase
    .from('trainers')
    .select('slug, name, photo_url, area')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  return {
    props: { trainers: trainers || [] }
  }
}