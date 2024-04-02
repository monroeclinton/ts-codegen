import * as ts from "typescript";

const codegen = (funcName: string, url: string, params: Array<string>) => {
  return ts.factory.createFunctionDeclaration(
    undefined,
    undefined,
    ts.factory.createIdentifier(funcName),
    undefined,
    params.map((param) =>
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        ts.factory.createIdentifier(param),
        undefined,
        undefined,
        undefined
      )
    ),
    undefined,
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createIdentifier("fetch"),
            undefined,
            [
              ts.factory.createBinaryExpression(
                ts.factory.createStringLiteral(url),
                ts.factory.createToken(ts.SyntaxKind.PlusToken),
                ts.factory.createNewExpression(
                  ts.factory.createIdentifier("URLSearchParams"),
                  undefined,
                  [
                    ts.factory.createObjectLiteralExpression(
                      params.map((param) =>
                        ts.factory.createShorthandPropertyAssignment(
                          ts.factory.createIdentifier(param),
                          undefined
                        )
                      ),
                      false
                    ),
                  ]
                )
              ),
            ]
          )
        ),
      ],
      true
    )
  );
};

export default codegen;
