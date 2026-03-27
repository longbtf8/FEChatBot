import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthInit from "@/components/AuthInit";
import PrivateRoute from "@/components/PrivateRoute";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VerifyEmail from "@/pages/VerifyEmail";
import NewChat from "@/pages/NewChat";
import Conversation from "@/pages/Conversation";
import { ROUTES } from "@/config/routes";
import "@/App.css";

function App() {
    return (
        <BrowserRouter>
            <AuthInit>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path={ROUTES.LOGIN} element={<Login />} />
                        <Route path={ROUTES.REGISTER} element={<Register />} />
                        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
                        <Route
                            path={ROUTES.NEW_CHAT}
                            element={
                                <PrivateRoute>
                                    <NewChat />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path={ROUTES.CONVERSATION}
                            element={
                                <PrivateRoute>
                                    <Conversation />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                    </Route>
                </Routes>
            </AuthInit>
        </BrowserRouter>
    );
}

export default App;
