'use server';

import { saveContactSubmission, getContactSubmissions } from '@/lib/db';

export async function fetchContactSubmissions() {
  try {
    const submissions = await getContactSubmissions();
    return { success: true, submissions };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { success: false, error: 'Failed to fetch submissions' };
  }
}

export async function submitContactForm(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const mobile = formData.get('mobile') as string;
  const state = formData.get('state') as string;
  const district = formData.get('district') as string;
  const designation = formData.get('designation') as string;

  if (!name || !mobile || !state || !district || !designation) {
    return {
      success: false,
      error: 'All fields are required / सभी फ़ील्ड आवश्यक हैं',
    };
  }

  try {
    await saveContactSubmission({
      name,
      mobile,
      state,
      district,
      designation,
    });

    return {
      success: true,
      message: 'Your message has been submitted successfully / आपका संदेश सफलतापूर्वक सबमिट कर दिया गया है',
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      error: 'An error occurred while saving your message. Please try again. / आपका संदेश सहेजते समय एक त्रुटि आई। कृपया पुनः प्रयास करें।',
    };
  }
}
