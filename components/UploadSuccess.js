import { useState } from 'react'

export default function UploadSuccessScreen() {
  const [copied, setCopied] = useState(false)
  const pageUrl = 'https://vocalpage.net/yamada'
  const trainerName = '山田太郎'
  
  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleShare = (platform) => {
    const text = `私の公式ページができました！\n${pageUrl}`
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      line: `https://line.me/R/msg/text/?${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
    }
    window.open(urls[platform], '_blank')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Inter", -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 紙吹雪エフェクト */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        animation: 'confetti 3s ease-out'
      }}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              background: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'][i % 4],
              top: '-10px',
              left: `${Math.random() * 100}%`,
              animation: `fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s`,
              opacity: 0
            }}
          />
        ))}
      </div>

      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: '#fff',
        borderRadius: '20px',
        padding: '60px 40px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* 成功アイコン */}
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '50%',
          margin: '0 auto 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'bounce 0.6s ease-out'
        }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        {/* タイトル */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#333',
          marginBottom: '15px',
          animation: 'fadeInUp 0.6s ease-out 0.2s backwards'
        }}>
          🎉 ページが完成しました！
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '40px',
          animation: 'fadeInUp 0.6s ease-out 0.3s backwards'
        }}>
          {trainerName} 様
        </p>

        {/* URLボックス */}
        <div style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '30px',
          animation: 'fadeInUp 0.6s ease-out 0.4s backwards'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#667eea',
            fontWeight: '600',
            marginBottom: '12px',
            letterSpacing: '1px'
          }}>
            🌐 あなたの公式ページURL
          </p>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            border: '2px solid #667eea',
            wordBreak: 'break-all'
          }}>
            <a href={pageUrl} style={{
              color: '#667eea',
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              {pageUrl}
            </a>
          </div>
          <button
            onClick={handleCopy}
            style={{
              width: '100%',
              padding: '12px',
              background: copied ? '#4ecdc4' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {copied ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                コピーしました！
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                URLをコピー
              </>
            )}
          </button>
        </div>

        {/* 注意書き */}
        <div style={{
          background: '#fff9e6',
          border: '2px solid #ffd93d',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left',
          animation: 'fadeInUp 0.6s ease-out 0.5s backwards'
        }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            📷 <strong>画像は確認中です</strong>
          </p>
          <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>
            登録いただいた画像は1〜3営業日以内に確認し、承認されると表示されます。ページ自体はすぐにご覧いただけます。
          </p>
        </div>

        {/* アクションボタン群 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          animation: 'fadeInUp 0.6s ease-out 0.6s backwards'
        }}>
          <a
            href={pageUrl}
            style={{
              padding: '18px',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            自分のページを見る
          </a>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px'
          }}>
            <button
              onClick={() => handleShare('twitter')}
              style={{
                padding: '12px',
                background: '#1DA1F2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              🐦 X
            </button>
            <button
              onClick={() => handleShare('line')}
              style={{
                padding: '12px',
                background: '#00B900',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              💬 LINE
            </button>
            <button
              onClick={() => handleShare('facebook')}
              style={{
                padding: '12px',
                background: '#1877F2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              📘 FB
            </button>
          </div>
        </div>

        {/* フッター */}
        <p style={{
          marginTop: '40px',
          fontSize: '13px',
          color: '#999',
          animation: 'fadeInUp 0.6s ease-out 0.7s backwards'
        }}>
          ページの編集は <a href={`/upload/yamada`} style={{ color: '#667eea', textDecoration: 'none' }}>こちら</a> からいつでも可能です
        </p>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes confetti {
          0% { opacity: 0; }
          10% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}