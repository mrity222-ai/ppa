'use server';
/**
 * @fileOverview A Genkit flow for generating concise summaries of news articles or event descriptions.
 *
 * - generateContentSummary - A function that handles the content summarization process.
 * - ContentSummaryInput - The input type for the generateContentSummary function.
 * - ContentSummaryOutput - The return type for the generateContentSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentSummaryInputSchema = z.object({
  content: z
    .string()
    .describe('The full text of the news article or event description to be summarized.'),
});
export type ContentSummaryInput = z.infer<typeof ContentSummaryInputSchema>;

const ContentSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the provided content.'),
});
export type ContentSummaryOutput = z.infer<typeof ContentSummaryOutputSchema>;

export async function generateContentSummary(
  input: ContentSummaryInput
): Promise<ContentSummaryOutput> {
  return generateContentSummaryFlow(input);
}

const contentSummaryPrompt = ai.definePrompt({
  name: 'contentSummaryPrompt',
  input: {schema: ContentSummaryInputSchema},
  output: {schema: ContentSummaryOutputSchema},
  prompt: `You are an AI assistant specialized in generating concise summaries for website content.
Your task is to summarize the following content, highlighting the main points and key information.
The summary should be suitable for a website's news article preview or event description, making it engaging and easy to digest for readers.

Content:
{{{content}}}`,
});

const generateContentSummaryFlow = ai.defineFlow(
  {
    name: 'generateContentSummaryFlow',
    inputSchema: ContentSummaryInputSchema,
    outputSchema: ContentSummaryOutputSchema,
  },
  async input => {
    const {output} = await contentSummaryPrompt(input);
    return output!;
  }
);
