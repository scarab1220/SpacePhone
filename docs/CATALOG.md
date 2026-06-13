# Guía para gestionar el catálogo

Todo el catálogo vive en **un solo archivo**: `src/data/catalog.json`.

Editar, guardar, listo. No se necesita base de datos ni cuenta externa.

## Estructura

```jsonc
{
  "categories": [
    {
      "slug": "smartphones",          // URL: /catalogo/smartphones (único, sin espacios, minúsculas)
      "title": "Smartphones",         // Lo que ve el usuario
      "icon": "smartphone",           // Ícono Material Symbols (https://fonts.google.com/icons)
      "description": "...",           // Opcional
      "order": 1,                     // Orden en menús (menor primero)
      "subcategories": [
        {
          "slug": "iphone",           // URL: /catalogo/smartphones/iphone
          "title": "iPhone",
          "icon": "apple",
          "order": 1
        }
      ]
    }
  ],
  "products": [
    {
      "slug": "iphone-15-pro-128",         // URL: /producto/iphone-15-pro-128 (único)
      "title": "iPhone 15 Pro 128GB",
      "categorySlug": "smartphones",       // Debe coincidir con un slug de category
      "subcategorySlug": "iphone",         // Debe coincidir con un slug de subcategory
      "priceUSD": 999.00,                  // Número, sin comillas. Siempre en USD.
      "imageUrl": "https://...",           // URL pública de la imagen (Unsplash, Imgur, Cloudinary, etc.)
      "badge": "Nuevo",                    // Opcional. Ej: "Oferta", "Seminuevo"
      "description": "...",                // Opcional
      "specs": [                           // Opcional. Tabla de especificaciones.
        { "label": "Pantalla", "value": "6.1\" OLED" }
      ],
      "stock": 5,                          // Opcional
      "featured": true                     // Opcional. Aparece en la home si es true.
    }
  ]
}
```

## Reglas para no romper la web

1. **JSON válido**: las comas, comillas y llaves importan. Si tienes duda, pega el archivo en https://jsonlint.com antes de guardar.
2. **`slug` único y URL-safe**: solo letras minúsculas, números y guiones. Ej: `iphone-15-pro`, no `iPhone 15 Pro!`.
3. **Los productos deben apuntar a una categoría/subcategoría que exista**: `categorySlug` y `subcategorySlug` deben existir en la sección `categories`.
4. **Imágenes**: usa URLs públicas (https://...). Sugerencias:
   - [Unsplash](https://unsplash.com) — gratis, pega la URL de la imagen
   - [Imgur](https://imgur.com) — sube, copia link directo (termina en .jpg/.png)
   - [Cloudinary](https://cloudinary.com) — gratis hasta cierto límite
5. **Precios siempre en USD** como número (`999.00`, no `"$999"`).

## Cómo agregar un producto

1. Abre `src/data/catalog.json`.
2. Copia un producto existente como plantilla.
3. Cambia `slug`, `title`, `priceUSD`, `imageUrl`, etc.
4. Asegúrate de que `categorySlug` y `subcategorySlug` ya existan.
5. Guarda. La web se actualiza sola.

## Cómo agregar una categoría/subcategoría nueva

1. En `categories`, agrega un objeto siguiendo el ejemplo.
2. Si es subcategoría, va dentro del array `subcategories` de su categoría.
3. Guarda.

## Iconos

Lista completa: https://fonts.google.com/icons
Usa el nombre exacto del ícono (minúsculas con guiones bajos). Ejemplos: `smartphone`, `headphones`, `bolt`, `shopping_bag`.
