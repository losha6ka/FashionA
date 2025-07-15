import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import logo from "../../img/fapo_logo1.png"
import bg from "../../img/fapo_hero_desktop.jpg"
import LanguageSelect from "./LangSelect";
interface Country { name: { common: string } }

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

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID!;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID!;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY!;
    const googleMacros = "https://script.google.com/macros/s/AKfycbxHPiTsu3Z0LCqYyNAwc-bW_FLn7EDjJ-KxWO94yfxOjfEq_6AOr5aWf9Ru0fPlk1XY-A/exec"
    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all?fields=name")
            .then(r => r.json())
            .then(data =>
                setCountries(data.sort((a: Country, b: Country) =>
                    a.name.common.localeCompare(b.name.common)
                ))
            )
            .catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        const ref = collection(db, "users");
        const [emailSnap] = await Promise.all([
            getDocs(query(ref, where("email", "==", form.email))),
        ]);

        if (!form.email || !form.hotel || !form.country) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }

        if (emailSnap.size > 0) {
            setError("User with this email already exists");
            setIsLoading(false);
            return;
        }

        try {
            await addDoc(ref, form);
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                email: form.email,
                hotel: form.hotel,
                country: form.country,
                image1: "https://res.cloudinary.com/dgpf7hqht/image/upload/v1752611368/photo_2025-07-15_18-59-19_tx76zx.jpg",
                image2: "https://res.cloudinary.com/dgpf7hqht/image/upload/v1752611360/image_2025-07-15_18-00-42_d2hst8.png"
            }, PUBLIC_KEY);
            void fetch(googleMacros, {
                method: "POST",
                body: JSON.stringify(form),
            });
            navigate("/success", { state: { language } });
        } catch (err) {
            console.error(err);
            setError("Submission failed");
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
            {language === "en"
                ? <div className="sign-up__container">
                    <div className="sign-up__info">
                        <h2 className="sign-up__title">Enjoy an extra 10% off participating brands.</h2>
                        <p className="sign-up__text">Fashion Arena Prague Outlet brings together over 200 well-known international fashion and lifestyle brands, all with 30-70% off retail prices.</p>
                        <p className="sign-up__text">For an extra 10% off, complete the form below and we’ll email you your exclusive voucher, valid to use as many times as you like at all <a className="sign-up__link" href="https://www.fashion-arena.cz/en/vip-day-pass">participating brands</a> for 24 hours from first use. After you get an email you will have to come to Fashion Arena informational center to show email that you received from us to get all bonuses mentioned before.</p>
                        <p className="sign-up__text">For more information on the processing of your personal data, please see our <a className="sign-up__link" href="https://www.fashion-arena.cz/en/privacy-policy">Privacy Policy</a>.</p>
                    </div>
                    <form className="sign-up-form" onSubmit={handleSubmit}>
                        <div className="sign-up-form__field">
                            <label className="sign-up-form__label" htmlFor="email">Email address *</label>
                            <input id="email" className="sign-up-form__input" name="email" type="email" value={form.email} onChange={handleChange} />
                        </div>
                        <div className="sign-up-form__field">

                            <label className="sign-up-form__label" htmlFor="hotel">Hotel *</label>
                            <input id="hotel" className="sign-up-form__input" name="hotel" value={form.hotel} onChange={handleChange} />
                        </div>
                        <div className="sign-up-form__field">

                            <label className="sign-up-form__label" htmlFor="country">Country *</label>
                            <select id="country" className="sign-up-form__select" name="country" value={form.country} onChange={handleChange}>
                                <option value="">Select Country</option>
                                {countries.map(c => (
                                    <option key={c.name.common} value={c.name.common}>{c.name.common}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ position: "relative" }}>
                            {error && <div className="sign-up-form__error">{error}</div>}
                            <button className="sign-up-form__button" type={isLoading ? "button" : "submit"}>
                                {isLoading ? "Processing..." : "Get your pass"}</button>
                        </div>
                    </form>
                </div>
                : <div className="sign-up__container">
                    <div className="sign-up__info">
                        <h2 className="sign-up__title">Užijte si extra 10% slevu na zúčastněné značky.</h2>
                        <p className="sign-up__text">Fashion Arena Prague Outlet sdružuje více než 200 známých mezinárodních módních a lifestylových značek, všechny s 30-70% slevou z maloobchodních cen.</p>
                        <p className="sign-up__text">Pro extra 10% slevu vyplňte níže uvedený formulář a my vám zašleme e-mail s exkluzivním poukazem, který můžete použít tolikrát, kolikrát chcete, u všech <a className="sign-up__link" href="https://www.fashion-arena.cz/en/vip-day-pass">zúčastněných značek</a> po dobu 24 hodin od prvního použití. Po obdržení e-mailu se budete muset dostavit do informačního centra Fashion Areny a prokázat se e-mailem, který jste od nás obdrželi, abyste získali všechny výše uvedené bonusy.</p>
                        <p className="sign-up__text">Další informace o zpracování vašich osobních údajů naleznete v našich <a className="sign-up__link" href="https://www.fashion-arena.cz/en/privacy-policy">Zásadách ochrany osobních údajů</a>.</p>
                    </div>
                    <form className="sign-up-form" onSubmit={handleSubmit}>
                        <div className="sign-up-form__field">
                            <label className="sign-up-form__label" htmlFor="email">E-mailová adresa *</label>
                            <input id="email" className="sign-up-form__input" name="email" type="email" value={form.email} onChange={handleChange} />
                        </div>
                        <div className="sign-up-form__field">

                            <label className="sign-up-form__label" htmlFor="hotel">Hotel *</label>
                            <input id="hotel" className="sign-up-form__input" name="hotel" value={form.hotel} onChange={handleChange} />
                        </div>
                        <div className="sign-up-form__field">

                            <label className="sign-up-form__label" htmlFor="country">Země *</label>
                            <select id="country" className="sign-up-form__select" name="country" value={form.country} onChange={handleChange}>
                                <option value="">Vyberte zemi</option>
                                {countries.map(c => (
                                    <option key={c.name.common} value={c.name.common}>{c.name.common}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ position: "relative" }}>
                            {error && <div className="sign-up-form__error">{error}</div>}
                            <button className="sign-up-form__button" type={isLoading ? "button" : "submit"}>
                                {isLoading ? "Processing..." : "Získejte průkaz"}</button>
                        </div>
                    </form>
                </div>
            }
        </div>
    );
};

export default RegistrationForm;
