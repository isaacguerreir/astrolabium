export const nameToPath = (name: string | null) => name ? name.replaceAll(' ', '_').toLowerCase() : '_' 
