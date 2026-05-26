/**
 * Cmp++ Tokenizer Simulator
 * Estimates token counts for different LLMs (GPT-4 cl100k, Gemini, Claude)
 * and compares them with Cmp++ optimized inputs.
 */

const CmpTokenizer = {
  // Simple approximation of BPE tokenization
  estimate: function(text, model = 'gpt4') {
    if (!text) return 0;
    
    // Normalization
    text = text.trim();
    if (text.length === 0) return 0;

    // Different models have different tokenization profiles, especially for Korean.
    let tokenCount = 0;
    
    // Tokenization rules based on model
    if (model === 'gpt4') {
      // cl100k_base style:
      // - English: ~4 characters per token on average (or ~0.75 words per token)
      // - Korean: Korean characters are often split. cl100k_base has poor Korean support,
      //   averaging 1.5 to 2.5 tokens per Korean character (syllable).
      // - Numbers/Symbols: Often 1 token per symbol, numbers group by 2-3 digits.
      
      const words = text.split(/\s+/);
      for (let word of words) {
        if (!word) continue;
        
        // Check if word contains Korean characters
        const koreanMatch = word.match(/[\uac00-\ud7af]/g);
        if (koreanMatch) {
          // Korean characters in cl100k_base: ~2 tokens per character
          tokenCount += koreanMatch.length * 2.0;
          // Count non-korean parts of the word
          const nonKorean = word.replace(/[\uac00-\ud7af]/g, '');
          if (nonKorean.length > 0) {
            tokenCount += Math.max(1, Math.ceil(nonKorean.length / 3.5));
          }
        } else {
          // English/Symbols
          // Group of symbols
          if (/^[!@#$%^&*()_+\-=\[\]{};':",./<>?|\\~`]+$/.test(word)) {
            tokenCount += word.length;
          } else {
            tokenCount += Math.max(1, Math.ceil(word.length / 3.8));
          }
        }
      }
    } else if (model === 'gemini') {
      // Gemini (SentencePiece style with larger multilingual vocabulary):
      // - English: ~4.5 characters per token.
      // - Korean: Better than GPT-4. ~1.0 to 1.3 tokens per character.
      // - Symbols: ~1 token per symbol, but some sequences merge.
      
      const words = text.split(/\s+/);
      for (let word of words) {
        if (!word) continue;
        
        const koreanMatch = word.match(/[\uac00-\ud7af]/g);
        if (koreanMatch) {
          // Korean: ~1.1 tokens per character
          tokenCount += koreanMatch.length * 1.1;
          const nonKorean = word.replace(/[\uac00-\ud7af]/g, '');
          if (nonKorean.length > 0) {
            tokenCount += Math.max(1, Math.ceil(nonKorean.length / 4.2));
          }
        } else {
          if (/^[!@#$%^&*()_+\-=\[\]{};':",./<>?|\\~`]+$/.test(word)) {
            tokenCount += Math.ceil(word.length / 1.5);
          } else {
            tokenCount += Math.max(1, Math.ceil(word.length / 4.2));
          }
        }
      }
    } else { // 'claude' (Tiktoken/Llama style custom vocab)
      // English: ~4 characters per token
      // Korean: ~1.5 tokens per character
      const words = text.split(/\s+/);
      for (let word of words) {
        if (!word) continue;
        
        const koreanMatch = word.match(/[\uac00-\ud7af]/g);
        if (koreanMatch) {
          tokenCount += koreanMatch.length * 1.6;
          const nonKorean = word.replace(/[\uac00-\ud7af]/g, '');
          if (nonKorean.length > 0) {
            tokenCount += Math.max(1, Math.ceil(nonKorean.length / 3.8));
          }
        } else {
          if (/^[!@#$%^&*()_+\-=\[\]{};':",./<>?|\\~`]+$/.test(word)) {
            tokenCount += word.length;
          } else {
            tokenCount += Math.max(1, Math.ceil(word.length / 4.0));
          }
        }
      }
    }

    // Add extra tokens for whitespace and formatting if they are significant
    const spaces = (text.match(/ /g) || []).length;
    const newlines = (text.match(/\n/g) || []).length;
    
    // Spaces are sometimes merged, but let's add a small factor
    tokenCount += spaces * 0.2;
    tokenCount += newlines * 0.5;

    return Math.max(1, Math.round(tokenCount));
  },

  // Calculate detailed stats comparing original and Cmp++
  analyze: function(originalText, cmpText, model = 'gpt4') {
    const origTokens = this.estimate(originalText, model);
    const cmpTokens = this.estimate(cmpText, model);
    
    const origChars = originalText.length;
    const cmpChars = cmpText.length;
    
    const origBytes = new Blob([originalText]).size;
    const cmpBytes = new Blob([cmpText]).size;
    
    const tokenReduction = origTokens > 0 ? ((origTokens - cmpTokens) / origTokens) * 100 : 0;
    const charReduction = origChars > 0 ? ((origChars - cmpChars) / origChars) * 100 : 0;
    const byteReduction = origBytes > 0 ? ((origBytes - cmpBytes) / origBytes) * 100 : 0;
    
    // Estimate price savings based on average pricing ($2.50 per 1M tokens input, e.g., GPT-4o-grade)
    const costPerMillion = 2.50; 
    const origCost = (origTokens / 1000000) * costPerMillion;
    const cmpCost = (cmpTokens / 1000000) * costPerMillion;
    const costSavings = origCost - cmpCost;

    return {
      original: {
        tokens: origTokens,
        chars: origChars,
        bytes: origBytes,
        cost: origCost
      },
      cmp: {
        tokens: cmpTokens,
        chars: cmpChars,
        bytes: cmpBytes,
        cost: cmpCost
      },
      reduction: {
        tokens: Math.max(0, tokenReduction.toFixed(1)),
        chars: Math.max(0, charReduction.toFixed(1)),
        bytes: Math.max(0, byteReduction.toFixed(1)),
        costSavings: costSavings.toFixed(6)
      }
    };
  }
};

// Export if in Node, otherwise attach to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CmpTokenizer;
} else {
  window.CmpTokenizer = CmpTokenizer;
}
