let email = '';

export function setAuthEmail(e: string) {
  email = e ?? '';
}

export function getAuthEmail() {
  return email;
}
