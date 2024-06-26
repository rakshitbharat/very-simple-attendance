export function getAuthHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    return `${user.email}|||${user.password}${
      user.ptp ? "|||" + user.ptp : ""
    }`;
  }
  return null;
}

export function setUserData(userData) {
  localStorage.setItem("user", JSON.stringify(userData));
}

export function getUserData() {
  return JSON.parse(localStorage.getItem("user"));
}

export function clearUserData() {
  localStorage.removeItem("user");
}

export function isAuthenticated() {
  return !!getUserData();
}
