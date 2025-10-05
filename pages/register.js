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
    }
  ];

  // URL重複チェック関数
  const checkUrlAvailability = async (slug) => {
    const { data } = await supabase
      .from('trainers')
      .select('slug')
      .eq('slug', slug)
      .single();
    
    return !data; // dataがなければ使える
  };

  // フォーム送信時の処理
  const handleComplete = async (answers) => {
    const { error } = await supabase
      .from('trainers')
      .insert({
        slug: answers.slug,
        name: answers.name,
        email: answers.email,
        edit_key: answers.edit_key.toLowerCase(),
        status: 'pending'
      });

    if (error) {
      alert('エラーが発生しました');
    } else {
      alert('登録完了！');
      window.location.href = `/upload/${answers.slug}`;
    }
  };

  return (
    <StepForm 
      questions={questions}
      onComplete={handleComplete}
      onCheckUrl={checkUrlAvailability}
      submitButtonText="登録する"
    />
  );
}