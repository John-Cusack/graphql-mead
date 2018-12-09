import {getFirstName, isValidPassword} from '../src/utils/user'

test('should return first name when give full name', () => {
    const firstName = getFirstName('John Cusack')

    expect(firstName).toBe('John')
})

test('should return first name when given first name',() => {
    const firstName = getFirstName('Jen')
    expect(firstName).toBe('Jen')
})

test('should reject password shorter than 8 characters', () => {
    const isValid = isValidPassword('abc')

    expect(isValid).toBe(false)
})

test('should reject password shorter than 8 characters', () => {
    const isValid = isValidPassword('password4235')

    expect(isValid).toBe(false)
})

test('should reject password shorter than 8 characters', () => {
    const isValid = isValidPassword('asdhfi87aysd7fgas')

    expect(isValid).toBe(true)
})