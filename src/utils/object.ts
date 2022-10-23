export const isEmpty = (obj: Record<string, any>) => {
	for (const _key in obj) {
    console.log('key', _key)
    return false;
  }
  return true;
}
