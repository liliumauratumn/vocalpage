// pages/register.js
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import StepForm from '../components/StepForm'

export default function RegisterPage() {
  // ステップフォームの質問設定
  const questions = [
    {
      id: 'name',
      title: '🎤 お名前を教えてください',
      type: 'text',
      placeholder: '山田太郎',
      required: true
    },
    {
      id: 'email',
      title: '📧 メールアドレスを教えてください',
      type: 'email',
      placeholder: 'name@example.com',
      required: true
    },
    {
      id: 'slug',
      title: '🔗 希望のURL（半角英数字）',
      type: 'text',
      placeholder: 'yamada_taro',
      required: true
    },
    {
      id: 'edit_key',
      title: '🔑 編集用パスワード（4文字以上）',
      type: 'text',
      placeholder: '覚えやすいパスワード',
      required: true
    },
    {
      id: 'edit_key_hint',
      title: '💡 編集キーのヒント（忘れた時用）',
      type: 'text',
      placeholder: '例: 愛犬の名前',
      required: false
    }
  ];

  // メールアドレス正規化関数
  const normalizeEmail = (email) => {
    return email.toLowerCase().replace('@googlemail.com', '@gmail.com');
  };

  // URL重複チェック関数
  const checkUrlAvailability = async (slug) => {
    const { data } = await supabase
      .from('trainers')
      .select('slug')
      .eq('slug', slug);
    
    return data.length === 0; // 0件なら使える
  };

  // メール重複チェック関数
  const checkEmailAvailability = async (email) => {
    const normalized = normalizeEmail(email);
    const { data } = await supabase
      .from('trainers')
      .select('email')
   .eq('email', normalized); // 正規化した形式で検索
  
  return data.length === 0; // 0件なら使える
};

  // フォーム送信時の処理
  const handleComplete = async (answers) => {
    const { error } = await supabase
      .from('trainers')
      .insert({
        slug: answers.slug,
        name: answers.name,
   email: normalizeEmail(answers.email), // 正規化して保存（常に@gmail.com形式）
        edit_key: answers.edit_key.toLowerCase(),
        edit_key_hint: answers.edit_key_hint || null,
        status: 'pending',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('登録エラー:', error);
      alert('エラーが発生しました: ' + error.message);
    } else {
      alert('登録完了！次は画像をアップロードしてください。');
      window.location.href = `/upload/${answers.slug}`;
    }
  };

  return (
    <StepForm 
      questions={questions}
      onComplete={handleComplete}
      onCheckUrl={checkUrlAvailability}
      onCheckEmail={checkEmailAvailability}
      submitButtonText="登録する"
    />
  );
}