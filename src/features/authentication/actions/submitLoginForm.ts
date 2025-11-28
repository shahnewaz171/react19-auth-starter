'use server';

import { requestForLog } from '@/services/authService';
import { getUserProfile } from '@/services/userService';

interface FormData {
  userId: number;
}

const submitLoginForm = async (formData: FormData) => {
  try {
    const response = await requestForLog();

    if (response.status === 200) {
      const userProfile = await getUserProfile(formData.userId);
      return { success: true, message: response.message, userProfile };
    }
    return { success: false, message: 'Login failed' };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message || 'An error occurred' };
  }
};

export default submitLoginForm;
