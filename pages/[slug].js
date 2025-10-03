// pages/[id].js
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { supabase } from '../lib/supabase'
import { themes, getTheme, getAllThemeKeys } from '../lib/themes'
import MusicSection from '../components/MusicSection'
import ProfileSection from '../components/ProfileSection'
import VideoSection from '../components/VideoSection'
export default function TrainerPage({ trainer }) {
  const [theme, setTheme] = useState(trainer.theme_color || 'blue')
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!trainer) {
    return <div>トレーナーが見つかりません</div>
  }

  const t = getTheme[theme]

  return (
    <>
      <Head>
        <title>{trainer.name} - Voice Trainer | VocalPage</title>
        <meta name="description" content={trainer.bio} />
      </Head>

      <div style={{
        fontFamily: '"Inter", -apple-system, sans-serif',
        background: '#000',
        color: '#fff',
        minHeight: '100vh'
      }}>
        {/* テーマ切替 */}
        <div style={{
          position: 'fixed',
          top: '30px',
          right: '30px',
          zIndex: 1000,
          display: 'flex',
          gap: '8px',
          background: 'rgba(0,0,0,0.4)',
          padding: '8px',
          borderRadius: '30px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
        {getAllThemeKeys().map(key => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: theme === key ? `2px solid ${themes[key].primary}` : '2px solid transparent',
                background: themes[key].primary,
                cursor: 'pointer',
                transition: 'all 0.3s',
                opacity: theme === key ? 1 : 0.5
              }}
            />
          ))}
        </div>

        {/* ヒーロー */}
        <section style={{
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: '#1a1a2e'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `scale(${1 + scrollY * 0.0005})`,
            transition: 'transform 0.1s'
          }}>
            <Image 
              src={trainer.hero_image || trainer.photo_url}
              alt={trainer.name}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                opacity: 0.9
              }}
              priority
            />
          </div>
          
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${t.overlay}, transparent)`,
            mixBlendMode: 'multiply',
            opacity: 0.5
          }} />

          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${t.gradientStart} 0%, ${t.gradientEnd} 100%)`,
            opacity: 0.4,
            mixBlendMode: 'screen'
          }} />

          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${scrollY * 0.3}px)`,
            textAlign: 'center',
            width: '100%',
            padding: '20px'
          }}>
            <h1 style={{
              fontSize: 'clamp(60px, 15vw, 200px)',
              fontWeight: '900',
              letterSpacing: '-0.05em',
              margin: 0,
              lineHeight: 0.9,
              textTransform: 'uppercase',
              background: `linear-gradient(135deg, #fff 0%, ${t.primary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {trainer.name.split(' ')[1] || trainer.name}
            </h1>
            <div style={{
              marginTop: '20px',
              fontSize: 'clamp(12px, 2vw, 18px)',
              letterSpacing: '0.5em',
              fontWeight: '300',
              color: t.primary,
              textTransform: 'uppercase'
            }}>
              Voice Trainer / {trainer.area}
            </div>
          </div>
        </section>
                
<ProfileSection trainer={trainer} theme={t} />
                    
<VideoSection trainer={trainer} theme={t} />
          
<MusicSection trainer={trainer} theme={t} />
          
    {/* CTA */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          padding: '100px 20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: 'clamp(40px, 8vw, 100px)',
              fontWeight: '900',
              marginBottom: '60px',
              color: '#fff'
            }}>
              LET'S TALK
            </h2>
            
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              marginBottom: '40px',
              flexWrap: 'wrap'
            }}>
              {[
                { label: 'IG', url: trainer.instagram_url },
                { label: 'X', url: trainer.twitter_url },
                { label: 'YT', url: trainer.youtube_url },
                { label: 'LINE', url: trainer.line_url }
              ].filter(item => item.url).map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{
                  width: '50px',
                  height: '50px',
                  border: `2px solid ${t.primary}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: t.primary,
                  fontSize: '11px',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  fontWeight: '600'
                }}>
                  {item.label}
                </a>
              ))}
            </div>
            
            <a 
              href={trainer.contact}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '25px 80px',
                background: 'transparent',
                border: `2px solid ${t.primary}`,
                color: t.primary,
                fontSize: '14px',
                letterSpacing: '0.3em',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textTransform: 'uppercase',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = t.primary;
                e.target.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = t.primary;
              }}
            >
              Contact
            </a>
          </div>
        </section>
        {/* トップに戻る */}
        {scrollY > 300 && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: t.primary,
              border: 'none',
              color: '#000',
              fontSize: '20px',
              cursor: 'pointer',
              zIndex: 999
            }}
          >
            ↑
          </button>
        )}

        {/* フッター */}
        <footer style={{
          padding: '40px 20px',
          textAlign: 'center',
          borderTop: `1px solid ${t.primary}20`,
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
          background: '#000'
        }}>
          POWERED BY VOCALPAGE
        </footer>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          overflow-x: hidden;
        }
      `}</style>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { data: trainer, error } = await supabase
    .from('trainers')
    .select('*')
    .eq('slug', params.slug)
    .single()
  
  if (error || !trainer) {
    return { notFound: true }
  }
  
  return {
    props: { trainer }
  }
}
