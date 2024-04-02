import * as ts from "typescript";
import * as fs from "fs";
import codegen from "./codegen";

const inputFile = "./example.ts";
const outputFile = "./example.js";

const compilerOptions = {};

const run = () => {
  const host = ts.createCompilerHost(compilerOptions);
  const program = ts.createProgram([inputFile], compilerOptions, host);
  const printer: ts.Printer = ts.createPrinter();
  const sourceFile = program.getSourceFile(inputFile)!;

  const result = ts.transform(sourceFile, [parseJSDoc.bind(null, program)]);

  const transformedSourceFile: ts.SourceFile = result.transformed[0];
  let content = printer.printFile(transformedSourceFile);

  fs.writeFileSync(outputFile, content);
};

const parseJSDoc = (
  program: ts.Program,
  context: ts.TransformationContext
): ts.Transformer<ts.SourceFile> => {
  program.getTypeChecker();

  return (sourceFile: ts.SourceFile) => {
    const visit = (node: ts.Node): ts.Node => {
      if (ts.isFunctionDeclaration(node)) {
        const tags = ts.getJSDocTags(node);
        const sdkParamsTags =
          tags?.filter((t) => t.tagName.escapedText === "sdkparams") || [];

        const sdkFuncName = tags
          ?.find((t) => t.tagName.escapedText === "sdkfunction")
          ?.comment?.toString();
        const sdkUrl = tags
          ?.find((t) => t.tagName.escapedText === "sdkurl")
          ?.comment?.toString();
        const sdkParams: Array<string> = sdkParamsTags
          .filter((param) => param.comment !== undefined)
          .map((param) => param.comment!.toString());

        if (sdkFuncName && sdkUrl) {
          return codegen(sdkFuncName, sdkUrl, sdkParams);
        }
      }

      return node;
    };

    const visitAll = <T extends ts.Node>(node: T): T =>
      ts.visitEachChild(visit(node), (child) => visitAll(child), context) as T;

    return visitAll(sourceFile);
  };
};

run();
