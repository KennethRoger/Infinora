function Button({ styles, buttonType, buttonName }) {
    return (
        <>
            <button className={styles} type={buttonType}>{buttonName}</button>
        </>
    )
}

export default Button;