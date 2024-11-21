function Button({ styles, buttonType, buttonName, onClick="" }) {
    return (
        <>
            <button className={styles} type={buttonType} onClick={onclick}>{buttonName}</button>
        </>
    )
}

export default Button;