export function isAdminToken(storedToken: string) {
    try {
        const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
        return tokenPayload.isAdmin;
    } catch (error) {
        console.error('Error parsing token:', error);
        return false;
    }
}
