import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInput from '@/components/chat/ChatInput';

describe('ChatInput', () => {
  it('renders textarea and send button', () => {
    render(<ChatInput onSend={vi.fn()} />);

    const textarea = screen.getByPlaceholderText(/Type your message/i);
    const button = screen.getByRole('button', { name: /Send/i });

    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('calls onSend when send button is clicked', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={onSend} />);

    const textarea = screen.getByPlaceholderText(/Type your message/i);
    const button = screen.getByRole('button', { name: /Send/i });

    await user.type(textarea, 'Hello world');
    await user.click(button);

    expect(onSend).toHaveBeenCalledWith('Hello world');
  });

  it('clears input after sending', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={onSend} />);

    const textarea = screen.getByPlaceholderText(/Type your message/i) as HTMLTextAreaElement;
    const button = screen.getByRole('button', { name: /Send/i });

    await user.type(textarea, 'Hello');
    await user.click(button);

    expect(textarea.value).toBe('');
  });

  it('sends message on Enter key press', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={onSend} />);

    const textarea = screen.getByPlaceholderText(/Type your message/i);

    await user.type(textarea, 'Hello{Enter}');

    expect(onSend).toHaveBeenCalledWith('Hello');
  });

  it('does not send on Shift+Enter', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={onSend} />);

    const textarea = screen.getByPlaceholderText(/Type your message/i);

    await user.type(textarea, 'Hello{Shift>}{Enter}{/Shift}');

    expect(onSend).not.toHaveBeenCalled();
  });

  it('disables send when disabled prop is true', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={onSend} disabled={true} />);

    const textarea = screen.getByPlaceholderText(/Type your message/i) as HTMLTextAreaElement;
    const button = screen.getByRole('button', { name: /Send/i }) as HTMLButtonElement;

    expect(textarea.disabled).toBe(true);
    expect(button.disabled).toBe(true);
  });

  it('disables button when input is empty', () => {
    render(<ChatInput onSend={vi.fn()} />);

    const button = screen.getByRole('button', { name: /Send/i }) as HTMLButtonElement;

    expect(button.disabled).toBe(true);
  });

  it('enables button when input has text', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={vi.fn()} />);

    const textarea = screen.getByPlaceholderText(/Type your message/i);
    const button = screen.getByRole('button', { name: /Send/i }) as HTMLButtonElement;

    await user.type(textarea, 'Hello');

    expect(button.disabled).toBe(false);
  });

  it('trims whitespace before sending', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={onSend} />);

    const textarea = screen.getByPlaceholderText(/Type your message/i);
    const button = screen.getByRole('button', { name: /Send/i });

    await user.type(textarea, '   Hello world   ');
    await user.click(button);

    expect(onSend).toHaveBeenCalledWith('Hello world');
  });

  it('does not send if only whitespace', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={onSend} />);

    const textarea = screen.getByPlaceholderText(/Type your message/i);
    const button = screen.getByRole('button', { name: /Send/i });

    await user.type(textarea, '   ');

    expect(button).toBeDisabled();
    expect(onSend).not.toHaveBeenCalled();
  });
});
