import { FC } from "react";

interface IButtonProps {
    label: string
    action?: () => void
}

const Button: FC<IButtonProps> = ({ label, action }) => {
    return (
        <button className="bg-brand p-2 px-3 font-medium rounded-md active:scale-95 transition-all" onClick={action}>{label}</button>
    )
}

export default Button