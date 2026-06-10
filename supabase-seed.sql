-- Datos de ejemplo para Ropa Unicolor
-- Ejecutar después del schema

INSERT INTO productos (nombre, descripcion, precio_minorista, precio_mayorista, imagenes, tallas, colores, categoria) VALUES
(
  'Polera Algodón Premium',
  'Polera de algodón peinado 100% premium. Ideal para el día a día, súper suave al tacto y resistente a múltiples lavados.',
  8900, 6500,
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80', 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&q=80'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Blanco', 'Negro', 'Gris', 'Azul Marino'],
  'poleras'
),
(
  'Polera Manga Larga',
  'Polera manga larga en algodón suave. Perfecta para los días más frescos. Costuras reforzadas y cuello ribeteado.',
  10900, 7900,
  ARRAY['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Blanco', 'Negro', 'Gris Oxford', 'Verde Oliva'],
  'poleras'
),
(
  'Pantalón Jogger',
  'Pantalón jogger en algodón con elastano. Cintura elástica con cordón ajustable. Bolsillos laterales.',
  15900, 11900,
  ARRAY['https://images.unsplash.com/photo-1596993100471-7c8f9a4c5b5c?w=600&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Negro', 'Gris', 'Azul Marino', 'Caqui'],
  'pantalones'
),
(
  'Short Deportivo',
  'Short deportivo de algodón con licra. Fresco y transpirable. Ideal para jugar y hacer deporte.',
  9900, 7200,
  ARRAY['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Negro', 'Gris', 'Azul Marino', 'Rojo'],
  'pantalones'
),
(
  'Polerón Hoodie',
  'Polerón con capucha forrado en algodón felpa. Bolsillo canguro frontal. Capucha ajustable con cordones.',
  18900, 13900,
  ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80', 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Negro', 'Gris', 'Azul Marino', 'Burdeo'],
  'polerones'
),
(
  'Polerón Canguro',
  'Polerón canguro sin capucha, corte clásico. Algodón felpa de alta gramaje.',
  16900, 12500,
  ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&q=80'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Gris', 'Negro', 'Verde Bosque', 'Terracota'],
  'polerones'
),
(
  'Vestido Verano',
  'Vestido de algodón para niña. Fresco, cómodo y con vuelo. Perfecto para el verano.',
  12900, 9500,
  ARRAY['https://images.unsplash.com/photo-1623939804672-72b440a4a5d6?w=600&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Blanco', 'Rosado', 'Celeste', 'Lavanda'],
  'vestidos'
),
(
  'Parka Invierno',
  'Parka acolchada con capucha desmontable. Impermeable y muy abrigadora.',
  24900, 18900,
  ARRAY['https://images.unsplash.com/photo-1544923246-77307dd270b1?w=600&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Negro', 'Azul Marino', 'Rojo', 'Verde'],
  'abrigos'
);

-- Stock inicial (50 unidades por cada combinación talla/color)
INSERT INTO stock (producto_id, talla, color, cantidad_disponible)
SELECT p.id, t.talla, c.color, 50
FROM productos p
CROSS JOIN LATERAL unnest(p.tallas) AS t(talla)
CROSS JOIN LATERAL unnest(p.colores) AS c(color);
