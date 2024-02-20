import { Alert, Button } from "@material-tailwind/react";
import { ReactNode, createContext, useState } from "react";

type AlertContextType = {
    showAlert: (message: string, type: string) => void;
    hideAlert: () => void;
};

export const AlertContext = createContext<AlertContextType>({
    showAlert: () => { },
    hideAlert: () => { },
});

export default function AlertComponent(alertMessage: string, alertType: string, hideAlert: () => void) {
    return (
        <div className="w-80 p-5 flex w-full flex-col gap-2">
            <Alert onClose={hideAlert} color={alertType === 'error' ? 'red' : 'green'}>{alertMessage}</Alert>
        </div>
    )
}

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<string>("");

    const showAlert = (message: string, type: string) => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => {
            hideAlert();
        }, 5000);
    };

    const hideAlert = () => {
        setAlertMessage("");
        setAlertType("");
    };

    return (
        <>
            {alertMessage && (
                AlertComponent(alertMessage, alertType, hideAlert)
            )}
            <AlertContext.Provider value={{ showAlert, hideAlert }}>
                {children}
            </AlertContext.Provider>
        </>
    );
};
