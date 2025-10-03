import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CheckCircle2, XCircle, PlayCircle } from "lucide-react";

interface TestCase {
  id: number;
  input: string;
  expected: string;
  output?: string;
  passed?: boolean;
}

export function TestCases() {
  const [testCases] = useState<TestCase[]>([
    {
      id: 1,
      input: "nums = [2,7,11,15], target = 9",
      expected: "[0,1]",
    },
    {
      id: 2,
      input: "nums = [3,2,4], target = 6",
      expected: "[1,2]",
    },
    {
      id: 3,
      input: "nums = [3,3], target = 6",
      expected: "[0,1]",
    },
  ]);

  const [results, setResults] = useState<TestCase[]>([
    {
      id: 1,
      input: "nums = [2,7,11,15], target = 9",
      expected: "[0,1]",
      output: "[0,1]",
      passed: true,
    },
    {
      id: 2,
      input: "nums = [3,2,4], target = 6",
      expected: "[1,2]",
      output: "[1,2]",
      passed: true,
    },
  ]);

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="testcases" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4">
          <TabsTrigger value="testcases">Testcases</TabsTrigger>
          <TabsTrigger value="result">Test Result</TabsTrigger>
        </TabsList>

        <TabsContent value="testcases" className="flex-1 overflow-auto p-4 mt-0">
          <div className="space-y-3">
            {testCases.map((testCase) => (
              <div key={testCase.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Case {testCase.id}</span>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-muted-foreground">Input: </span>
                    <code className="bg-muted px-1.5 py-0.5 rounded">{testCase.input}</code>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected: </span>
                    <code className="bg-muted px-1.5 py-0.5 rounded">{testCase.expected}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="result" className="flex-1 overflow-auto p-4 mt-0">
          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className={result.passed ? "text-green-600" : "text-red-600"}>
                    Case {result.id}
                  </span>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-muted-foreground">Input: </span>
                    <code className="bg-muted px-1.5 py-0.5 rounded">{result.input}</code>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Output: </span>
                    <code className="bg-muted px-1.5 py-0.5 rounded">{result.output}</code>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected: </span>
                    <code className="bg-muted px-1.5 py-0.5 rounded">{result.expected}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}