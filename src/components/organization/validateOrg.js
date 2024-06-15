const validateOrg = values => {
    const errors = {}
    if (!values.orgName) {
        errors.orgName = 'Organization Name is required'
    }
    if (!values.country) {
        errors.country = 'Country is required'
    }
    if (!values.state) {
        errors.state = 'State is required'
    }
    if (!values.city) {
        errors.city = 'City is required'
    }
    return errors
}
export default validateOrg;