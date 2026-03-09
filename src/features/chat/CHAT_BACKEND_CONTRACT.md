# Chat backend contract (from current codebase)

This file documents only endpoints/events currently referenced in project code.
No new endpoints are assumed.

## REST endpoints currently used

1. `GET /api/messages/current-chats`
   - Used to fetch the conversation list for chat sidebar/dropdown.
   - Expected to return an array of chat requests (possibly nested in `data`, `chats`, or `chat_requests`).

2. `GET /api/messages/{chatRequestId}?limit={n}&order=desc[&next_cursor=...|&created_before=...]`
   - Used for paginated messages inside a selected conversation.
   - Supports cursor-based loading (`next_cursor`).

3. `POST /api/messages/sent`
   - Sends a message as JSON or `multipart/form-data`.
   - Supports text and attachments.

4. `GET /api/messages/mark-as-read/{senderId}`
   - Marks unread messages from a sender as read.

## Realtime events currently used

Private channel format:
- `chat.between.{minUserId}.{maxUserId}`

Events listened:
- `MessageSent`
- `MessageRead`

## Known API gaps for UX

If `GET /api/messages/current-chats` is unavailable or has incompatible shape,
conversation list UX (sidebar/header chat dropdown) cannot be fully rendered.
In that case, backend should expose a stable contract for current conversations
including at least:
- chat request id
- participant names/avatars
- updated_at
- unread count per conversation
- last message preview
