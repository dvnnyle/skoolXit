/**
 * Formats explanation text with markdown-style syntax
 * Converts:
 * - \n\n to <br><br> for paragraph breaks
 * - \n to <br> for line breaks
 * - **text** to <strong>text</strong> for bold
 * - 'text' to <span class='highlight'>text</span> for highlighting
 * - Bullet points starting with - to <li> elements in <ul>
 * - Numbered items like "1) text" to <li> elements in <ol>
 * - ```python code blocks with syntax highlighting
 */

// Syntax highlighting for Python code with line numbers
const highlightPython = (code) => {
  // Python keywords
  const keywords = ['def', 'if', 'elif', 'else', 'for', 'while', 'return', 'import', 'from', 'class', 'in', 'range', 'print', 'len', 'append', 'del', 'True', 'False', 'None'];
  
  // Split code into tokens to avoid overlapping replacements
  const lines = code.split('\n');
  
  const highlightedLines = lines.map(line => {
    // Store strings temporarily with placeholders
    const strings = [];
    let tempLine = line.replace(/(['"])(?:(?=(\\?))\2.)*?\1/g, (match) => {
      strings.push(match);
      return `__STRING_${strings.length - 1}__`;
    });
    
    // Store comments temporarily
    const comments = [];
    tempLine = tempLine.replace(/(#.+)$/g, (match) => {
      comments.push(match);
      return `__COMMENT_${comments.length - 1}__`;
    });
    
    // Highlight function calls (before keywords to avoid conflicts)
    tempLine = tempLine.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="function">$1</span>');
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      tempLine = tempLine.replace(regex, '<span class="keyword">$1</span>');
    });
    
    // Highlight numbers (avoid matching inside already highlighted code)
    tempLine = tempLine.replace(/\b(\d+\.?\d*)\b/g, (match, num) => {
      // Don't highlight if it's inside a span tag
      return `<span class="number">${num}</span>`;
    });
    
    // Restore comments
    comments.forEach((comment, i) => {
      tempLine = tempLine.replace(`__COMMENT_${i}__`, `<span class="comment">${comment}</span>`);
    });
    
    // Restore strings
    strings.forEach((str, i) => {
      tempLine = tempLine.replace(`__STRING_${i}__`, `<span class="string">${str}</span>`);
    });
    
    return tempLine;
  });
  
  // Add line numbers
  const numberedLines = highlightedLines.map((line, index) => {
    const lineNum = (index + 1).toString().padStart(2, ' ');
    return `<span class="line-number">${lineNum}</span>${line}`;
  });
  
  return numberedLines.join('\n');
};

export const formatExplanation = (text) => {
  if (!text) return '';
  
  let result = text;
  
  // Handle code blocks first (before other replacements)
  result = result.replace(/```python\n?([\s\S]*?)```/g, (match, code) => {
    const highlighted = highlightPython(code.trim());
    return `<pre><code>${highlighted}</code></pre>`;
  });
  
  // Handle inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  result = result
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold text
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
  // First, convert individual bullets to <li> tags
  result = result.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
  
  // Wrap consecutive <li> items in <ul>
  result = result.replace(/(<li>[\s\S]+?<\/li>\n?)+/g, (match) => {
    return '<ul>' + match.trim() + '</ul>';
  });
  
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
