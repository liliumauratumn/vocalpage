import { supabase } from '../lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import TextPressure from '../components/ui/TextPressure'

export default function Home({ trainers }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: '"Inter", -apple-system, sans-serif'
    }}>
     <div style={{ height: '200px',
     
     width: '90vw',           // ← 追加：画面幅の90%
  maxWidth: '1000px',  
     
      marginBottom: '20px' }}>
  <TextPressure
    text="VocalPage"
     flex={true}
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
              <div style={{
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
              }}>
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