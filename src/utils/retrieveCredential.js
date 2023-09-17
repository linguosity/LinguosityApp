import { localStorageAuthKey } from "../context/FirebaseContext";

export default function retrieveCredential() {
  const credentialRaw = localStorage.getItem(localStorageAuthKey);
  if (credentialRaw) {
    return JSON.parse(credentialRaw)
  } else {
    return null
  }

}