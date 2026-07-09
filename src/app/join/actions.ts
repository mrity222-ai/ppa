'use server';

import { createUser } from '@/lib/db';

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const mobile = formData.get('mobile') as string;
  const state = formData.get('state') as string;
  const district = formData.get('district') as string;
  const designation = formData.get('designation') as string;

  if (!name || !email || !password || !mobile || !state || !district || !designation) {
    return {
      success: false,
      error: 'All fields are required / सभी फ़ील्ड आवश्यक हैं।',
    };
  }

  try {
    await createUser({
      name,
      email,
      passwordHash: password,
      mobile,
      state,
      district,
      designation,
    });

    return {
      success: true,
      message: 'Registration request submitted successfully! Please wait for admin approval. / पंजीकरण अनुरोध सफलतापूर्वक सबमिट हो गया है! कृपया व्यवस्थापक की स्वीकृति की प्रतीक्षा करें।',
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during registration. Please try again.',
    };
  }
}
