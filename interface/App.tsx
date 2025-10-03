import { ProblemDescription } from "./components/ProblemDescription";
import { CodeEditor } from "./components/CodeEditor";
import { TestCases } from "./components/TestCases";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { PlayCircle, Upload, Settings } from "lucide-react";
import "./styles/globals.css";

export default function App() {
  return (
    <div className="size-full flex flex-col">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h2 className="text-primary">LeetCode</h2>
          <nav className="flex gap-1">
            <Button variant="ghost" size="sm">
              Explore
            </Button>
            <Button variant="ghost" size="sm">
              Problems
            </Button>
            <Button variant="ghost" size="sm">
              Contest
            </Button>
            <Button variant="ghost" size="sm">
              Discuss
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Problem Description */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full border-r">
              <Tabs defaultValue="description" className="h-full flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="editorial">Editorial</TabsTrigger>
                  <TabsTrigger value="solutions">Solutions</TabsTrigger>
                  <TabsTrigger value="submissions">Submissions</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="flex-1 overflow-hidden mt-0">
                  <ProblemDescription />
                </TabsContent>
                <TabsContent value="editorial" className="flex-1 overflow-auto p-6 mt-0">
                  <h3 className="mb-4">Editorial</h3>
                  <p className="text-muted-foreground">
                    Editorial content will be available after the contest ends.
                  </p>
                </TabsContent>
                <TabsContent value="solutions" className="flex-1 overflow-auto p-6 mt-0">
                  <h3 className="mb-4">Solutions</h3>
                  <p className="text-muted-foreground">
                    Check out solutions submitted by the community.
                  </p>
                </TabsContent>
                <TabsContent value="submissions" className="flex-1 overflow-auto p-6 mt-0">
                  <h3 className="mb-4">Submissions</h3>
                  <p className="text-muted-foreground">You haven't made any submissions yet.</p>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Code Editor & Test Cases */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <ResizablePanelGroup direction="vertical">
              {/* Code Editor */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <CodeEditor />
              </ResizablePanel>

              <ResizableHandle />

              {/* Test Cases / Console */}
              <ResizablePanel defaultSize={40} minSize={20}>
                <TestCases />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Footer with Action Buttons */}
      <footer className="h-14 border-t flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Console
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <PlayCircle className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </div>
      </footer>
    </div>
  );
}