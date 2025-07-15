import { useLocation } from "react-router-dom";

const SuccessPage = () => {
    const location = useLocation();
    const language = location.state?.language || "en";

    const texts = {
        en: {
            title: "Thank you for registering!",
            subtitle: "Please check your inbox for a confirmation email.",
        },
        cz: {
            title: "Děkujeme za registraci!",
            subtitle: "Zkontrolujte prosím svou e-mailovou schránku pro potvrzení.",
        },
    };

    const { title, subtitle } = texts[language as "en" | "cz"];

    return (
        <div className="success-page">
            <div className="success-page__box">
                <h1 className="success-page__title">{title}</h1>
                <p className="success-page__subtitle">{subtitle}</p>
            </div>
        </div>
    );
};

export default SuccessPage;