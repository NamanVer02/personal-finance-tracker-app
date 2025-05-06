import { ForgotPasswordRequestDTO, UpdatePasswordRequestDTO } from "interfaces/dto"
import apiClient from "services/apiClient";

export const updatePassword = async (currentPassword: string, newPassword: string, userId: string) => {
    const updatePasswordRequest: UpdatePasswordRequestDTO = {
        currentPassword,
        newPassword,
    }

    try {
        const response = await apiClient.put(
            `/api/users/${userId}/password`,
            updatePasswordRequest
        );

        if (response.status === 200) {
            return {
                ok: true,
                message: 'Password updated successfully',
            };
        } else {
            return {
                ok: false,
                message: 'Failed to update password',
            };
        }
    } catch (error) {
        console.error('Error updating password:', error);
        return {
            ok: false,
            message: 'An error occurred while updating the password',
        };
    }
}


export const checkUser = async (username: string) => {
    try {
        const response = await apiClient.post(
            '/api/auth/forgot-password',
            username
        )

        if (response.status === 200) {
            return {
                ok: true,
                message: 'User exists in the database',
            };
        } else {
            return {
                ok: false,
                message: 'Failed to find a user with this username',
            };
        }
    } catch (error) {
        console.error('Error finding user:', error);
        return {
          ok: false,
          message: 'An error occurred while finding the user',
        };
    }
}


export const forgotPassword = async (username: string, twoFactorCode: number, newPassword: string) => {
    const forgotPasswordRequest: ForgotPasswordRequestDTO = {
        username,
        twoFactorCode,
        newPassword
    }

    try {
        const response = await apiClient.post(
            '/api/auth/reset-password',
            forgotPasswordRequest
        );

        if (response.status === 200) {
            return {
                ok: true,
                message: 'Password updated successfully',
            };
        } else {
            return {
                ok: false,
                message: 'Failed to update password',
            };
        }
    } catch (error) {
        console.error('Error updating password:', error);
        return {
          ok: false,
          message: 'An error occurred while updating the password',
        };
    }
}