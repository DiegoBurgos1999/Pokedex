# Pokédex

## 🔗 [https://pokedex-sandy-xi.vercel.app/](https://pokedex-sandy-xi.vercel.app/)

Desplegada en Vercel.

Aplicación SPA construida con Vue 3 sobre la
[PokéAPI](https://pokeapi.co/) pública.

## Cómo se formuló

Aunque es un proyecto sencillo, quise orientar mi desarrollo hacia la metodología Spec-Driven Development, la cual propone entender muy bien lo que se quiere construir y, posteriormente, escribir una especificación clara y determinística de ello. Mi punto de partida fue el diseño, para el cual usé Claude Design. Como primer acercamiento tuve que entender el Figma, su flujo y sus casos límite edge cases; a partir de ahí ideé un boceto de las pantallas y de dónde se ubicaría cada elemento en la versión de escritorio. Con ese boceto, más un prompt claro de los requerimientos, las pantallas a desarrollar, las funcionalidades y el look and feel de la app, obtuve un prototipo muy cercano a lo que quería, y fui iterando sobre assets, colores y animaciones.

Una vez que el diseño estuvo muy cerca de lo que quería, empecé a redactar las especificaciones claras de lo que había en el diseño y de lo que quería lograr, esta vez con un enfoque mucho más lógico: explicando pantalla por pantalla y flujo por flujo qué se quería y qué no, junto con objetivos, reglas de negocio, criterios de aceptación, restricciones técnicas, pequeños hacks y otras cosas fundamentales, para que Claude usara este documento como fuente de la verdad al escribir el código.

Por último, pasamos a la etapa de revisión e iteración del producto final: revisamos línea por línea lo generado por los agentes para asegurar la calidad de lo escrito. Se encontraron algunos errores de sintaxis y algunas implementaciones que, desde mi punto de vista, no tenían la calidad suficiente y podían mejorarse. Luego se hizo un recorrido interactivo por la app, ejecutando varios flujos, para comprobar el correcto funcionamiento de lo generado.

Notas:

1. Hubo que elegir entre paginar del lado del cliente o del backend, ya que esta API no expone un endpoint con filtros (por nombre o tipo). Por eso se priorizó mantener la paginación del lado del backend, dado que pueden ser n registros y solo obtenemos de a 12, con la desventaja de que los filtros solo actúan sobre la información ya visualizada. (Se descartó pedir todos los Pokémon de una vez, porque la información de la API puede crecer mucho más y esa petición tan grande haría la app mucho más lenta. También vale la pena mencionar que la mayoría de las APIs limitan el número máximo de objetos solicitados).
2. En las pantallas donde se realizan llamadas a la API se tuvieron en cuenta los estados de carga, error y vacío, para cubrir todos los casos posibles.
3. Se agregaron herramientas adicionales como linters, formatters, frameworks de pruebas y de estilos, para que el trabajo fuera más ágil y de mejor calidad.
4. Algunos tokens de estilo están hardcodeados para aportar mejor estilo visual, aunque soy consciente de que no es del todo una buena práctica, ya que puede fallar en algunos casos límite de ciertos Pokémon.
5. Agregué algunos elementos que aportan mejor UI/UX al usuario, como toasts de confirmación, modales de confirmación, botones flotantes, entre otros.
6. La app es funcional únicamente en escritorio; por cuestiones de tiempo no se implementó el diseño responsive.
7. Cabe destacar que en el archivo CLAUDE.md escribí toda la estructura que quería para este proyecto, lo que no quería que pasara o no quería implementar, entre otras instrucciones de gran importancia.

## Tecnologías

| Parte           | Elección                         | Motivo                                                                                               |
| --------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Lenguaje        | TypeScript estricto              | Mantener un tipado estricto para evitar errores en el manejo de datos y objetos.                     |
| Estado servidor | TanStack Vue Query               | Manejar de forma más sencilla el caché, los reintentos y otros estados de las peticiones.            |
| Estilos         | Tailwind v4 + tokens en `@theme` | Generados a partir de las iteraciones en Claude Design, y facilidad para escribir estilos complejos. |
| Testing         | Vitest + @vue/test-utils         | Creación e implementación de tests fáciles y rápidos.                                                |
| Linting         | ESLint + Prettier                | Mantener reglas de escritura consistentes para facilitar el mantenimiento de la app.                 |

## Requisitos

Node 22 (ver `.nvmrc`) y pnpm.

## Instalación

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Scripts

| Comando              | Descripción                                        |
| -------------------- | -------------------------------------------------- |
| `pnpm dev`           | Servidor de desarrollo                             |
| `pnpm build`         | Verifica tipos y genera el build de producción     |
| `pnpm preview`       | Sirve el build de producción                       |
| `pnpm lint`          | ESLint; falla ante cualquier advertencia           |
| `pnpm format`        | Formatea con Prettier                              |
| `pnpm typecheck`     | `vue-tsc` sobre todas las referencias del proyecto |
| `pnpm test`          | Vitest, ejecución única                            |
| `pnpm test:coverage` | Vitest con reporte de cobertura                    |

## Estructura

```
design/         Exportación de Claude Design, referencia visual de solo lectura
src/app/        Shell de la aplicación: router, providers, layouts
src/features/   Módulos de features, cada uno dueño de su api, model, state y views
src/shared/     Primitivas compartidas entre features: cliente http, átomos de ui, tokens
```
