import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const suggestTitleImprovements = async (currentTitle, description) => {
  try {
    const prompt = `Given the following YouTube video title and description, suggest 3 improved title variations that are:
- More engaging and click-worthy
- SEO optimized
- Clear and descriptive
- Between 50-70 characters

Current Title: "${currentTitle}"
Description: "${description}"

Provide exactly 3 alternative titles, one per line, without numbering or additional formatting.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a YouTube optimization expert who creates engaging, SEO-friendly video titles.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const suggestions = response.choices[0].message.content
      .trim()
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 3);

    return suggestions;
  } catch (error) {
    console.error('Error generating title suggestions:', error);
    throw error;
  }
};
