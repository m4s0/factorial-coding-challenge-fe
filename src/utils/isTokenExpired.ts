export function isTokenExpired(storedToken: string) {
    const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
    return tokenPayload.exp * 1000 < Date.now();
}
