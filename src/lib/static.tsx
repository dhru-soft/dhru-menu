import {getType} from "@reduxjs/toolkit";

export const device:any = {tablet: true, db: '', token: '', global_token: '', navigation: '',uniqueid:'',workspace:'',locationid:''}


export const isDevelopment = process.env.NODE_ENV === "development";


export const urls = {posUrl:`.api.dhru.${isDevelopment?'io':'com'}/menu/v1/`,adminUrl:'',localserver:''}


export const localredux = {settings:{},grouplist:{},itemlist:{}}


export enum STATUS {
    SUCCESS = "success",
    ERROR = "error"
}

export enum METHOD {
    POST = "POST",
    GET = "GET",
    DELETE = "DELETE",
    PUT = "PUT"
}

export enum ACTIONS {
    INIT = "init",
    INVOICE  = "invoice",
    CODE = "code",
    CLIENT = "clientlogin",
    ITEMS = "item",
    CATEGORY = "category",
}

const regExpJson = {
    email: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
    leastOneDigit: /.*[0-9].*/,
    leastOneCAPS: /.*[A-Z].*/,
    leastOneSymbol: /.*[@#$%^&+=!].*/,
    hexCode: /^#[0-9A-F]{6}$/i,
    digitOneDecimalSpace: /^(\d)*(\.)?(\d)*$/
};

export const required = (value:any, label:any) => {
    let message = "is required"
    if (Boolean(label) && getType(label) === "string") {
        message = `${label} ${message}`
    }
    return value ? undefined : message
}
export const isEmail = (value:any) => (regExpJson.email.test(value) ? undefined : 'is invalid')
export const isHexCode = (value:any) => (regExpJson.hexCode.test(value) ? undefined : 'is invalid')
export const isValidPassword = (value:any) => {
    if (value.length < 8) {
        return 'should be at least 8 characters in length.'
    } else if (!regExpJson.leastOneCAPS.test(value)) {
        return 'must include at least one CAPS!'
    } else if (!regExpJson.leastOneDigit.test(value)) {
        return 'must include at least one number!'
    } else if (!regExpJson.leastOneSymbol.test(value)) {
        return 'must include at least one symbol!'
    }
}
export const matchPassword = (password:any) => (value:any) => {
    if (password !== value) {
        return 'not match with password'
    }
}
export const startWithString = (value:any) => {
    if (value.match(/^\d/)) {
        return 'must start with string'
    }
}
export const mustBeNumber = (value:any) => (isNaN(value) ? 'Must be a number' : undefined)
export const onlyDigitOneDecimal = (value:any) => (regExpJson.digitOneDecimalSpace.test(value) ? undefined : 'is invalid')


export const composeValidators = (...validators:any) => (value:any) =>
    validators.reduce((error:any, validator:any) => error || validator(value), undefined)


export const defaultclient: any = {clientid: 1, clientname: 'Walkin'}

export enum VOUCHER {
    INVOICE = "b152d626-b614-4736-8572-2ebd95e24173",
}
