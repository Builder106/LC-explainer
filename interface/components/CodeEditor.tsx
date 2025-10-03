import { useState } from "react";

export function CodeEditor() {
  const [code, setCode] = useState(`function twoSum(nums, target) {
    // Write your solution here
    
}`);

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-[#3e3e3e]">
        <span className="text-gray-300">JavaScript</span>
      </div>
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="absolute inset-0 w-full h-full bg-[#1e1e1e] text-gray-100 p-4 resize-none outline-none border-none"
          style={{
            fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
            fontSize: "14px",
            lineHeight: "1.6",
            tabSize: 4,
          }}
          spellCheck={false}
        />
      </div>
    </div>
  );
}