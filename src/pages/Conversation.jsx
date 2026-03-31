import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ROUTES } from "@/config/routes";
import socketClient from "@/socketClient";
import {
  useGetMessagesQuery,
  useCreateMessageMutation,
  conversationsApi,
} from "@/store/api/conversationsApi";
import { getApiErrorMessage } from "@/utils/errors";
import {
  BackLink,
  ErrorAlert,
  MessageBubble,
  PageTitle,
  SubmitButton,
  Textarea,
} from "@/components/ui";

function Conversation() {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { id: conversationId } = useParams();
  const { data } = useGetMessagesQuery(conversationId, {
    skip: !conversationId,
  });
  const messages = data?.messages || [];
  const [createMessage, { isLoading }] = useCreateMessageMutation();

  const messageEndRef = useRef(null);
  const listRef = useRef(null);

  // quận mess khi lần đầu ta chạy

  // Thêm reset isFirstLoad khi đổi conversation
  const isFirstLoad = useRef(true);
  useEffect(() => {
    isFirstLoad.current = true;
  }, [conversationId]);

  useEffect(() => {
    if (isFirstLoad.current && messages.length > 0) {
      messageEndRef.current?.scrollIntoView({ behavior: "instant" });
      isFirstLoad.current = false;
    }
  }, [messages.length]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    const list = listRef.current;
    if (!list) return;
    const distance = list.scrollHeight - list.scrollTop - list.clientHeight;
    //50 bé quá lên em tăng nên 150 để nó quận rõ thấy hơn
    if (distance <= 150) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);
  // realTime soketi
  useEffect(() => {
    if (!conversationId) return;
    const channel = socketClient.subscribe(`conversation-${conversationId}`);
    const handleCreated = (message) => {
      dispatch(
        conversationsApi.util.updateQueryData(
          "getMessages",
          conversationId,
          (draft) => {
            // draft.push(message);
            draft.messages?.push(message);
          },
        ),
      );
    };
    channel.bind("created", handleCreated);
    return () => channel.unbind("created", handleCreated);
  }, [conversationId, dispatch]);

  // submit gửi tin nhắn
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = content;
    setContent("");
    setError("");
    try {
      await createMessage({
        conversationId,
        type: "text",
        content: text,
      }).unwrap();
    } catch (err) {
      setContent(text);
      setError(
        getApiErrorMessage(err, "Không thể gửi tin nhắn. Vui lòng thử lại."),
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mb-4">
        <BackLink to={ROUTES.HOME} />
      </div>

      <PageTitle>Tin nhắn</PageTitle>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        {error && <ErrorAlert className="mb-4">{error}</ErrorAlert>}
        <ul
          className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2"
          ref={listRef}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id}>
              <div className="break-words whitespace-pre-wrap max-w-full">
                {message.content}
              </div>
            </MessageBubble>
          ))}
          <div ref={messageEndRef}></div>
        </ul>
        <div className="flex gap-2 shrink-0">
          <Textarea
            className="flex-1"
            rows={2}
            placeholder="Nhập tin nhắn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <SubmitButton loading={isLoading} loadingText="...">
            Gửi
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}

export default Conversation;
