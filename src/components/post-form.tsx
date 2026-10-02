"use client";

import { useState, type FormEvent } from "react";
import { POST_CONTENT_MAX, POST_TITLE_MAX, postInputSchema, type PostInput } from "@/lib/board";

type PostFormProps = {
  initial?: PostInput;
  submitLabel: string;
  onSubmit: (input: PostInput) => Promise<void>;
  onCancel?: () => void;
};

export function PostForm({ initial, submitLabel, onSubmit, onCancel }: PostFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = postInputSchema.safeParse({ title, content });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(parsed.data);
    } catch (submitError) {
      console.error(submitError);
      setError("저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="post-title" className="text-sm font-medium text-navy-900">
          제목
        </label>
        <input
          id="post-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={POST_TITLE_MAX}
          className="mt-1 block min-h-11 w-full rounded-lg border border-beige-300 bg-white px-3 text-navy-900"
        />
      </div>
      <div>
        <label htmlFor="post-content" className="text-sm font-medium text-navy-900">
          내용
        </label>
        <textarea
          id="post-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={POST_CONTENT_MAX}
          rows={10}
          aria-describedby="post-help"
          className="mt-1 block w-full rounded-lg border border-beige-300 bg-white p-3 text-navy-900"
        />
        <p id="post-help" className="mt-1 text-sm text-navy-500">
          {content.length}/{POST_CONTENT_MAX}자 · 작성자 이름은 가운데를 가려서 공개돼요. 개인정보(연락처 등)는 적지 마세요.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-terracotta-700">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="min-h-11 rounded-full bg-terracotta-600 px-6 font-semibold text-white hover:bg-terracotta-700 disabled:opacity-60"
        >
          {submitting ? "저장 중…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-full border border-navy-900 px-6 font-semibold text-navy-900 hover:bg-navy-900 hover:text-white"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}
