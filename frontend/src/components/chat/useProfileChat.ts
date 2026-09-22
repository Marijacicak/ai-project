import { useEffect, useRef, useState } from 'react';
import { askProfileQuestion } from '../../services/chat';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  source?: string | null;
}

export function useProfileChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [failedQuestion, setFailedQuestion] = useState('');
  const controller = useRef<AbortController | null>(null);
  const questions = useRef<string[]>([]);

  useEffect(() => () => controller.current?.abort(), []);

  const send = async (input: string, retry = false) => {
    const question = input.trim();
    if (!question || question.length > 2000 || controller.current) return;
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setError('');
    setFailedQuestion('');
    if (!retry) {
      setMessages(current => [
        ...current,
        { id: crypto.randomUUID(), role: 'user', text: question },
      ]);
    }
    try {
      const reply = await askProfileQuestion(
        question,
        questions.current,
        request.signal
      );
      if (request.signal.aborted) return;
      questions.current = [...questions.current, question].slice(-6);
      setMessages(current => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: reply.message,
          source: reply.source,
        },
      ]);
    } catch (cause) {
      if (!request.signal.aborted) {
        setError(cause instanceof Error ? cause.message : 'Unable to send.');
        setFailedQuestion(question);
      }
    } finally {
      if (controller.current === request) {
        controller.current = null;
        setLoading(false);
      }
    }
  };

  const stop = () => {
    controller.current?.abort();
    controller.current = null;
    setLoading(false);
  };

  const reset = () => {
    stop();
    questions.current = [];
    setMessages([]);
    setError('');
    setFailedQuestion('');
  };

  return { messages, loading, error, failedQuestion, send, stop, reset };
}
