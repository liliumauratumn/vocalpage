import Image from 'next/image'

export default function ProfileSection({ trainer, theme, isPending }) {
  const experienceYears = trainer.career_start_year 
    ? new Date().getFullYear() - trainer.career_start_year
    : trainer.experience_years;

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: '#000',
      padding: '100px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
        alignItems: 'center'
      }}>
     <div style={{
  position: 'relative',
  width: '100%',
  maxWidth: '500px',
  paddingBottom: 'min(120%, 600px)',
  overflow: 'hidden',
  borderRadius: '10px',
  border: `2px solid ${theme.primary}20`,
  background: 'rgba(255,255,255,0.02)'
}}>
  <Image 
    src={trainer.photo_url}
    alt={trainer.name}
    fill
    style={{ 
      objectFit: 'cover',
      filter: isPending ? 'blur(15px)' : 'none'
    }}
  />
  
  {isPending && (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
        backdropFilter: 'blur(10px)'
      }}>
        ⏳
      </div>
      <div style={{
        color: 'rgba(255,255,255,0.8)',
        fontSize: '12px',
        letterSpacing: '0.2em',
        background: 'rgba(0,0,0,0.3)',
        padding: '8px 16px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        画像確認中
      </div>
    </div>
  )}
</div>
          ) : (
            <Image 
              src={trainer.photo_url}
              alt={trainer.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>

        <div style={{
          width: '100%',
          maxWidth: '600px',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: theme.primary,
            marginBottom: '20px',
            textTransform: 'uppercase'
          }}>
            Profile
          </div>
          <div style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.7)',
            fontWeight: '300',
            marginBottom: '40px',
            whiteSpace: 'pre-wrap'
          }}>
            {trainer.bio}
          </div>
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {trainer.genres?.split(',').map((genre, i) => (
              <span key={i} style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                padding: '8px 20px',
                border: `1px solid ${theme.primary}`,
                borderRadius: '2px',
                color: theme.primary,
                textTransform: 'uppercase'
              }}>
                {genre.trim()}
              </span>
            ))}
          </div>
          
          <div style={{
            fontSize: 'clamp(60px, 10vw, 120px)',
            fontWeight: '900',
            color: 'transparent',
            WebkitTextStroke: `1px ${theme.primary}`,
            opacity: 0.3,
            lineHeight: 1,
            marginTop: '40px'
          }}>
            {experienceYears}
            <div style={{
              fontSize: 'clamp(12px, 2vw, 16px)',
              letterSpacing: '0.3em',
              color: theme.primary,
              fontWeight: '300',
              marginTop: '10px',
              WebkitTextStroke: '0'
            }}>
              YEARS EXP
            </div>
          </div>

          {/* レッスン詳細情報 */}
          <div style={{
            marginTop: '60px',
            padding: '30px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '5px',
            fontSize: '14px',
            lineHeight: 2,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '500px'
          }}>
            {trainer.area && (
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <span style={{ color: theme.primary, fontWeight: '600', fontSize: '12px' }}>エリア：</span>
                <span style={{ marginLeft: '8px' }}>{trainer.area}</span>
              </div>
            )}
            
            {trainer.specialties && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: theme.primary, fontWeight: '600', fontSize: '12px', marginBottom: '10px' }}>専門分野</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(Array.isArray(trainer.specialties) ? trainer.specialties : JSON.parse(trainer.specialties || '[]')).map((item, i) => (
                    <span key={i} style={{
                      padding: '6px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${theme.primary}40`,
                      borderRadius: '20px',
                      fontSize: '13px'
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {trainer.lesson_types && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: theme.primary, fontWeight: '600', fontSize: '12px', marginBottom: '10px' }}>レッスン形式</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(Array.isArray(trainer.lesson_types) ? trainer.lesson_types : JSON.parse(trainer.lesson_types || '[]')).map((item, i) => (
                    <span key={i} style={{
                      padding: '6px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${theme.primary}40`,
                      borderRadius: '20px',
                      fontSize: '13px'
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {trainer.price && (
              <div style={{ textAlign: 'center', marginTop: '25px', paddingTop: '20px', borderTop: `1px solid ${theme.primary}20` }}>
                <span style={{ color: theme.primary, fontWeight: '600', fontSize: '12px' }}>料金：</span>
                <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: '500' }}>
                  ¥{Number(trainer.price).toLocaleString('ja-JP')}
                  {trainer.lesson_duration && <span style={{ fontSize: '12px', opacity: 0.7 }}> / {trainer.lesson_duration}分</span>}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}