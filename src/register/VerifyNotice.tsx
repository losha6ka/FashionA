import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { reload, onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import emailjs from "emailjs-com";

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const form = location.state?.form;
    const email = form?.email;
    const hotel = form?.hotel;
    const country = form?.country;
    const language = location.state?.language;

    const [isVerified, setIsVerified] = useState(false);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState("");

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID!;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID!;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY!;
    const googleMacros =
        "https://script.google.com/macros/s/AKfycbxHPiTsu3Z0LCqYyNAwc-bW_FLn7EDjJ-KxWO94yfxOjfEq_6AOr5aWf9Ru0fPlk1XY-A/exec";

    const checkEmailVerified = async () => {
        if (isVerified) return;

        setChecking(true);
        const user = auth.currentUser;
        if (user) {
            await reload(user);
            if (user.emailVerified) {
                setIsVerified(true);
                try {
                    // EmailJS
                    if (!email) {
                        console.warn("Email is missing, skipping EmailJS send");
                        return;
                    }

                    // await emailjs.send(
                    //     SERVICE_ID,
                    //     TEMPLATE_ID,
                    //     {
                    //         email,
                    //         hotel,
                    //         country,
                    //         image1:
                    //             "https://res.cloudinary.com/dgpf7hqht/image/upload/v1752611368/photo_2025-07-15_18-59-19_tx76zx.jpg",
                    //         image2:
                    //             "https://res.cloudinary.com/dgpf7hqht/image/upload/v1752611360/image_2025-07-15_18-00-42_d2hst8.png",

                    //     },
                    //     PUBLIC_KEY
                    // );

                    // Firestore
                    await addDoc(collection(db, "registrations"), {
                        email,
                        hotel,
                        country,
                        timestamp: new Date(),
                    });

                    // Google Sheets
                    void fetch(googleMacros, {
                        method: "POST",
                        body: JSON.stringify({ email, hotel, country }),
                    });

                    navigate("/success", { state: { language } });
                } catch (err) {
                    console.error(err);
                    setError(
                        language === "en"
                            ? "Final confirmation failed"
                            : "Chyba při odesílání potvrzení"
                    );
                }
            } else {
                setError("");
            }
        }
        setChecking(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/");
            } else {
                // const interval = setInterval(checkEmailVerified, 3000);
                // return () => clearInterval(interval);
            }
        });
        return unsubscribe;
    }, [navigate]);

    return (
        <div className="verify-email">
            <h2 className="verify-email__title">
                {language === "en"
                    ? "Please verify your email"
                    : "Prosím, potvrďte svůj email"}
            </h2>
            <p className="verify-email__text">
                {language === "en"
                    ? `A verification email was sent to ${email}. Please check your inbox (or spam folder).`
                    : `Potvrzovací e-mail byl odeslán na adresu ${email}. Zkontrolujte schránku nebo spam.`}
            </p>
            <button
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
