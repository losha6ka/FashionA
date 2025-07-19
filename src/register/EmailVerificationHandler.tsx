import { useEffect, useState } from "react";
import { applyActionCode, getAuth } from "firebase/auth";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./EmailVerificationHandler.css"; // Создаём для стилизации

const EmailVerificationHandler = () => {
    const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Можно взять язык из URL или настроек
    const lang = navigator.language.startsWith("cs") ? "cz" : "en";

    const messages = {
        en: {
            verifying: "Verifying your email...",
            success: "Email successfully verified! Redirecting...",
            error: "Invalid or expired verification link.",
            note: "Note: If you don't see the email, please check your spam folder.",
        },
        cz: {
            verifying: "Ověřujeme vaši e-mailovou adresu...",
            success: "E-mail byl úspěšně ověřen! Přesměrování...",
            error: "Neplatný nebo vypršelý ověřovací odkaz.",
            note: "Poznámka: Pokud e-mail nevidíte, zkontrolujte složku spam.",
        },
    };

    useEffect(() => {
        const mode = searchParams.get("mode");
        const actionCode = searchParams.get("oobCode");

        if (mode === "verifyEmail" && actionCode) {
            const auth = getAuth();
            applyActionCode(auth, actionCode)
                .then(() => {
                    setStatus("success");
                    setTimeout(() => navigate("/success", { state: { language: lang } }), 3000);
                })
                .catch(() => setStatus("error"));
        } else {
            setStatus("error");
        }
    }, [searchParams, navigate, lang]);

    return (
        <div className="verify-page">
            <div className="verify-box">
                <h2>
                    {status === "pending" && messages[lang].verifying}
                    {status === "success" && messages[lang].success}
                    {status === "error" && messages[lang].error}
                </h2>
                {(status === "pending" || status === "success") && (
                    <p className="verify-note">{messages[lang].note}</p>
                )}
            </div>
        </div>
    );
};

export default EmailVerificationHandler;
