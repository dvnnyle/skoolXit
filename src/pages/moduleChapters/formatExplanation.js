/**
 * Formats explanation text with markdown-style syntax
 * Converts:
 * - \n\n to <br><br> for paragraph breaks
 * - \n to <br> for line breaks
 * - **text** to <strong>text</strong> for bold
 * - 'text' to <span class='highlight'>text</span> for highlighting
 * - Bullet points starting with - to <li> elements in <ul>
 * - Numbered items like "1) text" to <li> elements in <ol>
 */
export const formatExplanation = (text) => {
  if (!text) return '';
  
  let result = text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold text first
    .replace(/'([^']+)'/g, "<span class='highlight'>$1</span>"); // Quote highlighting
  
  // Handle numbered lists (e.g., "1) text", "2) text", etc.)
  const numberedListPattern = /(\d+\))\s+([^\n]+)/g;
  if (numberedListPattern.test(result)) {
    result = result.replace(/(\d+\))\s+([^\n]+)/g, '<li>$2</li>');
    // Wrap consecutive <li> items in <ol>
    result = result.replace(/(<li>.*?<\/li>)/s, (match) => {
      return '<ol>' + match + '</ol>';
    });
  }
  
  // Handle bullet points starting with - 
  const bulletPattern = /^-\s+(.+)$/gm;
  if (bulletPattern.test(result)) {
    result = result.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
    // Wrap consecutive <li> items in <ul>
    result = result.replace(/(<li>.*?<\/li>)/s, (match) => {
      return '<ul>' + match + '</ul>';
    });
  }
  
  // Handle line breaks and paragraph breaks
  result = result
    .replace(/\n\n/g, '</p><p>')          // Paragraph breaks
    .replace(/\n/g, '<br>');              // Line breaks
  
  // Wrap in paragraphs if not already wrapped
  if (!result.includes('<p>') && !result.includes('<ul>') && !result.includes('<ol>')) {
    result = '<p>' + result + '</p>';
  }
  
  return result;
};
