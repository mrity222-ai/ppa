'use server';

import { getUserByEmail } from '@/lib/db';
import { createSession, destroySession, getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      success: false,
      error: 'Please enter both email and password / कृपया ईमेल और पासवर्ड दोनों दर्ज करें।',
    };
  }

  try {
    const user = await getUserByEmail(email);

    if (!user || user.passwordHash !== password) {
      return {
        success: false,
        error: 'Invalid email/Member ID or password / अमान्य ईमेल/सदस्य आईडी या पासवर्ड।',
      };
    }

    if (!user.isApproved) {
      return {
        success: false,
        error: 'Your account is pending administrative verification. / आपका खाता व्यवस्थापक द्वारा सत्यापन के लिए लंबित है।',
      };
    }

    // Set cookies session
    await createSession(user.email);

    return {
      success: true,
      message: 'Login successful / लॉगिन सफल रहा।',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again. / एक अप्रत्याशित त्रुटि हुई। कृपया पुनः प्रयास करें।',
    };
  }
}

export async function logoutUser() {
  await destroySession();
  redirect('/login');
}

export async function getCurrentUser() {
  return await getSessionUser();
}
