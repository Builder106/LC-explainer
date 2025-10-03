import { Badge } from "./ui/badge";

export function ProblemDescription() {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex items-center gap-2 mb-4">
        <h1>1. Two Sum</h1>
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Easy</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <p>
            Given an array of integers <code className="bg-muted px-1.5 py-0.5 rounded">nums</code> and an integer{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded">target</code>, return{" "}
            <em>indices of the two numbers such that they add up to target</em>.
          </p>
        </div>

        <div>
          <p>
            You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the{" "}
            <em>same</em> element twice.
          </p>
        </div>

        <div>
          <p>You can return the answer in any order.</p>
        </div>

        <div className="space-y-3">
          <h3>Example 1:</h3>
          <div className="bg-muted/50 p-4 rounded-lg space-y-1">
            <p>
              <strong>Input:</strong> nums = [2,7,11,15], target = 9
            </p>
            <p>
              <strong>Output:</strong> [0,1]
            </p>
            <p>
              <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3>Example 2:</h3>
          <div className="bg-muted/50 p-4 rounded-lg space-y-1">
            <p>
              <strong>Input:</strong> nums = [3,2,4], target = 6
            </p>
            <p>
              <strong>Output:</strong> [1,2]
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3>Example 3:</h3>
          <div className="bg-muted/50 p-4 rounded-lg space-y-1">
            <p>
              <strong>Input:</strong> nums = [3,3], target = 6
            </p>
            <p>
              <strong>Output:</strong> [0,1]
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3>Constraints:</h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <code className="bg-muted px-1.5 py-0.5 rounded">2 {'<='} nums.length {'<='} 10⁴</code>
            </li>
            <li>
              <code className="bg-muted px-1.5 py-0.5 rounded">-10⁹ {'<='} nums[i] {'<='} 10⁹</code>
            </li>
            <li>
              <code className="bg-muted px-1.5 py-0.5 rounded">-10⁹ {'<='} target {'<='} 10⁹</code>
            </li>
            <li>
              <strong>Only one valid answer exists.</strong>
            </li>
          </ul>
        </div>

        <div className="pt-4">
          <p className="text-muted-foreground">
            <strong>Follow-up:</strong> Can you come up with an algorithm that is less than O(n²) time complexity?
          </p>
        </div>
      </div>
    </div>
  );
}