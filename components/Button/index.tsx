import { FC } from "react";

interface IButtonProps {
    label: string
}

const Button: FC<IButtonProps> = ({ label }) => {
    return (
        <button className="bg-brand p-2 px-3 font-medium rounded-md active:scale-95 transition-all">{label}</button>
    )
}

export default Button