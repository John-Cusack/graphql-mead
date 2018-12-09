const getFirstName = (fullName) => {
    return fullName.split(' ')[0]
}

const isValidPassword = (pasword) => {
    return pasword.length >= 8 && !pasword.toLowerCase().includes('password')
}

export {getFirstName, isValidPassword}