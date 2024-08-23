// src/config/constants.ts

export const BUTTON_TEXTS = {
    VIEW_ADDRESSES: 'View Addresses',
    FIND_ORG: 'Find Organization',
    BACK: 'Back',
    HOME: 'Home',
};

export const MESSAGES = {
    WELCOME: 'Welcome to the bot!',
    CHOOSE_OPTION: 'Please choose an option:'
};

export enum TypeScene {
    MainScene = 'mainScene',
    AddressScene = 'addressScene',
    PaymentScene = 'paymentScene',
    FindOrgScene = 'findOrgScene',
    FindAccountScene = 'findAccountScene',
    InvoiceScene = 'invoiceScene',
    OrgScene = 'orgScene',
};