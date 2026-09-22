import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useProfileChat } from './useProfileChat';

const theme = createTheme({ palette: { mode: 'light' } });
const suggestions = [
  'Show my profile',
  'What are my roles?',
  'What is my profile endpoint?',
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chat = useProfileChat();
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottom.current?.scrollIntoView({ block: 'end' });
  }, [chat.messages, chat.loading, open]);

  const submit = () => {
    if (!input.trim() || chat.loading) return;
    void chat.send(input);
    setInput('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Fab
        variant="extended"
        color="primary"
        onClick={() => setOpen(true)}
        aria-label="Open profile assistant"
        aria-haspopup="dialog"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: theme.zIndex.fab,
        }}
      >
        Chatbot
      </Fab>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={mobile}
        aria-labelledby="profile-chat-title"
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          },
          '& .MuiDialog-paper': {
            width: mobile ? '100%' : 400,
            height: mobile ? '100%' : 560,
            maxHeight: mobile ? '100%' : 'calc(100dvh - 48px)',
            m: mobile ? 0 : 3,
            textAlign: 'left',
            minWidth: 0,
            minHeight: 0,
          },
        }}
      >
        <DialogTitle id="profile-chat-title" sx={{ fontSize: '1.1rem', pb: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            Profile assistant
            <IconButton
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
            >
              ×
            </IconButton>
          </Stack>
        </DialogTitle>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ px: 3, pb: 2 }}
        >
          Your account information, read-only.
        </Typography>
        <DialogContent dividers sx={{ minHeight: 0, minWidth: 0, px: 2 }}>
          {chat.messages.length === 0 && (
            <Stack spacing={2} sx={{ p: 1 }}>
              <Typography>
                What would you like to know about your account?
              </Typography>
              {suggestions.map(question => (
                <Button
                  key={question}
                  variant="outlined"
                  onClick={() => void chat.send(question)}
                  disabled={chat.loading}
                >
                  {question}
                </Button>
              ))}
              <Typography variant="caption" color="text.secondary">
                Questions are sent to OpenAI. Profile values are read from your
                account and added to the answer by this app. History clears on
                refresh or logout.
              </Typography>
            </Stack>
          )}
          <Stack
            spacing={2}
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
          >
            {chat.messages.map(message => (
              <Box
                key={message.id}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor:
                    message.role === 'user'
                      ? 'action.hover'
                      : 'background.paper',
                  overflowWrap: 'anywhere',
                  '& p': { my: 0.5 },
                  '& ul': { pl: 2.5 },
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </Typography>
                {message.role === 'user' ? (
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.text}
                  </Typography>
                ) : (
                  <ReactMarkdown
                    skipHtml
                    disallowedElements={['img', 'a']}
                    unwrapDisallowed
                  >
                    {message.text}
                  </ReactMarkdown>
                )}
                {message.source && (
                  <Typography variant="caption" color="text.secondary">
                    Source: {message.source}
                  </Typography>
                )}
              </Box>
            ))}
            {chat.loading && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                role="status"
              >
                <CircularProgress size={16} />
                <Typography variant="body2">Checking your question…</Typography>
              </Stack>
            )}
            {chat.error && (
              <Alert
                severity="error"
                action={
                  <Button
                    color="inherit"
                    onClick={() => void chat.send(chat.failedQuestion, true)}
                  >
                    Retry
                  </Button>
                }
              >
                {chat.error}
              </Alert>
            )}
            <div ref={bottom} />
          </Stack>
        </DialogContent>
        <Box
          component="form"
          onSubmit={event => {
            event.preventDefault();
            submit();
          }}
          sx={{ p: 2 }}
        >
          <TextField
            autoFocus
            fullWidth
            multiline
            maxRows={4}
            label="CHATBOT"
            value={input}
            onChange={event => setInput(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 2000 } }}
            onKeyDown={event => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                submit();
              }
            }}
          />
          <DialogActions sx={{ px: 0, pb: 0 }}>
            <Button
              onClick={() => {
                chat.reset();
                setInput('');
              }}
            >
              New chat
            </Button>
            {chat.loading ? (
              <Button onClick={chat.stop}>Stop</Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                disabled={!input.trim()}
              >
                Send
              </Button>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </ThemeProvider>
  );
}
