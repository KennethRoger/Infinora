function Button({ styles, buttonType, buttonName }) {
    return (
        <>
            <button className={`${styles} border px-5 py-3 w-full`} type={buttonType} >{buttonName}</button>
        </>
    )
}

export default Button;