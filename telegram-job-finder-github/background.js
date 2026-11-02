chrome.action.onClicked.addListener(async (tab) => {
  try {
    const current = await chrome.storage.local.get("preferredTelegramTabId");
    const targetId = tab?.url?.startsWith("https://web.telegram.org/") ? tab.id : current.preferredTelegramTabId;
    if (targetId) await chrome.storage.local.set({ preferredTelegramTabId: targetId });

    const dashboardUrl = chrome.runtime.getURL("dashboard.html");
    const allTabs = await chrome.tabs.query({});
    const existing = allTabs.filter((item) => String(item.url || "").startsWith(dashboardUrl));
    const nextUrl = targetId ? `${dashboardUrl}?targetTabId=${targetId}` : dashboardUrl;
    if (existing.length && existing[0].id) {
      await chrome.tabs.update(existing[0].id, { url: nextUrl, active: true });
    } else {
      await chrome.tabs.create({ url: nextUrl });
    }
  } catch (error) {
    console.error("Telegram Job Finder dashboard could not be opened:", error);
  }
});
