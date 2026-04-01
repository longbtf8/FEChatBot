import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  PageTitle,
  SubmitButton,
  Textarea,
} from "@/components/ui";
import toast from "react-hot-toast";
import useChatScroll from "@/hook/useChatScroll";

function Conversation() {
  const dispatch = useDispatch();
  const { id: conversationId } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const LIMIT = 30;
  //state
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  //innit
  const queryArg = { id: conversationId, limit: LIMIT };
  const [createMessage, { isLoading }] = useCreateMessageMutation();
  const { data: initialData } = useGetMessagesQuery(queryArg, {
    skip: !conversationId,
  });
  // xử lý quận
  const {
    messages,
    setMessages,
    messageEndRef,
    isNearBottomRef,
    setNewMsgCount,
    isFetchingOlder,
    listRef,
    newMsgCount,
  } = useChatScroll(conversationId, initialData);

  // realTime soketi
  useEffect(() => {
    if (!conversationId) return;
    const channel = socketClient.subscribe(`conversation-${conversationId}`);
    const handleCreated = (message) => {
      const isMe = message.user.email === currentUser?.email;
      setMessages((prev) => [...prev, message]);
      dispatch(
        conversationsApi.util.updateQueryData(
          "getMessages",
          queryArg,
          (draft) => {
            // draft.push(message);
            draft.messages?.push(message);
          },
        ),
      );
      // Nếu là mình gửi, chủ động cuộn xuống dưới cùng
      if (isMe) {
        setTimeout(() => {
          messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        // Nếu người khác gửi:
        if (isNearBottomRef.current) {
          // Nếu đang ở sát đáy thì cuộn theo tin mới
          messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
          // Nếu đang ở lửng lơ phía trên thì CHỈ hiện badge đếm
          setNewMsgCount((prev) => prev + 1);
        }
      }
    };
    channel.bind("created", handleCreated);
    return () => channel.unbind("created", handleCreated);
  }, [conversationId, dispatch]);

  // submit gửi tin nhắn
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) {
      toast.error("Vui lòng nhập nội dung tin nhắn!");
      return; // Dừng hàm tại đây, không gọi API
    }
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
          className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2 flex-col"
          ref={listRef}
        >
          {/* Thẻ spacer này sẽ đẩy tin nhắn xuống đáy nếu danh sách ngắn */}
          <div className="flex-grow" />

          {isFetchingOlder && (
            <li className="text-center text-xs text-gray-400">Đang tải...</li>
          )}
          {messages.map((message) => {
            const isMe = message.user.email === currentUser?.email;
            return (
              <li
                key={message.id}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {!isMe && (
                    <div className="text-xs font-bold mb-1 text-gray-500">
                      {message.user.name || message.user.email}
                    </div>
                  )}

                  <div className="break-words whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </li>
            );
          })}
          <div ref={messageEndRef}></div>
        </ul>

        {newMsgCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setNewMsgCount(0);
              messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all animate-bounce flex items-center gap-2"
          >
            <span>{newMsgCount} tin nhắn mới</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 13l-7 7-7-7"
              />
            </svg>
          </button>
        )}
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
