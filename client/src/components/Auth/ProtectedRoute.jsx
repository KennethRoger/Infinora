const { useSelector } = require("react-redux")

const ProtectedRoute = ( {allowedRoles, children}) => {
    const {} = useSelector((state) => state.auth)
}
