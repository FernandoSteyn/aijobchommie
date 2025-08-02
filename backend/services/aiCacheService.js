const { supabase } = require('../config/supabase');
const crypto = require('crypto');

class AICacheService {
  constructor() {
    this.memoryCache = new Map();
    this.maxMemoryCacheSize = 1000; // Keep 1000 items in memory
    this.cacheHitRatio = 0;
    this.totalRequests = 0;
    this.cacheHits = 0;
  }

  // Generate cache key from input
  generateCacheKey(operation, input) {
    const normalizedInput = typeof input === 'string' 
      ? input.toLowerCase().trim().replace(/\s+/g, ' ')
      : JSON.stringify(input);
    
    return crypto
      .createHash('sha256')
      .update(`${operation}:${normalizedInput}`)
      .digest('hex');
  }

  // Get from memory cache first, then database
  async getCachedResult(operation, input) {
    this.totalRequests++;
    const cacheKey = this.generateCacheKey(operation, input);
    
    // Check memory cache first (fastest)
    if (this.memoryCache.has(cacheKey)) {
      this.cacheHits++;
      console.log(`🚀 Memory cache hit for ${operation}`);
      return this.memoryCache.get(cacheKey);
    }

    // Check database cache
    try {
      const { data, error } = await supabase
        .from('ai_cache')
        .select('result, created_at')
        .eq('cache_key', cacheKey)
        .eq('operation', operation)
        .single();

      if (data && !error) {
        // Check if cache is still valid (30 days for most operations, 7 days for job matching)
        const maxAge = operation === 'job_matching' ? 7 : 30;
        const cacheAge = Math.floor((Date.now() - new Date(data.created_at)) / (1000 * 60 * 60 * 24));
        
        if (cacheAge <= maxAge) {
          this.cacheHits++;
          console.log(`💾 Database cache hit for ${operation} (${cacheAge} days old)`);
          
          // Store in memory cache for faster future access
          this.addToMemoryCache(cacheKey, data.result);
          return data.result;
        } else {
          // Cache expired, delete it
          await this.deleteCacheEntry(cacheKey);
        }
      }
    } catch (error) {
      console.error('Cache lookup error:', error);
    }

    return null;
  }

  // Store result in both memory and database cache
  async setCachedResult(operation, input, result) {
    const cacheKey = this.generateCacheKey(operation, input);
    
    // Store in memory cache
    this.addToMemoryCache(cacheKey, result);
    
    // Store in database cache
    try {
      await supabase
        .from('ai_cache')
        .upsert({
          cache_key: cacheKey,
          operation,
          input_hash: cacheKey.substring(0, 32), // For indexing
          result,
          created_at: new Date().toISOString()
        });
      
      console.log(`💾 Cached result for ${operation}`);
    } catch (error) {
      console.error('Cache storage error:', error);
    }
  }

  // Add to memory cache with LRU eviction
  addToMemoryCache(key, value) {
    // Remove oldest entries if cache is full
    if (this.memoryCache.size >= this.maxMemoryCacheSize) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
    
    this.memoryCache.set(key, value);
  }

  // Delete expired cache entry
  async deleteCacheEntry(cacheKey) {
    try {
      await supabase
        .from('ai_cache')
        .delete()
        .eq('cache_key', cacheKey);
    } catch (error) {
      console.error('Cache deletion error:', error);
    }
  }

  // Pre-compute common job skills and store them
  async precomputeCommonSkills() {
    const commonSkills = [
      'welding', 'fabrication', 'metal work', 'construction', 'maintenance',
      'javascript', 'python', 'data analysis', 'project management', 'sales',
      'marketing', 'customer service', 'accounting', 'administration', 'teaching',
      'nursing', 'security', 'driving', 'logistics', 'retail', 'hospitality'
    ];

    for (const skill of commonSkills) {
      const cacheKey = this.generateCacheKey('skill_classification', skill);
      const cached = await this.getCachedResult('skill_classification', skill);
      
      if (!cached) {
        // This would trigger actual AI call and cache the result
        console.log(`Pre-computing skill classification for: ${skill}`);
      }
    }
  }

  // Batch similar requests to reduce API calls
  async batchSimilarRequests(operation, inputs) {
    const results = [];
    const uncachedInputs = [];
    const uncachedIndices = [];

    // Check cache for all inputs first
    for (let i = 0; i < inputs.length; i++) {
      const cached = await this.getCachedResult(operation, inputs[i]);
      if (cached) {
        results[i] = cached;
      } else {
        uncachedInputs.push(inputs[i]);
        uncachedIndices.push(i);
      }
    }

    // Process uncached requests (this would be handled by the calling service)
    return { results, uncachedInputs, uncachedIndices };
  }

  // Get cache statistics
  getCacheStats() {
    this.cacheHitRatio = this.totalRequests > 0 ? (this.cacheHits / this.totalRequests) * 100 : 0;
    
    return {
      totalRequests: this.totalRequests,
      cacheHits: this.cacheHits,
      hitRatio: Math.round(this.cacheHitRatio * 100) / 100,
      memoryCacheSize: this.memoryCache.size,
      estimatedSavings: Math.round(this.cacheHits * 0.002 * 100) / 100 // Assuming R0.002 per request
    };
  }

  // Clean old cache entries (run weekly)
  async cleanOldCache() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      await supabase
        .from('ai_cache')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString());

      console.log('🧹 Cleaned old cache entries');
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }

  // Smart similarity matching to reuse similar CV analyses
  findSimilarCV(cvText) {
    // Extract key indicators that make CVs similar
    const indicators = {
      length: cvText.length,
      hasEducation: /education|qualification|degree|diploma/i.test(cvText),
      hasExperience: /experience|worked|employed/i.test(cvText),
      hasSkills: /skills|abilities|proficient/i.test(cvText),
      industry: this.detectIndustry(cvText),
      experienceLevel: this.detectExperienceLevel(cvText)
    };

    return this.generateCacheKey('cv_similarity', JSON.stringify(indicators));
  }

  detectIndustry(text) {
    const industries = {
      'construction': /welding|construction|building|fabrication|plumbing|electrical/i,
      'tech': /javascript|python|programming|software|developer|IT/i,
      'healthcare': /nursing|medical|healthcare|hospital|clinic/i,
      'retail': /sales|retail|customer service|cashier|shop/i,
      'education': /teaching|education|school|training|tutor/i
    };

    for (const [industry, regex] of Object.entries(industries)) {
      if (regex.test(text)) return industry;
    }
    return 'general';
  }

  detectExperienceLevel(text) {
    if (/senior|lead|manager|supervisor|10\+|15\+/i.test(text)) return 'senior';
    if (/junior|entry|graduate|new|fresh/i.test(text)) return 'junior';
    return 'mid';
  }
}

module.exports = new AICacheService();
