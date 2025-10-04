import { useState } from 'react'
import { getTheme } from '../lib/themes'

export default function UploadSuccess({ trainerName, pageUrl, themeColor = 'blue', wasUpdate = false }) {
  const [copied, setCopied] = useState(false)
  const theme = getTheme(themeColor)

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform) => {
    const text = wasUpdate 
      ? `${trainerName}のページを更新しました！`
      : `${trainerName}のページが誕生しました！`
    const encodedUrl = encodeURIComponent(pageUrl)
    const encodedText = encodeURIComponent(text)

    const urls = {
      X: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      LINE: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
      FB: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Inter", -apple-system, sans-serif',
      position: 'relative',
      padding: '40px 20px'
    }}>
      {/* 背景グラデーション */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${theme.gradientStart}15 0%, ${theme.gradientEnd}15 100%)`,
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '800px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* 小さな完了メッセージ */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'fadeIn 0.6s ease-out'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 20px',
            borderRadius: '50%',
            border: `2px solid ${theme.primary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.05em'
          }}>
            {wasUpdate ? '画像を更新しました' : 'あなたのページが誕生しました'}
          </div>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '8px'
          }}>
            {trainerName} 様
          </div>
        </div>

        {/* URLが主役 */}
        <div style={{
          marginBottom: '50px',
          animation: 'fadeIn 0.8s ease-out 0.2s backwards'
        }}>
          <div style={{
            textAlign: 'center',
            fontSize: '13px',
            color: theme.primary,
            marginBottom: '20px',
            letterSpacing: '0.1em',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            あなたの公式ページURL
          </div>

          {/* URLを大きく表示（色相回転） */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: `2px solid ${theme.primary}40`,
            borderRadius: '12px',
            padding: '30px 25px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe, #00f2fe, #667eea)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: 'clamp(18px, 4vw, 28px)',
              fontWeight: '700',
              wordBreak: 'break-all',
              lineHeight: '1.5',
              marginBottom: '25px',
              animation: 'colorShift 3s ease-in-out infinite alternate'
            }}>
              {pageUrl}
            </div>

            <button
              onClick={handleCopy}
              style={{
                background: 'transparent',
                border: `1px solid ${copied ? '#4caf50' : 'rgba(255,255,255,0.2)'}`,
                color: copied ? '#4caf50' : 'rgba(255,255,255,0.5)',
                padding: '10px 25px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
                letterSpacing: '0.05em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!copied) {
                  e.target.style.color = 'rgba(255,255,255,0.7)'
                  e.target.style.borderColor = 'rgba(255,255,255,0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.target.style.color = 'rgba(255,255,255,0.5)'
                  e.target.style.borderColor = 'rgba(255,255,255,0.2)'
                }
              }}
            >
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  コピーしました
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  URLをコピー
                </>
              )}
            </button>
          </div>

          {/* 確認中メッセージ */}
          <div style={{
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '10px',
            padding: '18px',
            fontSize: '13px',
            lineHeight: '1.7'
          }}>
            <div style={{
              color: '#ffa726',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              画像は確認中です
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.7)'
            }}>
              {wasUpdate 
                ? '新しい画像は3〜7営業日以内に確認し、承認されると表示されます。'
                : '画像は3〜7営業日以内に確認・承認されます。ページはすぐにご覧いただけます。'
              }
            </div>
          </div>
        </div>

        {/* 色相回転する楽しいボタン */}
        <div style={{
          marginBottom: '40px',
          animation: 'fadeIn 1s ease-out 0.4s backwards'
        }}>
          <a
            href={pageUrl}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '20px',
              background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe, #00f2fe, #667eea)',
              backgroundSize: '300% 100%',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '17px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              transition: 'all 0.3s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              animation: 'colorShift 3s ease-in-out infinite alternate'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 30px rgba(0,0,0,0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            自分のページを見る
          </a>
        </div>

        {/* SNSシェア */}
        <div style={{
          animation: 'fadeIn 1.2s ease-out 0.6s backwards'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
            fontWeight: '500'
          }}>
            みんなに知らせる
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px'
          }}>
            {['X', 'LINE', 'FB'].map((label) => (
              <button
                key={label}
                onClick={() => handleShare(label)}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: `1px solid ${theme.primary}30`,
                  background: 'transparent',
                  color: theme.primary,
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = `1px solid ${theme.primary}`
                  e.target.style.background = `${theme.primary}15`
                  e.target.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.border = `1px solid ${theme.primary}30`
                  e.target.style.background = 'transparent'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes colorShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}