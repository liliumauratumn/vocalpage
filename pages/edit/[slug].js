// pages/edit/[slug].js - 美しい編集ページ
// トレーナー情報編集ページ

import { useState } from 'react'

export default function EditPage() {
  const [step, setStep] = useState('auth')
  const [editKey, setEditKey] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [formData, setFormData] = useState({
    name: '山田太郎',
    area: '渋谷',
    bio: 'ボイストレーナー歴10年。ポップスからR&Bまで幅広く指導しています。初心者の方から、プロを目指す方まで丁寧に指導します。',
    specialties: ['ポップス', 'R&B', 'ジャズ'],
    lesson_types: ['マンツーマン', 'オンライン'],
    career_start_year: '2015',
    price: '5000',
    lesson_duration: '60',
    youtube_url: 'https://youtube.com/example',
    website_url: '',
    instagram_url: 'https://instagram.com/yamada',
    twitter_url: 'https://x.com/yamada',
    line_url: 'https://line.me/yamada',
    contact: 'yamada@example.com'
  })

  const [originalData, setOriginalData] = useState({})

  const genreOptions = [
    'ポップス', 'ロック', 'ジャズ', 'クラシック', 'ミュージカル',
    'R&B', 'ソウル', 'ボサノバ', 'アニソン', 'K-POP',
    'ボカロ', '歌い手', 'Vtuber', 'メタル', 'パンク',
    'フォーク', '演歌', 'その他'
  ]

  const lessonTypeOptions = [
    'マンツーマン', 'グループレッスン', 'オンライン', '出張レッスン'
  ]

  const handleAuth = () => {
    if (editKey.toLowerCase() === 'test') {
      setStep('edit')
      setError('')
      setOriginalData({...formData})
    } else {
      setError('編集キーが正しくありません')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setHasChanges(true)
  }

  const toggleItem = (field, item) => {
    const current = formData[field] || []
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item]
    
    setFormData({
      ...formData,
      [field]: updated
    })
    setHasChanges(true)
  }

  const handleImageEditClick = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        '⚠️ 保存していない変更があります。\n' +
        '画像編集ページに移動すると、入力内容が失われます。\n\n' +
        '本当に移動しますか？'
      )
      if (confirmLeave) {
        alert('画像編集ページ (/upload/yamada) へ移動します')
      }
    } else {
      alert('画像編集ページ (/upload/yamada) へ移動します')
    }
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setHasChanges(false)
      setOriginalData({...formData})
    }, 1500)
  }

  if (step === 'auth') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Inter", -apple-system, sans-serif'
      }}>
        <div style={{
          maxWidth: '420px',
          width: '100%',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          padding: '50px 40px',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{ 
            fontSize: '36px', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700'
          }}>
            プロフィール編集
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginBottom: '50px' }}>
            yamada 様
          </p>

          <label style={{
            display: 'block',
            color: '#00d4ff',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '12px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            編集キー
          </label>
          <input
            type="password"
            value={editKey}
            onChange={(e) => setEditKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            placeholder='編集キーを入力'
            style={{
              width: '100%',
              padding: '16px 20px',
              background: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              marginBottom: '20px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />

          {error && (
            <div style={{
              padding: '14px 18px',
              background: 'rgba(255,59,48,0.15)',
              borderRadius: '10px',
              border: '1px solid rgba(255,59,48,0.3)',
              color: '#ff6b6b',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleAuth}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 10px 30px rgba(102,126,234,0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 15px 40px rgba(102,126,234,0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 10px 30px rgba(102,126,234,0.3)'
            }}
          >
            ログイン
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 100%)',
      color: '#fff',
      padding: '60px 20px',
      fontFamily: '"Inter", -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: '50px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '42px', 
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700'
          }}>
            プロフィール編集
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>
            yamada 様
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          padding: '50px',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          {/* 画像編集 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(102,126,234,0.1) 100%)',
            border: '2px solid rgba(0,212,255,0.2)',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '30px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={handleImageEditClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,212,255,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#00d4ff' }}>
                  📷 プロフィール画像・ヒーロー画像
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                  画像の変更はこちら
                </div>
              </div>
              <div style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
                color: '#000',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600'
              }}>
                画像編集 →
              </div>
            </div>
          </div>

          {/* 上部保存ボタン */}
          <div style={{ marginBottom: '50px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%',
                padding: '18px',
                background: saving 
                  ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                backgroundSize: '200% 100%',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: saving ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: saving 
                  ? '0 8px 30px rgba(74,222,128,0.4)' 
                  : '0 8px 30px rgba(102,126,234,0.3)',
                animation: saving ? 'none' : 'gradientShift 3s ease infinite'
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 12px 40px rgba(102,126,234,0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 8px 30px rgba(102,126,234,0.3)'
                }
              }}
            >
              {saving ? '✓ 保存しました' : '保存する'}
            </button>
          </div>

          <div style={{ display: 'grid', gap: '40px' }}>
            {/* 基本情報セクション */}
            <Section title="基本情報">
              <InputField
                label="名前"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <InputField
                label="活動エリア"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="渋谷、新宿、オンライン専門 など"
              />

              <TextareaField
                label="自己紹介"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={6}
                placeholder="あなたの経歴、指導方針、得意分野などを記入してください"
              />

              <InputField
                label="指導開始年"
                name="career_start_year"
                value={formData.career_start_year}
                onChange={handleChange}
                placeholder="2015"
              />
            </Section>

            {/* 専門分野 */}
            <Section title="専門分野">
              <TagSelector
                label="得意ジャンル"
                options={genreOptions}
                selected={formData.specialties || []}
                onToggle={(item) => toggleItem('specialties', item)}
              />

              <TagSelector
                label="レッスン形式"
                options={lessonTypeOptions}
                selected={formData.lesson_types || []}
                onToggle={(item) => toggleItem('lesson_types', item)}
              />
            </Section>

            {/* 料金 */}
            <Section title="料金設定">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InputField
                  label="料金（円）"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="5000"
                />
                
                <InputField
                  label="レッスン時間（分）"
                  name="lesson_duration"
                  value={formData.lesson_duration}
                  onChange={handleChange}
                  placeholder="60"
                />
              </div>
            </Section>

            {/* SNS・連絡先 */}
            <Section title="SNS・連絡先">
              <InputField
                label="YouTube URL"
                name="youtube_url"
                value={formData.youtube_url}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
              />

              <InputField
                label="公式サイト"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="https://..."
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InputField
                  label="Instagram"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                />
                
                <InputField
                  label="X (Twitter)"
                  name="twitter_url"
                  value={formData.twitter_url}
                  onChange={handleChange}
                  placeholder="https://x.com/..."
                />
              </div>

              <InputField
                label="LINE"
                name="line_url"
                value={formData.line_url}
                onChange={handleChange}
                placeholder="https://line.me/..."
              />

              <InputField
                label="連絡先"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="メールアドレスまたはLINE ID"
              />
            </Section>
          </div>

          {/* 保存ボタン */}
          <div style={{ marginTop: '60px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%',
                padding: '20px',
                background: saving 
                  ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                backgroundSize: '200% 100%',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: saving ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: saving 
                  ? '0 10px 40px rgba(74,222,128,0.4)' 
                  : '0 10px 40px rgba(102,126,234,0.3)',
                animation: saving ? 'none' : 'gradientShift 3s ease infinite'
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.target.style.transform = 'translateY(-3px)'
                  e.target.style.boxShadow = '0 15px 50px rgba(102,126,234,0.5)'
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 10px 40px rgba(102,126,234,0.3)'
                }
              }}
            >
              {saving ? '✓ 保存しました' : '保存する'}
            </button>

            <style>{`
              @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a
                href="#"
                style={{
                  color: '#00d4ff',
                  fontSize: '15px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                自分のページを見る →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// セクションコンポーネント
function Section({ title, children }) {
  return (
    <div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '24px',
        color: '#fff',
        paddingBottom: '12px',
        borderBottom: '2px solid rgba(255,255,255,0.1)'
      }}>
        {title}
      </h2>
      <div style={{ display: 'grid', gap: '24px' }}>
        {children}
      </div>
    </div>
  )
}

// 入力フィールドコンポーネント
function InputField({ label, name, value, onChange, placeholder, required }) {
  return (
    <div>
      <label style={{
        display: 'block',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '10px'
      }}>
        {label} {required && <span style={{ color: '#00d4ff' }}>*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 18px',
          background: 'rgba(255,255,255,0.05)',
          border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          color: '#fff',
          fontSize: '15px',
          boxSizing: 'border-box',
          outline: 'none',
          transition: 'all 0.3s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#00d4ff'
          e.target.style.background = 'rgba(0,212,255,0.05)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255,255,255,0.1)'
          e.target.style.background = 'rgba(255,255,255,0.05)'
        }}
      />
    </div>
  )
}

// テキストエリアコンポーネント
function TextareaField({ label, name, value, onChange, rows, placeholder }) {
  return (
    <div>
      <label style={{
        display: 'block',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '10px'
      }}>
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 18px',
          background: 'rgba(255,255,255,0.05)',
          border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          color: '#fff',
          fontSize: '15px',
          fontFamily: '"Inter", -apple-system, sans-serif',
          resize: 'vertical',
          boxSizing: 'border-box',
          outline: 'none',
          transition: 'all 0.3s ease',
          lineHeight: '1.6'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#00d4ff'
          e.target.style.background = 'rgba(0,212,255,0.05)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255,255,255,0.1)'
          e.target.style.background = 'rgba(255,255,255,0.05)'
        }}
      />
    </div>
  )
}

// タグセレクターコンポーネント
function TagSelector({ label, options, selected, onToggle }) {
  return (
    <div>
      <label style={{
        display: 'block',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '14px'
      }}>
        {label}
      </label>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {options.map(option => {
          const isSelected = selected.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              style={{
                padding: '12px 24px',
                background: isSelected 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'rgba(255,255,255,0.05)',
                border: isSelected 
                  ? '2px solid transparent' 
                  : '2px solid rgba(255,255,255,0.15)',
                borderRadius: '30px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: isSelected ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                boxShadow: isSelected ? '0 4px 15px rgba(102,126,234,0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.target.style.background = 'rgba(255,255,255,0.08)'
                  e.target.style.transform = 'translateY(-2px)'
                } else {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)'
                  e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.target.style.background = 'rgba(255,255,255,0.05)'
                  e.target.style.transform = 'translateY(0)'
                } else {
                  e.target.style.transform = 'translateY(0) scale(1)'
                  e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)'
                }
              }}
            >
              {option}
            </button>
          )
        })}
      </div>
      <p style={{ 
        fontSize: '13px', 
        color: 'rgba(255,255,255,0.4)', 
        marginTop: '12px' 
      }}>
        選択中: {selected.length}件
      </p>
    </div>
  )
}