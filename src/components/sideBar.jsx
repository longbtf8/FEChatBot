import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useChangeToConversation } from "@/hook/useChangeToConversation";
import {
  conversationsApi,
  useGetConversationQuery,
} from "@/store/api/conversationsApi";
import formatTimestamp from "@/utils/formatTimeStamp";
import { useParams } from "react-router-dom";
import socketClient from "@/socketClient";

// Nội dung danh sách dùng chung cho cả desktop và mobile
function SidebarContent({ onItemClick }) {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const {
    data: conversations = [],
    isLoading,
    refetch,
  } = useGetConversationQuery();

  const { user: currentUser } = useSelector((state) => state.auth);
  const { handleClick, isChecking } = useChangeToConversation();
  const { id: conversationId } = useParams();
  const convIdStr = conversations.map((c) => c.id).join(",");

  // Subscribe TẤT CẢ channels — không chỉ channel đang active
  useEffect(() => {
    if (!conversations.length) return;

    const handleUpdate = (newMessage) => {
      dispatch(
        conversationsApi.util.updateQueryData(
          "getConversation",
          undefined,
          (draft) => {
            const index = draft.findIndex(
              (c) => c.id === newMessage.conversation_id,
            );
            if (index !== -1) {
              draft[index].messages[0] = newMessage;
            }
            if (index > 0) {
              const [updateChat] = draft.splice(index, 1);
              draft.unshift(updateChat);
            }
          },
        ),
      );
    };
    const channels = conversations.map((c) => {
      const ch = socketClient.subscribe(`conversation-${c.id}`);
      ch.bind("created", handleUpdate);
      return ch;
    });
    return () => {
      channels.forEach((c) => {
        c.unbind("created", handleUpdate);
      });
    };
  }, [dispatch, convIdStr]);

  const filtered = useMemo(
    () =>
      conversations?.filter(
        (c) =>
          c?.conversationUsers[0].user.email !== currentUser?.email &&
          c?.conversationUsers[0].user.email
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [conversations, currentUser?.email, search],
  );

  const handleUserClick = (e, userId) => {
    handleClick(e, userId);
    onItemClick?.();
  };

  // Refetch khi vào conversation mới chưa có trong list
  useEffect(() => {
    if (!conversationId && isLoading) return;
    const alreadyInList = conversations.some(
      (c) => String(c.id) === String(conversationId),
    );
    if (!alreadyInList) {
      refetch();
    }
  }, [conversationId, conversations, isLoading, refetch, convIdStr]);
  return (
    <>
      {/* Search */}
      <div className="px-3 py-3 border-b border-slate-100">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm user ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-full text-sm border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 transition-all"
          />
        </div>
      </div>
      <p className="pl-2"> Danh sách user</p>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <span className="w-5 h-5 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : filtered?.length === 0 ? (
          <div className="py-10 text-center px-4">
            <p className="text-sm text-slate-400">
              {search ? "Không tìm thấy user nào" : "Chưa có người dùng nào"}
            </p>
          </div>
        ) : (
          <ul className="py-2 px-2 space-y-1">
            {filtered?.map((conversation) => {
              const isActive = conversation?.id == conversationId;

              return (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={(e) =>
                      handleUserClick(
                        e,
                        conversation?.conversationUsers[0]?.user.id,
                      )
                    }
                    disabled={isChecking}
                    className={`w-full px-4 py-3  border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-left disabled:opacity-60 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-[1.02]"
                        : "bg-white"
                    }`}
                  >
                    <span
                      className={`text-slate-800  text-base truncate block font-bold ${isActive ? "text-white" : "text-slate-900"}`}
                    >
                      {conversation?.conversationUsers[0]?.user.email}
                    </span>
                    <span
                      className={`block truncate  ${isActive ? "text-blue-100" : "text-slate-500"}`}
                    >
                      {conversation?.messages[0]?.content}
                    </span>
                    <span>
                      {formatTimestamp(conversation?.messages[0]?.updated_at)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

SidebarContent.propTypes = {
  onItemClick: PropTypes.func,
};

// Sidebar chính: static trên desktop, drawer overlay trên mobile
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* === DESKTOP: static sidebar === */}
      <aside className="hidden md:flex w-80 shrink-0 border-r border-slate-200 bg-white flex-col overflow-hidden">
        <SidebarContent />
      </aside>

      {/* === MOBILE: overlay drawer === */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-14 left-0 bottom-0 z-30 w-72 bg-white flex flex-col overflow-hidden shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header drawer */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-700">
            Danh sách
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Đóng"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <SidebarContent onItemClick={onClose} />
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
