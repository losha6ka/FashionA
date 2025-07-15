import Select from "react-select";
import { useEffect, useState } from "react";
const flagGb = "https://flagcdn.com/w40/gb.png";
const flagCz = "https://flagcdn.com/w40/cz.png";

const languageOptions = [
    {
        value: "en",
        label: (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img
                    src={flagGb}
                    alt="English"
                    style={{ width: 20, height: 20, borderRadius: "50%" }}
                />
                English
            </div>
        ),
    },
    {
        value: "cz",
        label: (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img
                    src={flagCz}
                    alt="Czech"
                    style={{ width: 20, height: 20, borderRadius: "50%" }}
                />
                Czech
            </div>
        ),
    },
];

const LanguageSelect = ({ setLanguage, language }: { setLanguage: any, language: string }) => {
    const [selectedLang, setSelectedLang] = useState(() =>
        languageOptions.find(opt => opt.value === language) || languageOptions[0]
    );

    useEffect(() => {
        const langObj = languageOptions.find(opt => opt.value === language);
        if (langObj) setSelectedLang(langObj);
    }, [language]);

    return (
        <div style={{ width: 180 }}>
            <Select
                value={selectedLang}
                options={languageOptions}
                onChange={(val) => {
                    if (val) {
                        setSelectedLang(val);
                        setLanguage(val.value); // <== ВАЖНО: берем только value
                    }
                }}
                styles={{
                    control: (base) => ({
                        ...base,
                        borderRadius: 6,
                        padding: "2px 6px",
                        fontSize: 14,
                        cursor: "pointer",
                    }),
                    option: (base, state) => ({
                        ...base,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        backgroundColor: state.isFocused ? "#f0f0f0" : "white",
                        color: "#333",
                        cursor: "pointer",
                    }),
                    menu: (base) => ({
                        ...base,
                        zIndex: 999,
                    }),
                }}
                isSearchable={false}
            />
        </div>
    );
};

export default LanguageSelect;
