import { UpdatePasswordRequestDTO } from "interfaces/dto"
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