import { linter } from '@codemirror/lint';

export const PythonLinter = linter((view) => {
  const diagnostics: any[] = [];
  const text = view.state.doc.toString();
  const lines = text.split('\n');
  
  lines.forEach((line, lineIndex) => {
    // 检查缩进问题（Python特定）
    if (line.length > 0 && !/^[ \t]*$/.test(line)) {
      const leadingSpaces = line.match(/^ */)?.[0]?.length || 0;
      const leadingTabs = line.match(/^\t*/)?.[0]?.length || 0;
      
      if (leadingSpaces > 0 && leadingTabs > 0) {
        diagnostics.push({
          from: lineIndex * 2,
          to: (lineIndex * 2) + Math.min(leadingSpaces, leadingTabs),
          severity: 'warning',
          message: '混合使用空格和制表符缩进'
        });
      }
      
      if (leadingSpaces % 4 !== 0 && leadingSpaces > 0) {
        diagnostics.push({
          from: lineIndex * 2,
          to: (lineIndex * 2) + leadingSpaces,
          severity: 'warning',
          message: '缩进应该是4的倍数'
        });
      }
    }
    
    // 检查未闭合的括号
    let openParens = 0;
    let openBrackets = 0;
    let openBraces = 0;
    
    for (let i = 0; i < line.length; i++) {
      switch (line[i]) {
        case '(': openParens++; break;
        case ')': openParens--; break;
        case '[': openBrackets++; break;
        case ']': openBrackets--; break;
        case '{': openBraces++; break;
        case '}': openBraces--; break;
      }
    }
    
    if (openParens > 0) {
      diagnostics.push({
        from: lineIndex * 2 + line.length - 1,
        to: lineIndex * 2 + line.length,
        severity: 'error',
        message: `未闭合的括号: ${openParens} 个`
      });
    }
    if (openBrackets > 0) {
      diagnostics.push({
        from: lineIndex * 2 + line.length - 1,
        to: lineIndex * 2 + line.length,
        severity: 'error',
        message: `未闭合的方括号: ${openBrackets} 个`
      });
    }
    if (openBraces > 0) {
      diagnostics.push({
        from: lineIndex * 2 + line.length - 1,
        to: lineIndex * 2 + line.length,
        severity: 'error',
        message: `未闭合的花括号: ${openBraces} 个`
      });
    }
    
    // 检查 print 语句（Python 2 vs Python 3）
    if (/^[^#]*print\s+\(/.test(line)) {
      // 这是正确的 Python 3 语法，不报错
    } else if (/^[^#]*print\s+[^(]/.test(line)) {
      diagnostics.push({
        from: lineIndex * 2 + line.indexOf('print'),
        to: lineIndex * 2 + line.indexOf('print') + 5,
        severity: 'error',
        message: 'Python 3 需要使用 print() 函数'
      });
    }
    
    // 检查常见的拼写错误
    const commonMisspellings = [
      { wrong: 'defualt', correct: 'default' },
      { wrong: 'funtion', correct: 'function' },
      { wrong: 'retun', correct: 'return' },
      { wrong: 'whlie', correct: 'while' },
      { wrong: 'thsi', correct: 'this' },
      { wrong: 'teh', correct: 'the' },
    ];
    
    commonMisspellings.forEach(({ wrong, correct }) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'g');
      let match;
      while ((match = regex.exec(line)) !== null) {
        diagnostics.push({
          from: lineIndex * 2 + match.index,
          to: lineIndex * 2 + match.index + wrong.length,
          severity: 'warning',
          message: `可能拼错了，应该是 "${correct}"`
        });
      }
    });
  });
  
  return diagnostics;
});
