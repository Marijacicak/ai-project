export interface ChatReply {
  message: string;
  source: string | null;
}

export async function askProfileQuestion(
  message: string,
  previousQuestions: string[],
  signal: AbortSignal
): Promise<ChatReply> {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const response = await fetch(`${apiUrl}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: JSON.stringify({
      message,
      previous_questions: previousQuestions.slice(-6),
    }),
    signal,
  });
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.assign('/');
    throw new Error('Your session expired. Please sign in again.');
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      typeof body?.detail === 'string'
        ? body.detail
        : 'The assistant is unavailable. Please try again.'
    );
  }
  if (typeof body?.message !== 'string') {
    throw new Error('The assistant returned an invalid response.');
  }
  return body as ChatReply;
}
