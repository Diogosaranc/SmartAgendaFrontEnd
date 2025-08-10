export function getInitials(name: string | undefined): string {
  if (!name) {
    return 'SA';
  }
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  let counter = 0;
  const initials = names.map((name) => {
    if (counter < 2) {
      counter++;
      return name.charAt(0).toUpperCase();
    }
  });
  return initials.join('');
}
