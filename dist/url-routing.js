export function normalizeDirectoryUrl(locationObject=location,historyObject=history){
  const suffix="/index.html";
  if(!locationObject.pathname.endsWith(suffix))return false;
  const cleanPath=locationObject.pathname.slice(0,-"index.html".length);
  historyObject.replaceState(historyObject.state,"",cleanPath+locationObject.search+locationObject.hash);
  return true;
}
