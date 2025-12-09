/**
 * Formats explanation text with markdown-style syntax
 * Converts:
 * - \n\n to <br><br> for paragraph breaks
 * - \n to <br> for line breaks
 * - **text** to <strong>text</strong> for bold
 * - 'text' to <span class='highlight'>text</span> for highlighting
 */
export const formatExplanation = (text) => {
  if (!text) return '';
  
  return text
    .replace(/\n\n/g, '<br><br>')          // Paragraph breaks
    .replace(/\n/g, '<br>')                // Line breaks
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/'([^']+)'/g, "<span class='highlight'>$1</span>"); // Quote highlighting
};
