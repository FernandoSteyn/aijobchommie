const axios = require('axios');
const aiCache = require('./aiCacheService');

class AIService {
  constructor() {
    this.lowCostModels = {
      namedEntityRecognition: 'dslim/bert-base-NER',
      skillClassification: 'facebook/bart-large-mnli',
      sentenceEmbeddings: 'sentence-transformers/all-MiniLM-L6-v2',
      questionAnswering: 'deepset/roberta-base-squad2',
      coverLetter: 'tiiuae/falcon-7b-instruct',
      sentimentAnalysis: 'distilbert-base-uncased-finetuned-sst-2-english'
    };

    this.modelRates = {
      // Costs per 1000 tokens (minimized for budget)
      'dslim/bert-base-NER': 0.5,
      'facebook/bart-large-mnli': 1.0,
      'sentence-transformers/all-MiniLM-L6-v2': 0.3,
      'deepset/roberta-base-squad2': 0.7,
      'tiiuae/falcon-7b-instruct': 2.0,
      'distilbert-base-uncased-finetuned-sst-2-english': 0.2
    };

    this.apiKey = process.env.HUGGING_FACE_API_KEY;
    this.baseUrl = 'https://api-inference.huggingface.co/models/';
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // Resume/CV Named Entity Recognition
  async analyzeCV(cvText) {
    try {
      // Check cache first
      const cached = await aiCache.getCachedResult('cv_analysis', cvText);
      if (cached) {
        console.log('✅ Using cached CV analysis');
        return cached;
      }

      // If not in cache, check for similar CV
      const similarKey = aiCache.findSimilarCV(cvText);
      const similarCached = await aiCache.getCachedResult('cv_similarity', similarKey);
      if (similarCached) {
        console.log('✅ Using similar CV analysis');
        return similarCached;
      }

      const response = await axios.post(
        `${this.baseUrl}dslim/bert-base-NER`,
        { inputs: cvText },
        { headers: this.headers }
      );

      // Extract relevant entities
      const entities = response.data;
      const skills = [];
      const organizations = [];
      const locations = [];
      const miscellaneous = [];

      entities.forEach(entity => {
        if (entity.entity_group === 'ORG') {
          organizations.push(entity.word);
        } else if (entity.entity_group === 'LOC') {
          locations.push(entity.word);
        } else if (entity.entity_group === 'MISC') {
          miscellaneous.push(entity.word);
        }
      });

      const result = {
        entities,
        extracted: {
          organizations: [...new Set(organizations)],
          locations: [...new Set(locations)],
          skills: [...new Set(miscellaneous)], // Often skills are tagged as MISC
          raw: entities
        }
      };

      // Cache the result
      await aiCache.setCachedResult('cv_analysis', cvText, result);
      await aiCache.setCachedResult('cv_similarity', similarKey, result);

      return result;
    } catch (error) {
      console.error('Error analyzing CV:', error.response?.data || error.message);
      throw error;
    }
  }

  // Skill Classification using Zero-shot
  async classifySkills(text, candidateLabels) {
    try {
      // Check cache first
      const cacheKey = `${text}:${JSON.stringify(candidateLabels)}`;
      const cached = await aiCache.getCachedResult('skill_classification', cacheKey);
      if (cached) {
        console.log('✅ Using cached skill classification');
        return cached;
      }
      const defaultLabels = [
        'Programming',
        'Data Analysis',
        'Project Management',
        'Sales',
        'Marketing',
        'Customer Service',
        'Finance',
        'Human Resources',
        'Design',
        'Writing',
        'Teaching',
        'Healthcare',
        'Engineering',
        'Construction',
        'Administration'
      ];

      const response = await axios.post(
        `${this.baseUrl}facebook/bart-large-mnli`,
        {
          inputs: text,
          parameters: {
            candidate_labels: candidateLabels || defaultLabels,
            multi_label: true
          }
        },
        { headers: this.headers }
      );

      const result = response.data;
      
      // Cache the result
      await aiCache.setCachedResult('skill_classification', cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error classifying skills:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generate sentence embeddings for job matching
  async generateEmbeddings(text) {
    try {
      // Check cache first
      const cached = await aiCache.getCachedResult('embeddings', text);
      if (cached) {
        console.log('✅ Using cached embeddings');
        return cached;
      }

      const response = await axios.post(
        `${this.baseUrl}sentence-transformers/all-MiniLM-L6-v2`,
        { inputs: text },
        { headers: this.headers }
      );

      const result = response.data;
      
      // Cache the result
      await aiCache.setCachedResult('embeddings', text, result);
      
      return result;
    } catch (error) {
      console.error('Error generating embeddings:', error.response?.data || error.message);
      throw error;
    }
  }

  // Calculate similarity between CV and job descriptions
  async calculateJobMatch(cvEmbedding, jobEmbedding) {
    // Cosine similarity calculation
    const dotProduct = cvEmbedding.reduce((sum, val, i) => sum + val * jobEmbedding[i], 0);
    const magnitudeCV = Math.sqrt(cvEmbedding.reduce((sum, val) => sum + val * val, 0));
    const magnitudeJob = Math.sqrt(jobEmbedding.reduce((sum, val) => sum + val * val, 0));
    
    const similarity = dotProduct / (magnitudeCV * magnitudeJob);
    const matchPercentage = Math.round(similarity * 100);
    
    return {
      similarity,
      matchPercentage,
      matchLevel: matchPercentage >= 80 ? 'Excellent' : 
                  matchPercentage >= 60 ? 'Good' : 
                  matchPercentage >= 40 ? 'Fair' : 'Low'
    };
  }

  // Find best matching jobs
  async findMatchingJobs(cvText, jobs) {
    try {
      // Generate CV embedding
      const cvEmbedding = await this.generateEmbeddings(cvText);
      
      // Calculate matches for all jobs
      const matchedJobs = await Promise.all(
        jobs.map(async (job) => {
          const jobText = `${job.title} ${job.description} ${job.requirements || ''}`;
          const jobEmbedding = await this.generateEmbeddings(jobText);
          const match = await this.calculateJobMatch(cvEmbedding, jobEmbedding);
          
          return {
            ...job,
            matchScore: match.matchPercentage,
            matchLevel: match.matchLevel
          };
        })
      );

      // Sort by match score
      return matchedJobs.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      console.error('Error finding matching jobs:', error);
      throw error;
    }
  }

  // Question Answering for extracting specific info
  async extractInfoFromCV(cvText, question) {
    try {
      // Check cache first
      const cacheKey = `${cvText}:${question}`;
      const cached = await aiCache.getCachedResult('qa_extraction', cacheKey);
      if (cached) {
        console.log('✅ Using cached Q&A extraction');
        return cached;
      }
      const response = await axios.post(
        `${this.baseUrl}deepset/roberta-base-squad2`,
        {
          inputs: {
            question: question,
            context: cvText
          }
        },
        { headers: this.headers }
      );

      const result = response.data;
      
      // Cache the result
      await aiCache.setCachedResult('qa_extraction', cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error extracting info from CV:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generate cover letter
  async generateCoverLetter(jobDetails, userProfile) {
    try {
      const prompt = `
You are a professional cover letter writer in South Africa. Write a compelling cover letter for this job:

Job Title: ${jobDetails.title}
Company: ${jobDetails.company}
Location: ${jobDetails.location}

Applicant Profile:
Name: ${userProfile.name}
Skills: ${userProfile.skills.join(', ')}
Experience: ${userProfile.experience}
Education: ${userProfile.education}

Write a professional cover letter that:
1. Shows enthusiasm for the position
2. Highlights relevant skills and experience
3. Explains why the applicant is a good fit
4. Uses South African business etiquette
5. Keeps it concise (under 300 words)

Cover Letter:
`;

      const response = await axios.post(
        `${this.baseUrl}tiiuae/falcon-7b-instruct`,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        },
        { headers: this.headers }
      );

      return response.data[0].generated_text;
    } catch (error) {
      console.error('Error generating cover letter:', error.response?.data || error.message);
      throw error;
    }
  }

  // Sentiment analysis for job descriptions
  async analyzeJobSentiment(text) {
    try {
      const response = await axios.post(
        `${this.baseUrl}distilbert-base-uncased-finetuned-sst-2-english`,
        { inputs: text },
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error analyzing sentiment:', error.response?.data || error.message);
      throw error;
    }
  }

  // Auto-apply for jobs (for premium users)
  async generateApplicationEmail(jobDetails, userProfile, coverLetter) {
    const email = {
      subject: `Application for ${jobDetails.title} position - ${userProfile.name}`,
      body: `
Dear Hiring Manager,

I am writing to express my strong interest in the ${jobDetails.title} position at ${jobDetails.company}.

${coverLetter}

Please find my CV attached for your review. I am excited about the opportunity to contribute to your team and would welcome the chance to discuss how my skills and experience align with your needs.

Thank you for considering my application. I look forward to hearing from you.

Kind regards,
${userProfile.name}
${userProfile.phone}
${userProfile.email}
`,
      attachments: ['CV'] // Placeholder for CV attachment
    };

    return email;
  }
}

module.exports = new AIService();
