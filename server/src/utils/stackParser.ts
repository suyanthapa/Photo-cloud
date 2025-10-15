// src/utils/stackParser.ts
export interface StackFrame {
  function: string;
  file: string;
  line: number;
  column: number;
}

export const parseStack = (stack?: string): StackFrame[] => {
  if (!stack) return [];

  const lines = stack.split("\n").slice(1); // skip first line (error message)
  const stackFrames: StackFrame[] = [];

  const regex = /\s*at\s+(.*)\s+\((.*):(\d+):(\d+)\)/;

  lines.forEach((line) => {
    const match = line.match(regex);
    if (match) {
      const [, fn, file, lineNum, colNum] = match;
      stackFrames.push({
        function: fn,
        file: file.split("/").pop() || file, // just file name
        line: parseInt(lineNum, 10),
        column: parseInt(colNum, 10),
      });
    }
  });

  return stackFrames;
};
