export interface LoginRequestDTO {
    username: string,
    password: string,
    twoFactorCode: string
}

export interface LoginResponseDTO {
    accessToken: string,
    refreshToken: string,
    tokenType: string,
    id: string,
    username: string,
    email: string,
    roles: string[],
    twoFactorRequired: boolean,
    profileImage: string
}

export interface RegisterRequestDTO {
    username: string,
    email: string,
    password: string,
    roles: string[],
    profileImage: string
}

export interface RegisterResponseDTO {
    message: string,
    twoFactorSetupResponse: TwoFactorSetupResponse
}

export interface TwoFactorSetupResponse {
    secret: string,
    qrCodeBase64: string
}

export interface AddTransactionDTO {
    type: 'Expense' | 'Income',
    label: string,
    amount: number,
    category: string,
    date: string
}