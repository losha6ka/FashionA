import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import logo from "../../img/fapo_logo1.png";
import bg from "../../img/fapo_hero_desktop.jpg";
import LanguageSelect from "./LangSelect";

interface Country {
    name: { common: string };
}

const RegistrationForm = () => {
    const [form, setForm] = useState({
        email: "",
        hotel: "",
        country: "",
    });
    const [error, setError] = useState("");
    const [countries, setCountries] = useState<Country[]>([]);
    const navigate = useNavigate();
    const [language, setLanguage] = useState("en");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all?fields=name")
            .then((r) => r.json())
            .then((data) =>
                setCountries(
                    data.sort((a: Country, b: Country) =>
                        a.name.common.localeCompare(b.name.common)
                    )
                )
            )
            .catch(console.error);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const ref = collection(db, "users");

        if (!form.email || !form.hotel || !form.country) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }

        const emailSnap = await getDocs(query(ref, where("email", "==", form.email)));

        if (emailSnap.size > 0) {
            setError("User with this email already exists");
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                form.email,
                "temporaryPass123!"
            );

            // Отправляем письмо для подтверждения почты сразу
            await sendEmailVerification(userCredential.user);

            // Навигация на страницу ожидания подтверждения
            navigate("/verify", { state: { ...form, language } });
        } catch (err: any) {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already in use");
            } else {
                setError("Submission failed");
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="sign-up__wrapper">
            <div className="sign-up__header">
                <div className="sign-up__logo">
                    <img src={logo} alt="VIP Logo" />
                </div>
                <LanguageSelect setLanguage={setLanguage} language={language} />
            </div>
            <img className="sign-up__bg" src={bg} alt="bg" />
            <div className="sign-up__container">
                <div className="sign-up__info">
                    <h2 className="sign-up__title">
                        {language === "en"
                            ? "Enjoy an extra 10% off participating brands."
                            : "Užijte si extra 10% slevu na zúčastněné značky."}
                    </h2>
                    <p className="sign-up__text">
                        {language === "en"
                            ? "Fashion Arena Prague Outlet brings together over 200 well-known international fashion and lifestyle brands, all with 30-70% off retail prices."
                            : "Fashion Arena Prague Outlet sdružuje více než 200 známých mezinárodních módních a lifestylových značek, všechny s 30-70% slevou z maloobchodních cen."}
                    </p>
                    <p className="sign-up__text">
                        {language === "en"
                            ? "For an extra 10% off, complete the form below and we’ll email you your exclusive voucher..."
                            : "Pro extra 10% slevu vyplňte níže uvedený formulář..."}
                    </p>
                    <p className="sign-up__text">
                        {language === "en"
                            ? "For more information on the processing of your personal data, please see our "
                            : "Další informace o zpracování vašich osobních údajů naleznete v našich "}
                        <a
                            className="sign-up__link"
                            href="https://www.fashion-arena.cz/en/privacy-policy"
                        >
                            {language === "en" ? "Privacy Policy" : "Zásadách ochrany osobních údajů"}
                        </a>
                        .
                    </p>
                </div>
                <form className="sign-up-form" onSubmit={handleSubmit}>
                    <div className="sign-up-form__field">
                        <label className="sign-up-form__label" htmlFor="email">
                            {language === "en" ? "Email address *" : "E-mailová adresa *"}
                        </label>
                        <input
                            id="email"
                            className="sign-up-form__input"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="sign-up-form__field">
                        <label className="sign-up-form__label" htmlFor="hotel">
                            Hotel *
                        </label>
                        <input
                            id="hotel"
                            className="sign-up-form__input"
                            name="hotel"
                            value={form.hotel}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="sign-up-form__field">
                        <label className="sign-up-form__label" htmlFor="country">
                            {language === "en" ? "Country *" : "Země *"}
                        </label>
                        <select
                            id="country"
                            className="sign-up-form__select"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                        >
                            <option value="">
                                {language === "en" ? "Select Country" : "Vyberte zemi"}
                            </option>
                            {countries.map((c) => (
                                <option key={c.name.common} value={c.name.common}>
                                    {c.name.common}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ position: "relative" }}>
                        {error && <div className="sign-up-form__error">{error}</div>}
                        <button
                            className="sign-up-form__button"
                            type={isLoading ? "button" : "submit"}
                        >
                            {isLoading
                                ? "Processing..."
                                : language === "en"
                                    ? "Get your pass"
                                    : "Získejte průkaz"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
