import icons from 'feather-icons/dist/icons.json'

export const colorValidator = (value) => ['black', 'white', 'gray', 'red', 'green'].includes(value)
export const iconTypeValidator = (value) => Object.keys(icons).includes(value)
export const inputTypeValidator = (value) => ['text', 'password', 'number', 'tel'].includes(value)
