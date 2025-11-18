/**
 * AI Integration using aimlapi.com
 * Provides AI-powered features for the PROS website
 */

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Call AI API with messages
 */
export async function callAI(messages: AIMessage[], options?: {
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const apiKey = process.env.AIMLAPI_KEY;
  
  if (!apiKey) {
    throw new Error('AIMLAPI_KEY not configured');
  }

  try {
    const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI API error: ${response.status} - ${error}`);
    }

    const data: AIResponse = await response.json();
    return data.choices[0]?.message?.content ?? '';
  } catch (error) {
    console.error('[AI] Error calling AI API:', error);
    throw error;
  }
}

/**
 * Generate job description using AI
 */
export async function generateJobDescription(params: {
  title: string;
  department: string;
  location: string;
  clearance?: string;
}): Promise<{ description: string; requirements: string; benefits: string }> {
  const prompt = `Generate a comprehensive job posting for a radiation oncology position with the following details:

Title: ${params.title}
Department: ${params.department}
Location: ${params.location}
${params.clearance ? `Clearance Required: ${params.clearance}` : ''}

Please provide three sections:
1. DESCRIPTION: A compelling 2-3 paragraph job description highlighting the role's impact and responsibilities
2. REQUIREMENTS: A bulleted list of required qualifications, certifications, and experience
3. BENEFITS: A bulleted list of benefits and perks for this position

Format your response as JSON with keys: description, requirements, benefits`;

  const response = await callAI([
    {
      role: 'system',
      content: 'You are an expert HR professional specializing in radiation oncology staffing. Generate professional, compelling job postings that attract top talent.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ]);

  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(response);
    return parsed;
  } catch {
    // If not JSON, extract sections manually
    const descMatch = response.match(/DESCRIPTION[:\s]+([\s\S]*?)(?=REQUIREMENTS|$)/i);
    const reqMatch = response.match(/REQUIREMENTS[:\s]+([\s\S]*?)(?=BENEFITS|$)/i);
    const benMatch = response.match(/BENEFITS[:\s]+([\s\S]*?)$/i);

    return {
      description: descMatch?.[1]?.trim() ?? response,
      requirements: reqMatch?.[1]?.trim() ?? 'To be determined',
      benefits: benMatch?.[1]?.trim() ?? 'Competitive compensation and benefits package',
    };
  }
}

/**
 * Analyze resume and extract key information
 */
export async function analyzeResume(resumeText: string, jobDescription: string): Promise<{
  score: number;
  strengths: string[];
  gaps: string[];
  summary: string;
}> {
  const prompt = `Analyze this resume against the job description and provide a matching score and insights.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText.substring(0, 4000)} 

Provide your analysis as JSON with:
- score: number 0-100 indicating match quality
- strengths: array of 3-5 key strengths that match the role
- gaps: array of 2-4 areas where candidate may need development
- summary: 2-3 sentence overall assessment`;

  const response = await callAI([
    {
      role: 'system',
      content: 'You are an expert radiation oncology recruiter. Analyze resumes objectively and provide actionable insights.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ], { temperature: 0.3 });

  try {
    return JSON.parse(response);
  } catch {
    return {
      score: 50,
      strengths: ['Experience in relevant field'],
      gaps: ['Unable to fully analyze resume'],
      summary: 'Resume analysis completed. Manual review recommended.',
    };
  }
}

/**
 * Generate response suggestion for contact inquiry
 */
export async function generateContactResponse(inquiry: {
  type: string;
  name: string;
  organization?: string;
  message: string;
}): Promise<string> {
  const prompt = `Generate a professional email response to this inquiry:

Type: ${inquiry.type}
From: ${inquiry.name}${inquiry.organization ? ` at ${inquiry.organization}` : ''}
Message: ${inquiry.message}

Write a warm, professional response that:
- Thanks them for reaching out
- Addresses their specific inquiry type
- Provides relevant next steps
- Includes a clear call to action
- Signs off professionally

Keep it concise (2-3 paragraphs).`;

  const response = await callAI([
    {
      role: 'system',
      content: 'You are a professional business development representative for PROS (Precision Radiation Oncology Solutions), a veteran-owned staffing and AI technology company.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ]);

  return response;
}

/**
 * Chat assistant for website visitors
 */
export async function chatAssistant(userMessage: string, conversationHistory: AIMessage[] = []): Promise<string> {
  const systemPrompt = `You are a helpful AI assistant for PROS (Precision Radiation Oncology Solutions), a veteran-owned company specializing in:

1. Medical Staffing: Providing radiation oncology professionals (physicists, dosimetrists, therapists, nurses) to VA, DoD, and civilian healthcare facilities
2. AI-Powered Systems: Advanced treatment planning, workflow optimization, and quality assurance tools
3. Professional Tools: Free calculators, protocol libraries, and resources for radiation oncology professionals

Key Information:
- VOSB certified (Veteran-Owned Small Business)
- VA Schedule 621 I contractor
- CMMC Level 2 compliant
- Serving government and civilian healthcare facilities nationwide

Answer questions about:
- Our services and capabilities
- Job opportunities and careers
- Professional tools and resources
- How to partner with us
- Radiation oncology best practices

Be helpful, professional, and concise. If you don't know something specific, direct them to contact us at info@pros-staffing.com or (555) 123-4567.`;

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  return await callAI(messages, { temperature: 0.7, maxTokens: 500 });
}
