import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, reload } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Принимаем данные формы + язык из состояния навигации
    const { email, hotel, country, language } = location.state || {};
    const [isVerified, setIsVerified] = useState(false);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState("");

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID!;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID!;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY!;
    const googleMacros =
        "https://script.google.com/macros/s/AKfycbxHPiTsu3Z0LCqYyNAwc-bW_FLn7EDjJ-KxWO94yfxOjfEq_6AOr5aWf9Ru0fPlk1XY-A/exec";

    const checkEmailVerified = async () => {
        setChecking(true);
        const user = auth.currentUser;
        if (user) {
            await reload(user);
            if (user.emailVerified) {
                setIsVerified(true);
                try {
                    await emailjs.send(
                        SERVICE_ID,
                        TEMPLATE_ID,
                        {
                            email,
                            hotel,
                            country,
                            image1:
                                "https://res.cloudinary.com/dgpf7hqht/image/upload/v1752611368/photo_2025-07-15_18-59-19_tx76zx.jpg",
                            image2:
                                "https://res.cloudinary.com/dgpf7hqht/image/upload/v1752611360/image_2025-07-15_18-00-42_d2hst8.png",
                        },
                        PUBLIC_KEY
                    );
                    void fetch(googleMacros, {
                        method: "POST",
                        body: JSON.stringify({ email, hotel, country }),
                    });


                    navigate("/success", { state: { language } });
                } catch (err) {
                    setError(
                        language === "en"
                            ? "Failed to send final confirmation"
                            : "Chyba při odesílání potvrzení"
                    );
                    console.error(err);
                }
            } else {
                setError("");
            }
        }
        setChecking(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) navigate("/");
        });
        return unsubscribe;
    }, [navigate]);

    return (
        <div className="verify-email">
            <h2 className="verify-email__title">
                {language === "en" ? "Please verify your email" : "Prosím, potvrďte svůj email"}
            </h2>
            <p className="verify-email__text">
                {language === "en"
                    ? `A verification email was sent to ${email}. Please check your inbox.`
                    : `Potvrzovací e-mail byl odeslán na adresu ${email}.`}
            </p>
            <button
                className="verify-email__button"
                onClick={checkEmailVerified}
                disabled={checking || isVerified}
            >
                {checking
                    ? language === "en"
                        ? "Checking..."
                        : "Kontrola..."
                    : isVerified
                        ? language === "en"
                            ? "Verified!"
                            : "Potvrzeno!"
                        : language === "en"
                            ? "I've verified my email"
                            : "Potvrdil jsem e-mail"}
            </button>
            {error && <p className="verify-email__error">{error}</p>}
        </div>
    );
};

export default VerifyEmail;
