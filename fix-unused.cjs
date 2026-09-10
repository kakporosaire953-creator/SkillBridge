const { Project, SyntaxKind } = require('ts-morph');
const project = new Project({ tsConfigFilePath: 'tsconfig.json' });

const sourceFiles = project.getSourceFiles('src/services/**/*.ts');
for (const file of sourceFiles) {
  let changed = false;
  
  // Prefix unused function parameters with _
  file.getDescendantsOfKind(SyntaxKind.Parameter).forEach(param => {
    const nameNode = param.getNameNode();
    if (nameNode && nameNode.getKind() === SyntaxKind.Identifier) {
      const name = nameNode.getText();
      if (!name.startsWith('_')) {
        // Very basic heuristic for this specific cleanup task
        const refs = nameNode.findReferencesAsNodes();
        // If it's only referenced where it's declared (length 1)
        if (refs.length === 1) {
          nameNode.replaceWithText(`_${name}`);
          changed = true;
        }
      }
    }
  });

  // Prefix unused variable declarations with _
  file.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach(decl => {
    const nameNode = decl.getNameNode();
    if (nameNode && nameNode.getKind() === SyntaxKind.Identifier) {
      const name = nameNode.getText();
      if (!name.startsWith('_') && name !== 'AVATAR_BUCKET') { // specific skips
        const refs = nameNode.findReferencesAsNodes();
        if (refs.length === 1 && !decl.isExported()) {
          nameNode.replaceWithText(`_${name}`);
          changed = true;
        }
      }
    }
  });

  if (changed) {
    file.saveSync();
    console.log('Fixed unused in', file.getFilePath());
  }
}
