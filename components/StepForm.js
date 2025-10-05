// components/StepForm.js
import React, { useState } from 'react';

// ========== 定数・スタイル定義 ==========
const COLORS = {
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: '#00ff88',
  error: '#ff6b6b',
  gray: '#e0e0e0',
  darkGray: '#666',
  white: 'rgba(255,255,255,0.2)',
  feedbackGradient: 'linear-gradient(135deg, #00d4ff, #00ff88)',
  progressGradient: 'linear-gradient(90deg, #FFD700, #FFA500, #FF69B4, #00d4ff, #00ff88)'
};

const ENCOURAGEMENTS = ["いいね!✨", "素晴らしい!🎉", "完璧です!⭐", "その調子!💪", "グッド!👍"];

const baseButton = {
  padding: '18px',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s'
};

const containerStyle = {
  minHeight: '100vh',
  background: COLORS.gradient,
  display: 'flex',
  fontFamily: '"Inter", sans-serif',
  padding: '20px'
};

const cardStyle = {
  background: 'white',
  borderRadius: '20px',
  padding: '50px 40px',
  maxWidth: '600px',
  width: '100%',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
};

const inputStyle = (isValid, hasValue, showError) => ({
  width: '100%',
  padding: '15px',
  fontSize: '18px',
  border: `2px solid ${isValid && hasValue ? COLORS.success : hasValue && !isValid && showError ? COLORS.error : COLORS.gray}`,
  borderRadius: '10px',
  outline: 'none',
  transition: 'border-color 0.3s'
});

// ========== コンポーネント本体 ==========
export default function StepForm({ questions, initialData = {}, onComplete, submitButtonText = '送信', onCheckUrl, onCheckEmail }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialData);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [urlCheckStatus, setUrlCheckStatus] = useState(null); // 'checking' | 'available' | 'unavailable' | null
  const [emailCheckStatus, setEmailCheckStatus] = useState(null); // 'checking' | 'available' | 'unavailable' | null

  const totalQuestions = questions.length;
  const progress = (step / totalQuestions) * 100;
  const currentQuestion = questions[step];

  // バリデーション
  const validateInput = (value, question) => {
    if (!value.trim() && question.required) return false;
    
    if (question.type === 'email') {
      // @の後にドットが含まれているかチェック
      const atIndex = value.indexOf('@');
      if (atIndex === -1 || !value.slice(atIndex).includes('.')) return false;
      
      const basicPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!basicPattern.test(value)) return false;
      const parts = value.split('.');
      return parts[parts.length - 1].length >= 2;
    }
    
    if (question.id === 'slug') return /^[a-z0-9_]+$/i.test(value);
    if (question.id === 'edit_key') return value.trim().length >= 4;
    
    return true;
  };

  const isValid = currentQuestion ? validateInput(currentAnswer, currentQuestion) : true;

  // URL重複チェック（debounce付き）
  const checkUrlDebounce = React.useRef(null);
  
  const checkUrlAvailability = async (slug) => {
    if (!onCheckUrl || !slug.trim() || currentQuestion?.id !== 'slug') return;
    
    // 形式が正しくない場合はチェックしない
    if (!/^[a-z0-9_]+$/i.test(slug)) {
      setUrlCheckStatus(null);
      return;
    }
    
    setUrlCheckStatus('checking');
    
    try {
      const available = await onCheckUrl(slug);
      setUrlCheckStatus(available ? 'available' : 'unavailable');
    } catch (error) {
      console.error('URL check error:', error);
      setUrlCheckStatus(null);
    }
  };

  // メール重複チェック（debounce付き）
  const checkEmailDebounce = React.useRef(null);
  
  const checkEmailAvailability = async (email) => {
    if (!onCheckEmail || !email.trim() || currentQuestion?.type !== 'email') return;
    
    // 形式が正しくない場合はチェックしない
    if (!validateInput(email, currentQuestion)) {
      setEmailCheckStatus(null);
      return;
    }
    
    setEmailCheckStatus('checking');
    
    try {
      const available = await onCheckEmail(email);
      setEmailCheckStatus(available ? 'available' : 'unavailable');
    } catch (error) {
      console.error('Email check error:', error);
      setEmailCheckStatus(null);
    }
  };

  // イベントハンドラー
  const handleInputChange = (value) => {
    setCurrentAnswer(value);
    setShowValidation(false);
    
    // URL重複チェック（500ms後）
    if (currentQuestion?.id === 'slug' && onCheckUrl) {
      setUrlCheckStatus(null);
      if (checkUrlDebounce.current) {
        clearTimeout(checkUrlDebounce.current);
      }
      checkUrlDebounce.current = setTimeout(() => {
        checkUrlAvailability(value);
      }, 500);
    }
    
    // メール重複チェック（500ms後）
    if (currentQuestion?.type === 'email' && onCheckEmail) {
      setEmailCheckStatus(null);
      if (checkEmailDebounce.current) {
        clearTimeout(checkEmailDebounce.current);
      }
      checkEmailDebounce.current = setTimeout(() => {
        checkEmailAvailability(value);
      }, 500);
    }
  };

  const handleNext = () => {
    if (!validateInput(currentAnswer, currentQuestion)) {
      setShowValidation(true);
      return;
    }
    
    // URL重複チェックで使えない場合は進めない
    if (currentQuestion.id === 'slug' && urlCheckStatus === 'unavailable') {
      setShowValidation(true);
      return;
    }
    
    // メール重複チェックで使えない場合は進めない
    if (currentQuestion.type === 'email' && emailCheckStatus === 'unavailable') {
      setShowValidation(true);
      return;
    }
    
    setAnswers({...answers, [currentQuestion.id]: currentAnswer});
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      // マイルストーン表示（40-60%の範囲）
      const progressPercent = ((step + 1) / totalQuestions) * 100;
      if (progressPercent >= 40 && progressPercent <= 60) {
        setShowMilestone(true);
        setTimeout(() => setShowMilestone(false), 2000);
      }
      setStep(step + 1);
      setCurrentAnswer('');
      setShowValidation(false);
      setUrlCheckStatus(null); // リセット
      setEmailCheckStatus(null); // リセット
    }, 800);
  };

  const handleSkip = () => {
    setStep(step + 1);
    setCurrentAnswer('');
    setShowValidation(false);
    setUrlCheckStatus(null); // リセット
    setEmailCheckStatus(null); // リセット
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onComplete(answers);
  };

  // 完了画面
  if (step >= totalQuestions) {
    return (
      <div style={{...containerStyle, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{...cardStyle, maxWidth: '500px', textAlign: 'center', animation: 'scaleIn 0.5s ease-out'}}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ fontSize: '32px', color: '#333', marginBottom: '20px', fontWeight: '700' }}>確認してください</h1>
          
          <div style={{ textAlign: 'left', background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            {questions.map((q) => (
              <div key={q.id} style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', color: COLORS.darkGray, marginBottom: '5px' }}>
                  {q.title.replace(/[🎤🔗📧🔑💡]/g, '').trim()}
                </div>
                <div style={{ fontSize: '16px', color: '#333', fontWeight: '600' }}>
                  {answers[q.id] || '(未入力)'}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={isSubmitting}
            style={{...baseButton, width: '100%', background: isSubmitting ? '#ccc' : COLORS.gradient, 
              color: 'white', cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)', marginBottom: '10px'}}>
            {isSubmitting ? '送信中...' : submitButtonText}
          </button>

          <button onClick={() => { setStep(0); setShowValidation(false); }}
            style={{...baseButton, width: '100%', padding: '15px', background: 'transparent', 
              color: '#667eea', border: '2px solid #667eea', fontSize: '14px'}}>
            ← 修正する
          </button>
        </div>
        <style jsx>{`@keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
      </div>
    );
  }

  // メイン画面
  return (
    <div style={{...containerStyle, flexDirection: 'column', position: 'relative'}}>
      {/* マイルストーン */}
      {showMilestone && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'white', padding: '30px 50px', borderRadius: '15px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)', zIndex: 1000, animation: 'bounce 0.6s ease-out', textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>折り返し地点!</div>
          <div style={{ fontSize: '16px', color: COLORS.darkGray, marginTop: '5px' }}>あと半分です!</div>
        </div>
      )}

      {/* プログレスバー */}
      <div style={{
        background: COLORS.white, padding: '20px', backdropFilter: 'blur(10px)',
        borderBottom: '2px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ color: 'white', fontSize: '16px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              質問 {step + 1} / {totalQuestions}
            </div>
            <div style={{ color: 'white', fontSize: '18px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              {Math.round(progress)}% 🎯
            </div>
          </div>

          <div style={{
            height: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '20px', overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', position: 'relative'
          }}>
            <div style={{
              height: '100%', width: `${progress}%`, background: COLORS.progressGradient, backgroundSize: '200% 100%',
              borderRadius: '20px', transition: 'width 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              boxShadow: '0 0 20px rgba(0,255,136,0.8), inset 0 2px 4px rgba(255,255,255,0.4)',
              animation: 'shimmer 2s linear infinite', position: 'relative'
            }}>
              <div style={{
                position: 'absolute', top: '50%', right: '5px', transform: 'translateY(-50%)',
                fontSize: '16px', animation: 'sparkle 1s ease-in-out infinite'
              }}>✨</div>
            </div>
          </div>

          {progress > 0 && progress < 100 && (
            <div style={{
              marginTop: '8px', textAlign: 'center', color: 'white', fontSize: '13px', fontWeight: '600',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease-out'
            }}>
              {progress < 50 && '🔥 いい調子です!'}
              {progress >= 50 && progress < 75 && '💪 あと少し!'}
              {progress >= 75 && '🎉 もうすぐゴール!'}
            </div>
          )}
        </div>
      </div>

      {/* メインカード */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{
          ...cardStyle,
          animation: showFeedback ? 'shake 0.5s ease-out' : 'slideIn 0.5s ease-out',
          position: 'relative'
        }}>
          {showFeedback && (
            <div style={{
              position: 'absolute', top: '20px', right: '20px', background: COLORS.feedbackGradient,
              color: 'white', padding: '10px 20px', borderRadius: '25px', fontWeight: '600',
              fontSize: '14px', animation: 'fadeIn 0.3s ease-out'
            }}>
              ✓ {ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]}
            </div>
          )}

          <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '30px', fontWeight: '700' }}>
            {currentQuestion.title}
          </h2>

          {currentQuestion.type === 'textarea' ? (
            <textarea value={currentAnswer} onChange={(e) => handleInputChange(e.target.value)}
              placeholder={currentQuestion.placeholder} autoFocus
              style={{...inputStyle(isValid, currentAnswer, showValidation), minHeight: '120px', 
                fontFamily: 'inherit', resize: 'vertical'}} />
          ) : (
            <input type={currentQuestion.type === 'email' ? 'email' : 'text'}
              value={currentAnswer} onChange={(e) => handleInputChange(e.target.value)}
              placeholder={currentQuestion.placeholder} autoFocus
              onKeyPress={(e) => e.key === 'Enter' && isValid && handleNext()}
              style={inputStyle(isValid, currentAnswer, showValidation)} />
          )}

          {/* バリデーションメッセージ */}
          {currentAnswer && !isValid && showValidation && (
            <div style={{ marginTop: '10px', color: COLORS.error, fontSize: '14px', fontWeight: '600', animation: 'fadeIn 0.3s ease-out' }}>
              {currentQuestion.type === 'email' && '✗ 正しいメールアドレスを入力してください(例:name@example.com)'}
              {currentQuestion.id === 'slug' && '✗ 半角英数字とアンダースコア(_)のみ使用できます'}
              {currentQuestion.id === 'edit_key' && '✗ 4文字以上入力してください'}
            </div>
          )}

          {/* URL重複チェック結果 */}
          {currentQuestion.id === 'slug' && currentAnswer && isValid && (
            <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: '600', animation: 'fadeIn 0.3s ease-out' }}>
              {urlCheckStatus === 'checking' && (
                <span style={{ color: '#FFA500' }}>⏳ チェック中...</span>
              )}
              {urlCheckStatus === 'available' && (
                <span style={{ color: COLORS.success }}>✓ このURLは使えます!</span>
              )}
              {urlCheckStatus === 'unavailable' && (
                <span style={{ color: COLORS.error }}>✗ このURLは既に使われています</span>
              )}
            </div>
          )}

          {/* メール重複チェック結果 */}
          {currentQuestion.type === 'email' && currentAnswer && isValid && (
            <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: '600', animation: 'fadeIn 0.3s ease-out' }}>
              {emailCheckStatus === 'checking' && (
                <span style={{ color: '#FFA500' }}>⏳ チェック中...</span>
              )}
              {emailCheckStatus === 'available' && (
                <span style={{ color: COLORS.success }}>✓ このメールアドレスは使えます!</span>
              )}
              {emailCheckStatus === 'unavailable' && (
                <span style={{ color: COLORS.error }}>✗ このメールアドレスは既に登録されています</span>
              )}
            </div>
          )}

          {currentAnswer && isValid && currentQuestion.id !== 'slug' && currentQuestion.type !== 'email' && (
            <div style={{ marginTop: '10px', color: COLORS.success, fontSize: '14px', fontWeight: '600', animation: 'fadeIn 0.3s ease-out' }}>
              ✓ いいですね!
            </div>
          )}

          <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button onClick={handleNext}
              disabled={
                !isValid || 
                (!currentAnswer.trim() && currentQuestion.required) ||
                (currentQuestion.id === 'slug' && urlCheckStatus === 'checking') ||
                (currentQuestion.id === 'slug' && urlCheckStatus === 'unavailable') ||
                (currentQuestion.type === 'email' && emailCheckStatus === 'checking') ||
                (currentQuestion.type === 'email' && emailCheckStatus === 'unavailable')
              }
              style={{
                ...baseButton, flex: 1,
                background: (
                  isValid && 
                  (currentAnswer.trim() || !currentQuestion.required) &&
                  !(currentQuestion.id === 'slug' && urlCheckStatus === 'checking') &&
                  !(currentQuestion.id === 'slug' && urlCheckStatus === 'unavailable') &&
                  !(currentQuestion.type === 'email' && emailCheckStatus === 'checking') &&
                  !(currentQuestion.type === 'email' && emailCheckStatus === 'unavailable')
                ) ? COLORS.gradient : COLORS.gray,
                color: 'white',
                cursor: (
                  isValid && 
                  (currentAnswer.trim() || !currentQuestion.required) &&
                  !(currentQuestion.id === 'slug' && urlCheckStatus === 'checking') &&
                  !(currentQuestion.id === 'slug' && urlCheckStatus === 'unavailable') &&
                  !(currentQuestion.type === 'email' && emailCheckStatus === 'checking') &&
                  !(currentQuestion.type === 'email' && emailCheckStatus === 'unavailable')
                ) ? 'pointer' : 'not-allowed',
                boxShadow: (
                  isValid && 
                  (currentAnswer.trim() || !currentQuestion.required) &&
                  !(currentQuestion.id === 'slug' && urlCheckStatus === 'checking') &&
                  !(currentQuestion.id === 'slug' && urlCheckStatus === 'unavailable') &&
                  !(currentQuestion.type === 'email' && emailCheckStatus === 'checking') &&
                  !(currentQuestion.type === 'email' && emailCheckStatus === 'unavailable')
                ) ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
              }}>
              {(currentQuestion.id === 'slug' && urlCheckStatus === 'checking') || 
               (currentQuestion.type === 'email' && emailCheckStatus === 'checking') 
                ? 'チェック中...' : '次へ →'}
            </button>

            {!currentQuestion.required && (
              <button onClick={handleSkip}
                style={{...baseButton, padding: '18px 30px', background: 'transparent', 
                  color: '#667eea', border: '2px solid #667eea', fontSize: '14px'}}>
                スキップ
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounce { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.1); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes sparkle { 0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); } 50% { opacity: 0.5; transform: translateY(-50%) scale(1.3); } }
      `}</style>
    </div>
  );
}