import { useLocation } from "react-router-dom";
import { useGetUsersQuery } from "@/store/api/usersApi";
import { PageTitle, Spinner, UserCard } from "@/components/ui";
import { useSelector } from "react-redux";
import { useChangeToConversation } from "@/hook/useChangeToConversation";

function Home() {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { state } = useLocation();
  const { handleClick } = useChangeToConversation();
  return (
    <div className="max-w-2xl mx-auto p-6">
      {state?.message && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm">
          {state.message}
        </div>
      )}

      <PageTitle>Chọn người để chat</PageTitle>

      {isLoading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <Spinner size="sm" />
          Đang tải...
        </div>
      ) : users.length === 0 ? (
        <p className="text-slate-500 py-8">Chưa có người dùng nào.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => {
            if (user.email !== currentUser?.email) {
              return (
                <li
                  key={user.id}
                  onClick={(e) => {
                    handleClick(e, user.id);
                  }}
                >
                  <UserCard
                    // to={newChatUrl(user.id)}
                    to={"#"}
                  >
                    <span className="text-slate-800 font-medium">
                      {user.email}
                    </span>
                  </UserCard>
                </li>
              );
            }
          })}
        </ul>
      )}
    </div>
  );
}

export default Home;
