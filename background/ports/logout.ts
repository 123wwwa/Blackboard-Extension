import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.PortHandler = async (req: any, res) => {
    const { token } = await chrome.identity.getAuthToken({ interactive: false });
  // Check if token is valid (not undefined or null) before proceeding
  if (token) {
    await chrome.identity.removeCachedAuthToken({ token });
  } else {
    // Handle the case where token is undefined or null
    console.error("Failed to retrieve token.");
  }
}
export default handler