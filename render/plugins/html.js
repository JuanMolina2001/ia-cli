import { readFileSync } from 'fs';
import path from 'path';

export default function htmlPlugin(options = {}) {
  return {
    name: 'vite-html-import-plugin',

    // Resolver las importaciones de archivos estáticos
    async resolveId(source, importer) {
      if (source.endsWith('.html')) {
        // Resuelve la ruta relativa usando this.resolve
        const resolvedPath = await this.resolve(source, importer);
        return resolvedPath ? resolvedPath.id : source;  // Resolver el ID para archivos .html
      }
      return null;  // Dejar que otros plugins manejen otros tipos de archivos
    },

    // Transformar el contenido del archivo importado
    load(id) {
      if (id.endsWith('.html')) {
        const filePath = path.resolve(id);
        const content = readFileSync(filePath, 'utf-8');
        return `export default ${JSON.stringify(content)}`;  // Exportar el contenido del HTML como cadena
      }
      return null;
    }
  };
}
