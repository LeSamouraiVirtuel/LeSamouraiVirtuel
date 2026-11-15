// Positions des camps sur la carte (partagées entre le rendu 3D et l'écran du jeu, sans charger three.js)
export const CAMPS = [[12.75, 11.0], [8.38, 13.62], [4.0, 11.88], [3.12, 6.62], [7.5, 4.0], [11.88, 0.5], [7.5, -3.88], [1.38, -4.75], [-3.0, -0.38], [-5.62, -7.38]];
/** position à l'écran (px CSS du rendu) d'un point au sol, depuis l'origine (ax, ay) d'une image rendue */
export const iso = (ax, ay, x, z) => [ax + (x - z) * 32, ay + (x + z) * 16];
