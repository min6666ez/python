import React, { useState, useEffect, useCallback } from 'react';
import { usePyodide } from '../contexts/PyodideContext';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { Compartment } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { oneLight } from '@codemirror/theme-one-light';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { lintGutter, linter } from '@codemirror/lint';
import { syntaxHighlighting, HighlightStyle, tags } from '@codemirror/language';
import { searchKeymap, highlightActiveLine, highlightActiveLineGutter, lineNumbers, highlightSelectionMatches } from '@codemirror/view';
import { foldGutter, foldKeymap } from '@codemirror/fold';
import { bracketMatching, bracketMatchingKeymap } from '@codemirror/matchbrackets';
import { commentKeymap } from '@codemirror/comment';
import { PythonLinter } from './PythonLinter';

interface PythonEditorProps {
  initialCode: string;
  onRun: (code: string) => void;
  isExecuting?: boolean;
}

const customHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#c792ea' },
  { tag: tags.string, color: '#c3e88d' },
  { tag: tags.number, color: '#f78c6c' },
  { tag: tags.boolean, color: '#ff5370' },
  { tag: tags.null, color: '#ff5370' },
  { tag: tags.operator, color: '#89ddff' },
  { tag: tags.function(tags.variableName), color: '#82aaff' },
  { tag: tags.function(tags.propertyName), color: '#82aaff' },
  { tag: tags.className, color: '#ffcb6b' },
  { tag: tags.typeName, color: '#ffcb6b' },
  { tag: tags.attributeName, color: '#c792ea' },
  { tag: tags.comment, color: '#676e95', fontStyle: 'italic' },
  { tag: tags.meta, color: '#676e95' },
  { tag: tags.bracket, color: '#89ddff' },
]);

export const PythonEditor: React.FC<PythonEditorProps> = ({ initialCode, onRun, isExecuting = false }) => {
  const [code, setCode] = useState(initialCode);
  const [isDark, setIsDark] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showWhitespace, setShowWhitespace] = useState(false);
  const { isLoading, loadProgress } = usePyodide();

  const themeCompartment = new Compartment();

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleRun = useCallback(() => {
    onRun(code);
  }, [code, onRun]);

  const handleReset = useCallback(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
  }, [code]);

  const handleFontIncrease = useCallback(() => {
    setFontSize(prev => Math.min(prev + 2, 24));
  }, []);

  const handleFontDecrease = useCallback(() => {
    setFontSize(prev => Math.max(prev - 2, 10));
  }, []);

  const handleToggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const isDisabled = isLoading || isExecuting;

  const extensions = [
    lineNumbers({ enabled: showLineNumbers }),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    highlightSelectionMatches(),
    foldGutter(),
    bracketMatching(),
    closeBrackets(),
    history(),
    autocompletion(),
    lintGutter(),
    linter(PythonLinter),
    python(),
    syntaxHighlighting(customHighlightStyle),
    themeCompartment.of(isDark ? oneDark : oneLight),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        setCode(update.state.doc.toString());
      }
    }),
    EditorView.theme({
      '&': { fontSize: `${fontSize}px` },
      '.cm-scroller': { overflow: 'auto' },
    }),
    showWhitespace && EditorView.showWhitespace,
    EditorView.keyMap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...completionKeymap,
      ...closeBracketsKeymap,
      ...foldKeymap,
      ...bracketMatchingKeymap,
      ...commentKeymap,
      ...searchKeymap,
    ]),
  ].filter(Boolean);

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
      <div className="flex gap-1 p-2 bg-gray-800 items-center flex-wrap">
        <button
          onClick={handleRun}
          disabled={isDisabled}
          className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium transition-all"
          title={isLoading ? `Python环境加载中: ${loadProgress}%` : undefined}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              加载中... {loadProgress}%
            </>
          ) : isExecuting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              运行中...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
              运行
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          disabled={isDisabled}
          className="px-4 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          重置
        </button>
        <button
          onClick={handleCopy}
          disabled={isDisabled}
          className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          复制
        </button>
        <div className="h-6 w-px bg-gray-600 mx-2"></div>
        <button
          onClick={handleFontDecrease}
          className="px-2 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 flex items-center gap-1 text-sm transition-all"
          title="减小字体"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
          </svg>
        </button>
        <span className="text-gray-400 text-xs px-2">{fontSize}px</span>
        <button
          onClick={handleFontIncrease}
          className="px-2 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 flex items-center gap-1 text-sm transition-all"
          title="增大字体"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
        </button>
        <div className="h-6 w-px bg-gray-600 mx-2"></div>
        <button
          onClick={handleToggleTheme}
          className="px-2 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 flex items-center gap-1 text-sm transition-all"
          title={isDark ? '切换到浅色主题' : '切换到深色主题'}
        >
          {isDark ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          )}
        </button>
        <button
          onClick={() => setShowLineNumbers(!showLineNumbers)}
          className={`px-2 py-1.5 rounded flex items-center gap-1 text-sm transition-all ${showLineNumbers ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
          title="显示行号"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>
        <button
          onClick={() => setShowWhitespace(!showWhitespace)}
          className={`px-2 py-1.5 rounded flex items-center gap-1 text-sm transition-all ${showWhitespace ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
          title="显示空白字符"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div className="ml-auto text-gray-400 text-xs px-2">
          Python 3
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          extensions={extensions}
          onChange={(value) => setCode(value)}
        />
      </div>
    </div>
  );
};
